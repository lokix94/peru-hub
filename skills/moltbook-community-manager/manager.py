#!/usr/bin/env python3
"""
Moltbook Community Manager — Monitor and manage comments on your posts.
Tracks new comments, categorizes spam, and suggests replies.
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
import urllib.request
import urllib.error

API_BASE = "https://www.moltbook.com/api/v1"
STATE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".last_check.json")

# URL patterns for spam detection
SPAM_PATTERNS = [
    r'https?://\S+\.(xyz|tk|ml|ga|cf|gq|click|buzz|top)',
    r'(?:check\s+out|visit|click)\s+(?:my|this)\s+(?:link|site|page|channel)',
    r'(?:follow\s+me|sub(?:scribe)?)\s+(?:at|on|@)',
    r'(?:free\s+(?:money|crypto|tokens|nft))',
    r'(?:earn\s+\$?\d+\s+(?:daily|per\s+day|per\s+hour))',
    r'(?:join\s+(?:my|our)\s+(?:discord|telegram|group))',
    r'(?:DM\s+me\s+for)',
]

QUESTION_PATTERNS = [
    r'\?$',
    r'^(?:how|what|why|when|where|who|which|can|could|would|should|is|are|do|does|did)\b',
    r'(?:anyone\s+know|does\s+anyone|help\s+me)',
    r'(?:explain|elaborate|clarify)',
]


def get_api_key():
    """Resolve API key from env or credentials file."""
    key = os.environ.get("MOLTBOOK_API_KEY", "")
    if key:
        return key

    creds_path = os.path.expanduser("~/.config/moltbook/credentials.json")
    if os.path.exists(creds_path):
        try:
            with open(creds_path) as f:
                creds = json.load(f)
            return creds.get("api_key", creds.get("token", ""))
        except Exception:
            pass
    return ""


def api_get(path, api_key):
    """Make authenticated GET request to Moltbook API."""
    url = f"{API_BASE}{path}"
    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {api_key}")
    req.add_header("Accept", "application/json")

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        print(f"❌ API error: HTTP {e.code} — {e.reason}", file=sys.stderr)
        return None
    except urllib.error.URLError as e:
        print(f"❌ Connection error: {e.reason}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        return None


def fetch_my_posts(api_key, username, limit=50):
    """Fetch the user's posts."""
    path = f"/posts?limit={limit}"
    if username:
        path += f"&author={username}"
    data = api_get(path, api_key)
    if data is None:
        return []
    return data if isinstance(data, list) else data.get("posts", data.get("data", []))


def fetch_comments(api_key, post_id):
    """Fetch comments for a specific post."""
    data = api_get(f"/posts/{post_id}/comments", api_key)
    if data is None:
        return []
    return data if isinstance(data, list) else data.get("comments", data.get("data", []))


def load_state():
    """Load the last check state."""
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE) as f:
                return json.load(f)
        except Exception:
            pass
    return {"last_check": None, "seen_comment_ids": []}


def save_state(state):
    """Save the check state."""
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)


def categorize_comment(comment):
    """Categorize a comment as spam, question, or genuine."""
    text = comment.get("content", comment.get("body", comment.get("text", "")))
    text_lower = text.lower()

    # Check spam patterns
    for pattern in SPAM_PATTERNS:
        if re.search(pattern, text_lower):
            return "spam"

    # Check if it contains mostly URLs
    urls = re.findall(r'https?://\S+', text)
    if urls and len(text.split()) < 10:
        return "spam"

    # Check question patterns
    for pattern in QUESTION_PATTERNS:
        if re.search(pattern, text_lower):
            return "question"

    return "genuine"


def generate_reply_suggestion(comment):
    """Generate a simple reply suggestion for genuine comments."""
    text = comment.get("content", comment.get("body", comment.get("text", "")))
    text_lower = text.lower()
    author = comment.get("author", {})
    if isinstance(author, dict):
        author_name = author.get("username", author.get("name", "friend"))
    else:
        author_name = str(author)

    if any(w in text_lower for w in ["great", "awesome", "amazing", "love", "nice", "good"]):
        return f"Thanks @{author_name}! Glad you enjoyed it 🦞"
    elif any(w in text_lower for w in ["agree", "same", "true", "exactly", "right"]):
        return f"Appreciate the support @{author_name}! 🙌"
    elif any(w in text_lower for w in ["interesting", "cool", "neat", "fascinating"]):
        return f"Thanks for reading @{author_name}! There's more to explore on this topic."
    elif "?" in text:
        return f"Great question @{author_name}! Let me think about that and get back to you."
    else:
        return f"Thanks for your comment @{author_name}! 🇵🇪"


def format_comment(comment, post_title=""):
    """Format a comment for display."""
    author = comment.get("author", {})
    if isinstance(author, dict):
        author_name = author.get("username", author.get("name", "unknown"))
    else:
        author_name = str(author)

    text = comment.get("content", comment.get("body", comment.get("text", "")))
    preview = text[:80] + ("..." if len(text) > 80 else "")

    ts = comment.get("created_at", comment.get("timestamp", ""))
    if isinstance(ts, (int, float)):
        ts = datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d %H:%M")

    category = categorize_comment(comment)
    cat_icon = {"spam": "🚫", "question": "❓", "genuine": "💬"}.get(category, "💬")

    post_info = f" (on: {post_title})" if post_title else ""
    return f"  {cat_icon} **@{author_name}** — {preview}\n     _{ts}{post_info}_"


def cmd_check(api_key, username):
    """Show new comments since last check."""
    state = load_state()
    last_check = state.get("last_check")
    seen_ids = set(state.get("seen_comment_ids", []))

    posts = fetch_my_posts(api_key, username)
    if not posts:
        print("📭 No posts found.")
        return

    new_comments = []
    all_comment_ids = list(seen_ids)

    print(f"🔍 Checking comments on {len(posts)} posts...")
    if last_check:
        print(f"   Last check: {last_check}")
    print()

    for post in posts:
        post_id = post.get("id")
        post_title = post.get("title", "Untitled")
        if not post_id:
            continue

        comments = fetch_comments(api_key, post_id)
        for c in comments:
            cid = str(c.get("id", ""))
            all_comment_ids.append(cid)

            if cid and cid not in seen_ids:
                c["_post_title"] = post_title
                c["_post_id"] = post_id
                new_comments.append(c)

    # Update state
    state["last_check"] = datetime.now(timezone.utc).isoformat()
    state["seen_comment_ids"] = list(set(all_comment_ids))
    save_state(state)

    if not new_comments:
        print("✅ No new comments since last check.")
        return

    print(f"🆕 **{len(new_comments)} new comments found!**\n")

    # Group by category
    genuine = [c for c in new_comments if categorize_comment(c) == "genuine"]
    questions = [c for c in new_comments if categorize_comment(c) == "question"]
    spam = [c for c in new_comments if categorize_comment(c) == "spam"]

    if genuine:
        print(f"💬 Genuine Engagement ({len(genuine)}):")
        for c in genuine:
            print(format_comment(c, c.get("_post_title", "")))
            print(f"     💡 Suggested reply: {generate_reply_suggestion(c)}")
            print()

    if questions:
        print(f"❓ Questions ({len(questions)}):")
        for c in questions:
            print(format_comment(c, c.get("_post_title", "")))
            print(f"     💡 Suggested reply: {generate_reply_suggestion(c)}")
            print()

    if spam:
        print(f"🚫 Suspected Spam ({len(spam)}):")
        for c in spam:
            print(format_comment(c, c.get("_post_title", "")))
            print()


def cmd_history(api_key, username):
    """Show all comments across all posts."""
    posts = fetch_my_posts(api_key, username)
    if not posts:
        print("📭 No posts found.")
        return

    print(f"📜 Comment History — {len(posts)} posts\n")

    total_comments = 0
    for post in posts:
        post_id = post.get("id")
        post_title = post.get("title", "Untitled")
        if not post_id:
            continue

        comments = fetch_comments(api_key, post_id)
        if comments:
            print(f"### {post_title}")
            print(f"    ({len(comments)} comments)\n")
            for c in comments:
                print(format_comment(c))
                print()
            total_comments += len(comments)

    print(f"---\n📊 Total: {total_comments} comments across {len(posts)} posts")


def cmd_spam(api_key, username):
    """List suspected spam comments."""
    posts = fetch_my_posts(api_key, username)
    if not posts:
        print("📭 No posts found.")
        return

    print("🚫 Suspected Spam Comments\n")

    spam_count = 0
    for post in posts:
        post_id = post.get("id")
        post_title = post.get("title", "Untitled")
        if not post_id:
            continue

        comments = fetch_comments(api_key, post_id)
        for c in comments:
            if categorize_comment(c) == "spam":
                print(format_comment(c, post_title))
                text = c.get("content", c.get("body", c.get("text", "")))
                urls = re.findall(r'https?://\S+', text)
                if urls:
                    print(f"     🔗 URLs: {', '.join(urls)}")
                print()
                spam_count += 1

    if spam_count == 0:
        print("✅ No spam detected! Your community is clean. 🦞")
    else:
        print(f"---\n⚠️  Found {spam_count} suspected spam comments.")


def main():
    parser = argparse.ArgumentParser(
        description="🦞 Moltbook Community Manager — Monitor and manage your post comments",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--api-key", "-k", help="Moltbook API key (or MOLTBOOK_API_KEY env)")
    parser.add_argument("--username", "-u", help="Your Moltbook username")

    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--check", action="store_true", help="Show new comments since last check")
    group.add_argument("--history", action="store_true", help="Show all comments across all posts")
    group.add_argument("--spam", action="store_true", help="List suspected spam comments")

    args = parser.parse_args()

    api_key = args.api_key or get_api_key()
    if not api_key:
        print("❌ No API key. Use --api-key, MOLTBOOK_API_KEY, or ~/.config/moltbook/credentials.json", file=sys.stderr)
        sys.exit(1)

    username = args.username or os.environ.get("MOLTBOOK_USERNAME", "")

    if args.check:
        cmd_check(api_key, username)
    elif args.history:
        cmd_history(api_key, username)
    elif args.spam:
        cmd_spam(api_key, username)


if __name__ == "__main__":
    main()
