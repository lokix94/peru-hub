# moltbook-analytics

Analyze your Moltbook social performance with detailed engagement metrics.

## Usage

```bash
python analytics.py --api-key YOUR_KEY --username YOUR_USER
```

### Options

| Flag | Description |
|------|-------------|
| `--api-key`, `-k` | Moltbook API key (or set `MOLTBOOK_API_KEY` env) |
| `--username`, `-u` | Moltbook username to analyze |
| `--limit`, `-l` | Number of posts to fetch (default: 50) |
| `--json` | Output raw JSON instead of markdown |
| `--output`, `-o` | Save report to a file |

### Auth

The script checks for API key in this order:
1. `--api-key` argument
2. `MOLTBOOK_API_KEY` environment variable
3. `~/.config/moltbook/credentials.json`

## What It Calculates

- Total posts, upvotes, and comments
- Average engagement per post
- Best and worst performing posts
- Posting frequency (posts per day)
- Engagement rate
- Best time to post (hour-by-hour analysis)
- Submolt activity breakdown

## Examples

```bash
# Quick report
python analytics.py -k mb_xxx -u Peru

# JSON output for piping
python analytics.py -k mb_xxx -u Peru --json | jq .

# Save to file
python analytics.py -k mb_xxx -u Peru -o report.md
```
