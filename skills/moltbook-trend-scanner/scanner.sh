#!/usr/bin/env bash
#
# Moltbook Trend Scanner — Discover what's trending on Moltbook
# Usage: ./scanner.sh [--json] [--keywords WORDS] [--top N]
#

set -euo pipefail

API_BASE="https://www.moltbook.com/api/v1"
OUTPUT_JSON=false
KEYWORDS=""
TOP_N=10

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ---------- Helpers ----------

get_api_key() {
    if [[ -n "${MOLTBOOK_API_KEY:-}" ]]; then
        echo "$MOLTBOOK_API_KEY"
        return
    fi
    local creds="$HOME/.config/moltbook/credentials.json"
    if [[ -f "$creds" ]]; then
        local key
        key=$(python3 -c "import json; d=json.load(open('$creds')); print(d.get('api_key', d.get('token', '')))" 2>/dev/null || true)
        if [[ -n "$key" ]]; then
            echo "$key"
            return
        fi
    fi
    echo ""
}

api_fetch() {
    local path="$1"
    local api_key="$2"
    local url="${API_BASE}${path}"

    local response
    response=$(curl -sf -H "Authorization: Bearer ${api_key}" -H "Accept: application/json" "$url" 2>/dev/null) || {
        echo "[]"
        return
    }
    echo "$response"
}

# ---------- Parse args ----------

usage() {
    cat <<EOF
🔥 Moltbook Trend Scanner v1.0.0

Usage:
  $(basename "$0") [OPTIONS]

Options:
  --json              Output raw JSON instead of markdown
  --keywords WORDS    Filter by keywords (comma-separated)
  --top N             Show top N posts per category (default: 10)
  --help, -h          Show this help

Environment:
  MOLTBOOK_API_KEY    API key (or use ~/.config/moltbook/credentials.json)

Examples:
  $(basename "$0")                          # Full trending report
  $(basename "$0") --top 5                  # Top 5 per category
  $(basename "$0") --keywords lobster,peru  # Filter by topics
  $(basename "$0") --json | jq .            # JSON for piping
EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --json)      OUTPUT_JSON=true; shift ;;
        --keywords)  KEYWORDS="$2"; shift 2 ;;
        --top)       TOP_N="$2"; shift 2 ;;
        --help|-h)   usage; exit 0 ;;
        *)           echo "Unknown option: $1"; usage; exit 1 ;;
    esac
done

# ---------- Fetch & Analyze ----------

api_key=$(get_api_key)
if [[ -z "$api_key" ]]; then
    echo -e "${RED}❌ No API key found. Set MOLTBOOK_API_KEY or configure ~/.config/moltbook/credentials.json${NC}" >&2
    exit 1
fi

echo -e "${BLUE}🔍 Scanning Moltbook for trends...${NC}" >&2

POSTS_DATA=$(api_fetch "/posts?limit=100&sort=new" "$api_key")
FEED_DATA=$(api_fetch "/feed?limit=100" "$api_key")

# Write data to temp files for Python
TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

echo "$POSTS_DATA" > "$TMPDIR/posts.json"
echo "$FEED_DATA" > "$TMPDIR/feed.json"

python3 - "$TMPDIR" "$OUTPUT_JSON" "$KEYWORDS" "$TOP_N" << 'PYEOF'
import json
import sys
import re
import os
from datetime import datetime, timezone, timedelta
from collections import Counter

tmpdir = sys.argv[1]
output_json = sys.argv[2] == "true"
keywords_filter = sys.argv[3]
top_n = int(sys.argv[4])

with open(os.path.join(tmpdir, "posts.json")) as f:
    posts_raw = json.load(f)
with open(os.path.join(tmpdir, "feed.json")) as f:
    feed_raw = json.load(f)

def extract_posts(data):
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        return data.get("posts", data.get("data", data.get("items", [])))
    return []

posts = extract_posts(posts_raw)
feed_posts = extract_posts(feed_raw)

# Merge and deduplicate
all_posts = {}
for p in posts + feed_posts:
    pid = str(p.get("id", id(p)))
    if pid not in all_posts:
        all_posts[pid] = p

posts_list = list(all_posts.values())

if not posts_list:
    if output_json:
        print(json.dumps({"error": "No posts found", "total": 0}))
    else:
        print("📭 No posts found on Moltbook.")
    sys.exit(0)

now = datetime.now(timezone.utc)

# Enrich posts with computed fields
for p in posts_list:
    ts = p.get("created_at", p.get("timestamp", p.get("date", "")))
    try:
        if isinstance(ts, (int, float)):
            p["_dt"] = datetime.fromtimestamp(ts, tz=timezone.utc)
        elif ts:
            p["_dt"] = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        else:
            p["_dt"] = now
    except (ValueError, TypeError):
        p["_dt"] = now

    p["_upvotes"] = p.get("upvotes", p.get("score", 0))
    p["_comments"] = p.get("comment_count", p.get("comments", 0))
    p["_age_hours"] = max((now - p["_dt"]).total_seconds() / 3600, 0.1)
    p["_engagement"] = p["_upvotes"] + p["_comments"]
    p["_rising_score"] = p["_engagement"] / p["_age_hours"]

    author = p.get("author", {})
    if isinstance(author, dict):
        p["_author"] = author.get("username", author.get("name", "unknown"))
    else:
        p["_author"] = str(author) if author else "unknown"

    submolt = p.get("submolt", p.get("community", ""))
    if isinstance(submolt, dict):
        p["_submolt"] = submolt.get("name", "unknown")
    else:
        p["_submolt"] = str(submolt) if submolt else "unknown"

# Keyword filtering
if keywords_filter:
    kw_list = [k.strip().lower() for k in keywords_filter.split(",")]
    posts_list = [p for p in posts_list if any(
        kw in p.get("title", "").lower() or kw in p.get("content", p.get("body", "")).lower()
        for kw in kw_list
    )]
    if not posts_list:
        print("📭 No posts matching keywords: " + keywords_filter)
        sys.exit(0)

# Time filtering
day_ago = now - timedelta(hours=24)
recent = [p for p in posts_list if p["_dt"] >= day_ago]

# Rankings
most_upvoted = sorted(posts_list, key=lambda p: p["_upvotes"], reverse=True)[:top_n]
most_commented = sorted(posts_list, key=lambda p: p["_comments"], reverse=True)[:top_n]
rising = sorted(posts_list, key=lambda p: p["_rising_score"], reverse=True)[:top_n]

# Author activity
author_counts = Counter(p["_author"] for p in posts_list)
active_authors = author_counts.most_common(10)

# Submolt activity
submolt_counts = Counter(p["_submolt"] for p in posts_list)

# Keyword extraction
stop_words = {"the","a","an","is","are","was","were","be","been","being","have","has","had",
              "do","does","did","will","would","could","should","may","might","shall","can",
              "to","of","in","for","on","with","at","by","from","as","into","through","during",
              "before","after","above","below","between","out","off","over","under","again",
              "further","then","once","here","there","when","where","why","how","all","both",
              "each","few","more","most","other","some","such","no","nor","not","only","own",
              "same","so","than","too","very","and","but","or","if","it","its","i","my","me",
              "we","our","you","your","he","she","they","them","this","that","these","those",
              "what","which","who","whom"}

words = Counter()
for p in posts_list:
    text = f"{p.get('title', '')} {p.get('content', p.get('body', ''))}".lower()
    tokens = re.findall(r'[a-z]+', text)
    for t in tokens:
        if len(t) > 2 and t not in stop_words:
            words[t] += 1

common_keywords = words.most_common(20)

# Build result object
result = {
    "scan_time": now.isoformat(),
    "total_posts_scanned": len(posts_list),
    "posts_last_24h": len(recent),
    "most_upvoted": [{
        "title": p.get("title", ""), "author": p["_author"],
        "upvotes": p["_upvotes"], "comments": p["_comments"],
        "submolt": p["_submolt"], "age_hours": round(p["_age_hours"], 1),
        "id": str(p.get("id", ""))
    } for p in most_upvoted],
    "most_commented": [{
        "title": p.get("title", ""), "author": p["_author"],
        "comments": p["_comments"], "upvotes": p["_upvotes"],
        "submolt": p["_submolt"], "id": str(p.get("id", ""))
    } for p in most_commented],
    "rising": [{
        "title": p.get("title", ""), "author": p["_author"],
        "rising_score": round(p["_rising_score"], 2),
        "upvotes": p["_upvotes"], "comments": p["_comments"],
        "age_hours": round(p["_age_hours"], 1), "id": str(p.get("id", ""))
    } for p in rising],
    "active_authors": [{"username": a, "posts": c} for a, c in active_authors],
    "active_submolts": [{"name": s, "posts": c} for s, c in submolt_counts.most_common(10)],
    "trending_keywords": [{"word": w, "count": c} for w, c in common_keywords],
}

# JSON output
if output_json:
    print(json.dumps(result, indent=2))
    sys.exit(0)

# Markdown report
print(f"# 🔥 Moltbook Trending Report")
print(f"**Scanned:** {result['total_posts_scanned']} posts | **Last 24h:** {result['posts_last_24h']} posts  ")
print(f"**Generated:** {now.strftime('%Y-%m-%d %H:%M UTC')}  ")
if keywords_filter:
    print(f"**Filtered by:** {keywords_filter}  ")
print()
print("---")
print()

print("## ⬆️ Most Upvoted Posts")
print()
for i, p in enumerate(result["most_upvoted"], 1):
    print(f"{i}. **{p['title']}** — ⬆️ {p['upvotes']} | 💬 {p['comments']}")
    print(f"   by @{p['author']} in m/{p['submolt']} ({p['age_hours']}h ago)")
print()

print("## 💬 Most Commented Posts")
print()
for i, p in enumerate(result["most_commented"], 1):
    print(f"{i}. **{p['title']}** — 💬 {p['comments']} | ⬆️ {p['upvotes']}")
    print(f"   by @{p['author']} in m/{p['submolt']}")
print()

print("## 🚀 Rising Posts (engagement/age)")
print()
for i, p in enumerate(result["rising"], 1):
    print(f"{i}. **{p['title']}** — 📈 score: {p['rising_score']}")
    print(f"   ⬆️ {p['upvotes']} | 💬 {p['comments']} | {p['age_hours']}h old | by @{p['author']}")
print()

print("## 👥 Most Active Authors")
print()
print("| Author | Posts |")
print("|--------|-------|")
for a in result["active_authors"]:
    print(f"| @{a['username']} | {a['posts']} |")
print()

print("## 🦞 Active Submolts")
print()
print("| Submolt | Posts |")
print("|---------|-------|")
for s in result["active_submolts"]:
    print(f"| m/{s['name']} | {s['posts']} |")
print()

print("## 🔑 Trending Keywords")
print()
kw_str = ", ".join(f"**{w['word']}** ({w['count']})" for w in result["trending_keywords"][:15])
print(kw_str)
print()

print("---")
print("*Generated by moltbook-trend-scanner v1.0.0 — Peru 🇵🇪*")
PYEOF
