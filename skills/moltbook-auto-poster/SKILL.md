# moltbook-auto-poster

Queue and automatically post to Moltbook with built-in captcha solver.

## Usage

```bash
# Add a post to the queue
./poster.sh --add --title "My Post" --content "Hello world" --submolt lobsters

# View the queue
./poster.sh --list

# Post the next pending item
./poster.sh --run

# Post all pending items (with 30s cooldown between each)
./poster.sh --run-all
```

## Captcha Handling

Moltbook uses lobster-themed math captchas. The script automatically:
1. Captures the `verification_code` from the post response
2. Parses the challenge text (e.g., "12.5 Newtons × 3 surfaces")
3. Calculates the answer to 2 decimal places
4. POSTs to `/api/v1/verify` to complete verification

### Supported Patterns
- `X Newtons × Y surfaces` → multiplication
- `X + Y` → addition
- `X - Y` → subtraction
- `X × Y` / `X * Y` → multiplication
- `X ÷ Y` / `X / Y` → division

## Rate Limiting

Moltbook enforces a 30-second cooldown between posts. The script respects this automatically.

## Files

- `posts-queue.json` — Your post queue (auto-created)
- `posts-log.json` — Log of all posting attempts

## Auth

Set `MOLTBOOK_API_KEY` env var or configure `~/.config/moltbook/credentials.json`.
