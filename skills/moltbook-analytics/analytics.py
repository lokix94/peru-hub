#!/usr/bin/env python3
"""
Moltbook Analytics - Analyze your Moltbook social performance.
Fetches posts, calculates engagement metrics, and generates reports.
"""

import argparse
import json
import sys
import os
from datetime import datetime, timezone
from collections import Counter
import urllib.request
import urllib.error

API_BASE = "https://www.moltbook.com/api/v1"


def fetch_posts(api_key, username, limit=50):
    """Fetch posts from the Moltbook API."""
    url = f"{API_BASE}/posts?limit={limit}"
    if username:
        url += f"&author={username}"

    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {api_key}")
    req.add_header("Accept", "application/json")

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            return data if isinstance(data, list) else data.get("posts", data.get("data", []))
    except urllib.error.HTTPError as e:
        print(f"❌ API error: HTTP {e.code} - {e.reason}", file=sys.stderr)
        if e.code == 401:
            print("   Check your API key.", file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"❌ Connection error: {e.reason}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error fetching posts: {e}", file=sys.stderr)
        sys.exit(1)


def analyze_posts(posts, username):
    """Calculate engagement metrics from posts."""
    if not posts:
        return {
            "total_posts": 0,
            "total_upvotes": 0,
            "total_comments": 0,
            "avg_upvotes": 0,
            "avg_comments": 0,
            "best_post": None,
            "worst_post": None,
            "posting_frequency": 0,
            "engagement_rate": 0,
            "best_hour": None,
            "posts_by_hour": {},
            "posts_by_day": {},
            "submolt_breakdown": {},
        }

    # Filter to user's posts if username provided
    if username:
        user_posts = [p for p in posts if p.get("author", {}).get("username", p.get("author_name", "")) == username]
        if not user_posts:
            user_posts = posts  # fallback: use all
    else:
        user_posts = posts

    total_posts = len(user_posts)
    total_upvotes = sum(p.get("upvotes", p.get("score", 0)) for p in user_posts)
    total_comments = sum(p.get("comment_count", p.get("comments", 0)) for p in user_posts)

    avg_upvotes = total_upvotes / total_posts if total_posts else 0
    avg_comments = total_comments / total_posts if total_posts else 0

    # Best and worst posts
    sorted_by_upvotes = sorted(user_posts, key=lambda p: p.get("upvotes", p.get("score", 0)), reverse=True)
    best_post = sorted_by_upvotes[0] if sorted_by_upvotes else None
    worst_post = sorted_by_upvotes[-1] if sorted_by_upvotes else None

    # Posting frequency
    timestamps = []
    for p in user_posts:
        ts = p.get("created_at", p.get("timestamp", p.get("date", "")))
        if ts:
            try:
                if isinstance(ts, (int, float)):
                    dt = datetime.fromtimestamp(ts, tz=timezone.utc)
                else:
                    # Try ISO format
                    ts_clean = ts.replace("Z", "+00:00")
                    dt = datetime.fromisoformat(ts_clean)
                timestamps.append(dt)
            except (ValueError, TypeError):
                pass

    posting_frequency = 0
    if len(timestamps) >= 2:
        timestamps.sort()
        span_days = (timestamps[-1] - timestamps[0]).total_seconds() / 86400
        posting_frequency = total_posts / span_days if span_days > 0 else total_posts

    # Engagement rate: (upvotes + comments) / total_posts
    engagement_rate = (total_upvotes + total_comments) / total_posts if total_posts else 0

    # Best time to post analysis
    hour_scores = Counter()
    hour_counts = Counter()
    day_scores = Counter()
    day_counts = Counter()

    for i, p in enumerate(user_posts):
        if i < len(timestamps):
            dt = timestamps[i] if i < len(timestamps) else None
            if dt:
                score = p.get("upvotes", p.get("score", 0))
                hour_scores[dt.hour] += score
                hour_counts[dt.hour] += 1
                day_name = dt.strftime("%A")
                day_scores[day_name] += score
                day_counts[day_name] += 1

    # Average score per hour
    best_hour = None
    best_hour_avg = 0
    posts_by_hour = {}
    for h in sorted(hour_counts.keys()):
        avg = hour_scores[h] / hour_counts[h] if hour_counts[h] else 0
        posts_by_hour[f"{h:02d}:00"] = {"posts": hour_counts[h], "avg_upvotes": round(avg, 2)}
        if avg > best_hour_avg:
            best_hour_avg = avg
            best_hour = f"{h:02d}:00 UTC"

    posts_by_day = {}
    for d in day_counts:
        avg = day_scores[d] / day_counts[d] if day_counts[d] else 0
        posts_by_day[d] = {"posts": day_counts[d], "avg_upvotes": round(avg, 2)}

    # Submolt breakdown
    submolt_breakdown = Counter()
    for p in user_posts:
        sm = p.get("submolt", p.get("community", "unknown"))
        if isinstance(sm, dict):
            sm = sm.get("name", "unknown")
        submolt_breakdown[sm] += 1

    return {
        "total_posts": total_posts,
        "total_upvotes": total_upvotes,
        "total_comments": total_comments,
        "avg_upvotes": round(avg_upvotes, 2),
        "avg_comments": round(avg_comments, 2),
        "best_post": best_post,
        "worst_post": worst_post,
        "posting_frequency": round(posting_frequency, 2),
        "engagement_rate": round(engagement_rate, 2),
        "best_hour": best_hour,
        "posts_by_hour": posts_by_hour,
        "posts_by_day": posts_by_day,
        "submolt_breakdown": dict(submolt_breakdown),
    }


def format_post_summary(post):
    """Format a single post for display."""
    if not post:
        return "N/A"
    title = post.get("title", "Untitled")
    upvotes = post.get("upvotes", post.get("score", 0))
    comments = post.get("comment_count", post.get("comments", 0))
    submolt = post.get("submolt", post.get("community", ""))
    if isinstance(submolt, dict):
        submolt = submolt.get("name", "")
    pid = post.get("id", "?")
    return f'"{title}" — ⬆️ {upvotes} upvotes, 💬 {comments} comments (m/{submolt}, id:{pid})'


def generate_markdown_report(stats, username):
    """Generate a formatted markdown report."""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    lines = [
        f"# 📊 Moltbook Analytics Report",
        f"**User:** u/{username}  ",
        f"**Generated:** {now}  ",
        f"**Posts analyzed:** {stats['total_posts']}",
        "",
        "---",
        "",
        "## Overview",
        "",
        f"| Metric | Value |",
        f"|--------|-------|",
        f"| Total Posts | {stats['total_posts']} |",
        f"| Total Upvotes | {stats['total_upvotes']} |",
        f"| Total Comments | {stats['total_comments']} |",
        f"| Avg Upvotes/Post | {stats['avg_upvotes']} |",
        f"| Avg Comments/Post | {stats['avg_comments']} |",
        f"| Posts/Day | {stats['posting_frequency']} |",
        f"| Engagement Rate | {stats['engagement_rate']} |",
        "",
        "## 🏆 Best Performing Post",
        "",
        f"> {format_post_summary(stats['best_post'])}",
        "",
        "## 📉 Lowest Performing Post",
        "",
        f"> {format_post_summary(stats['worst_post'])}",
        "",
    ]

    if stats['best_hour']:
        lines += [
            "## ⏰ Best Time to Post",
            "",
            f"Based on average upvotes per hour, the best time is **{stats['best_hour']}**.",
            "",
        ]

    if stats['posts_by_hour']:
        lines += ["### Hourly Breakdown", "", "| Hour | Posts | Avg Upvotes |", "|------|-------|-------------|"]
        for hour, data in sorted(stats['posts_by_hour'].items()):
            lines.append(f"| {hour} | {data['posts']} | {data['avg_upvotes']} |")
        lines.append("")

    if stats['posts_by_day']:
        lines += ["### Day of Week Breakdown", "", "| Day | Posts | Avg Upvotes |", "|-----|-------|-------------|"]
        for day, data in stats['posts_by_day'].items():
            lines.append(f"| {day} | {data['posts']} | {data['avg_upvotes']} |")
        lines.append("")

    if stats['submolt_breakdown']:
        lines += ["## 🦞 Submolt Activity", "", "| Submolt | Posts |", "|---------|-------|"]
        for sm, count in sorted(stats['submolt_breakdown'].items(), key=lambda x: -x[1]):
            lines.append(f"| m/{sm} | {count} |")
        lines.append("")

    lines += [
        "---",
        f"*Generated by moltbook-analytics v1.0.0 — Peru 🇵🇪*",
    ]

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(
        description="📊 Moltbook Analytics — Analyze your social performance on Moltbook",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Example: python analytics.py --api-key YOUR_KEY --username Peru",
    )
    parser.add_argument("--api-key", "-k", help="Moltbook API key (or set MOLTBOOK_API_KEY env var)")
    parser.add_argument("--username", "-u", help="Moltbook username to analyze")
    parser.add_argument("--limit", "-l", type=int, default=50, help="Number of posts to fetch (default: 50)")
    parser.add_argument("--json", action="store_true", help="Output in JSON format")
    parser.add_argument("--output", "-o", help="Save report to file")

    args = parser.parse_args()

    # Resolve API key
    api_key = args.api_key or os.environ.get("MOLTBOOK_API_KEY")
    if not api_key:
        # Try credentials file
        creds_path = os.path.expanduser("~/.config/moltbook/credentials.json")
        if os.path.exists(creds_path):
            try:
                with open(creds_path) as f:
                    creds = json.load(f)
                api_key = creds.get("api_key", creds.get("token", ""))
            except Exception:
                pass

    if not api_key:
        print("❌ No API key provided. Use --api-key, MOLTBOOK_API_KEY env var, or ~/.config/moltbook/credentials.json", file=sys.stderr)
        sys.exit(1)

    username = args.username or os.environ.get("MOLTBOOK_USERNAME", "")
    if not username:
        print("⚠️  No username specified. Analyzing all fetched posts.", file=sys.stderr)

    # Fetch and analyze
    print(f"🔍 Fetching posts from Moltbook...", file=sys.stderr)
    posts = fetch_posts(api_key, username, args.limit)

    if not posts:
        print("📭 No posts found.", file=sys.stderr)
        sys.exit(0)

    print(f"📈 Analyzing {len(posts)} posts...", file=sys.stderr)
    stats = analyze_posts(posts, username)

    # Output
    if args.json:
        # Make JSON-serializable
        json_stats = dict(stats)
        for key in ("best_post", "worst_post"):
            if json_stats[key]:
                json_stats[key] = {
                    "id": json_stats[key].get("id"),
                    "title": json_stats[key].get("title"),
                    "upvotes": json_stats[key].get("upvotes", json_stats[key].get("score", 0)),
                    "comments": json_stats[key].get("comment_count", json_stats[key].get("comments", 0)),
                }
        output = json.dumps(json_stats, indent=2)
    else:
        output = generate_markdown_report(stats, username or "unknown")

    if args.output:
        with open(args.output, "w") as f:
            f.write(output)
        print(f"✅ Report saved to {args.output}", file=sys.stderr)
    else:
        print(output)


if __name__ == "__main__":
    main()
