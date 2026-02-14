#!/usr/bin/env bash
#
# Moltbook Auto-Poster — Queue and post to Moltbook with captcha handling
# Usage: ./poster.sh --run | --add | --list
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
QUEUE_FILE="${SCRIPT_DIR}/posts-queue.json"
LOG_FILE="${SCRIPT_DIR}/posts-log.json"
API_BASE="https://www.moltbook.com/api/v1"
COOLDOWN=30

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

ensure_queue() {
    if [[ ! -f "$QUEUE_FILE" ]]; then
        echo '[]' > "$QUEUE_FILE"
    fi
}

ensure_log() {
    if [[ ! -f "$LOG_FILE" ]]; then
        echo '[]' > "$LOG_FILE"
    fi
}

timestamp_now() {
    date -u +"%Y-%m-%dT%H:%M:%SZ"
}

# ---------- Captcha Solver ----------

solve_captcha() {
    local challenge="$1"
    # Common Moltbook captcha patterns:
    #   "X Newtons × Y surfaces" → X * Y
    #   "X + Y"
    #   "X - Y"
    #   "X × Y" or "X * Y"
    #   "X ÷ Y" or "X / Y"
    # Always output 2 decimal places

    local answer=""

    # Pattern: "X Newtons × Y surfaces" or "X newtons * Y surfaces"
    if echo "$challenge" | grep -iqE '[0-9.]+\s*[Nn]ewtons?\s*[×\*xX]\s*[0-9.]+\s*surfaces?'; then
        local x y
        x=$(echo "$challenge" | grep -oE '[0-9.]+' | head -1)
        y=$(echo "$challenge" | grep -oE '[0-9.]+' | tail -1)
        answer=$(python3 -c "print(f'{$x * $y:.2f}')")
    # Pattern: "X × Y" or "X * Y" or "X x Y"
    elif echo "$challenge" | grep -qE '[0-9.]+\s*[×\*xX]\s*[0-9.]+'; then
        local x y
        x=$(echo "$challenge" | grep -oE '[0-9.]+' | head -1)
        y=$(echo "$challenge" | grep -oE '[0-9.]+' | tail -1)
        answer=$(python3 -c "print(f'{$x * $y:.2f}')")
    # Pattern: "X + Y"
    elif echo "$challenge" | grep -qE '[0-9.]+\s*\+\s*[0-9.]+'; then
        local x y
        x=$(echo "$challenge" | grep -oE '[0-9.]+' | head -1)
        y=$(echo "$challenge" | grep -oE '[0-9.]+' | tail -1)
        answer=$(python3 -c "print(f'{$x + $y:.2f}')")
    # Pattern: "X - Y"
    elif echo "$challenge" | grep -qE '[0-9.]+\s*\-\s*[0-9.]+'; then
        local x y
        x=$(echo "$challenge" | grep -oE '[0-9.]+' | head -1)
        y=$(echo "$challenge" | grep -oE '[0-9.]+' | tail -1)
        answer=$(python3 -c "print(f'{$x - $y:.2f}')")
    # Pattern: "X ÷ Y" or "X / Y"
    elif echo "$challenge" | grep -qE '[0-9.]+\s*[÷/]\s*[0-9.]+'; then
        local x y
        x=$(echo "$challenge" | grep -oE '[0-9.]+' | head -1)
        y=$(echo "$challenge" | grep -oE '[0-9.]+' | tail -1)
        answer=$(python3 -c "print(f'{$x / $y:.2f}')")
    else
        # Fallback: try to extract two numbers and multiply
        local nums
        nums=$(echo "$challenge" | grep -oE '[0-9.]+')
        local x y
        x=$(echo "$nums" | head -1)
        y=$(echo "$nums" | tail -1)
        if [[ -n "$x" && -n "$y" ]]; then
            answer=$(python3 -c "print(f'{$x * $y:.2f}')")
        else
            echo ""
            return 1
        fi
    fi

    echo "$answer"
}

# ---------- Commands ----------

cmd_add() {
    ensure_queue

    local title="" content="" submolt="" scheduled_time=""

    while [[ $# -gt 0 ]]; do
        case "$1" in
            --title)     title="$2"; shift 2 ;;
            --content)   content="$2"; shift 2 ;;
            --submolt)   submolt="$2"; shift 2 ;;
            --time)      scheduled_time="$2"; shift 2 ;;
            *)           shift ;;
        esac
    done

    if [[ -z "$title" ]]; then
        echo -e "${RED}❌ --title is required${NC}"
        exit 1
    fi
    if [[ -z "$content" ]]; then
        echo -e "${RED}❌ --content is required${NC}"
        exit 1
    fi

    scheduled_time="${scheduled_time:-$(timestamp_now)}"
    submolt="${submolt:-general}"

    # Add to queue using Python for safe JSON manipulation
    python3 -c "
import json, sys
with open('$QUEUE_FILE', 'r') as f:
    queue = json.load(f)
queue.append({
    'title': '''$title''',
    'content': '''$content''',
    'submolt': '$submolt',
    'scheduled_time': '$scheduled_time',
    'status': 'pending'
})
with open('$QUEUE_FILE', 'w') as f:
    json.dump(queue, f, indent=2)
print(f'✅ Added to queue ({len(queue)} items total)')
"
}

cmd_list() {
    ensure_queue

    echo -e "${BLUE}📋 Post Queue${NC}"
    echo "---"

    python3 -c "
import json
with open('$QUEUE_FILE', 'r') as f:
    queue = json.load(f)
if not queue:
    print('  (empty)')
else:
    for i, item in enumerate(queue):
        status_icon = '⏳' if item.get('status') == 'pending' else '✅' if item.get('status') == 'posted' else '❌'
        print(f'  {i+1}. {status_icon} [{item.get(\"submolt\", \"?\")}] {item[\"title\"]}')
        print(f'     Scheduled: {item.get(\"scheduled_time\", \"now\")} | Status: {item.get(\"status\", \"pending\")}')
"
}

cmd_run() {
    ensure_queue
    ensure_log

    local api_key
    api_key=$(get_api_key)
    if [[ -z "$api_key" ]]; then
        echo -e "${RED}❌ No API key found. Set MOLTBOOK_API_KEY or configure ~/.config/moltbook/credentials.json${NC}"
        exit 1
    fi

    # Get next pending post from queue
    local post_json
    post_json=$(python3 -c "
import json, sys
with open('$QUEUE_FILE', 'r') as f:
    queue = json.load(f)
pending = [i for i, p in enumerate(queue) if p.get('status') == 'pending']
if not pending:
    print('EMPTY')
    sys.exit(0)
idx = pending[0]
print(json.dumps({'index': idx, **queue[idx]}))
")

    if [[ "$post_json" == "EMPTY" ]]; then
        echo -e "${YELLOW}📭 No pending posts in queue.${NC}"
        return
    fi

    local title content submolt idx
    title=$(echo "$post_json" | python3 -c "import json,sys; print(json.load(sys.stdin)['title'])")
    content=$(echo "$post_json" | python3 -c "import json,sys; print(json.load(sys.stdin)['content'])")
    submolt=$(echo "$post_json" | python3 -c "import json,sys; print(json.load(sys.stdin).get('submolt','general'))")
    idx=$(echo "$post_json" | python3 -c "import json,sys; print(json.load(sys.stdin)['index'])")

    echo -e "${BLUE}📤 Posting: ${title}${NC}"
    echo -e "   Submolt: m/${submolt}"

    # Step 1: POST to create
    local response
    response=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/posts" \
        -H "Authorization: Bearer ${api_key}" \
        -H "Content-Type: application/json" \
        -d "$(python3 -c "
import json
print(json.dumps({
    'title': '''${title}''',
    'content': '''${content}''',
    'submolt': '${submolt}'
}))
")" 2>&1) || true

    local http_code body
    http_code=$(echo "$response" | tail -1)
    body=$(echo "$response" | sed '$d')

    if [[ "$http_code" -lt 200 || "$http_code" -ge 300 ]]; then
        if [[ "$http_code" -eq 000 ]]; then
            echo -e "${RED}❌ Connection failed — is Moltbook API reachable?${NC}"
        else
            echo -e "${RED}❌ API returned HTTP ${http_code}${NC}"
            echo "   $body"
        fi

        # Log failure
        python3 -c "
import json
from datetime import datetime, timezone
with open('$LOG_FILE', 'r') as f:
    log = json.load(f)
log.append({
    'title': '''${title}''',
    'submolt': '${submolt}',
    'status': 'failed',
    'http_code': ${http_code},
    'error': '''${body}''',
    'timestamp': datetime.now(timezone.utc).isoformat()
})
with open('$LOG_FILE', 'w') as f:
    json.dump(log, f, indent=2)
"
        # Mark as failed in queue
        python3 -c "
import json
with open('$QUEUE_FILE', 'r') as f:
    queue = json.load(f)
queue[${idx}]['status'] = 'failed'
with open('$QUEUE_FILE', 'w') as f:
    json.dump(queue, f, indent=2)
"
        return 1
    fi

    echo -e "${GREEN}✅ Post submitted!${NC}"

    # Step 2: Handle captcha verification
    local verification_code challenge
    verification_code=$(echo "$body" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('verification_code',''))" 2>/dev/null || echo "")
    challenge=$(echo "$body" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('challenge', d.get('captcha','')))" 2>/dev/null || echo "")

    if [[ -n "$verification_code" && -n "$challenge" ]]; then
        echo -e "${YELLOW}🦞 Captcha challenge: ${challenge}${NC}"

        local answer
        answer=$(solve_captcha "$challenge")

        if [[ -z "$answer" ]]; then
            echo -e "${RED}❌ Could not solve captcha: ${challenge}${NC}"
        else
            echo -e "   Answer: ${answer}"

            local verify_response
            verify_response=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/verify" \
                -H "Authorization: Bearer ${api_key}" \
                -H "Content-Type: application/json" \
                -d "{\"verification_code\": \"${verification_code}\", \"answer\": \"${answer}\"}" 2>&1) || true

            local v_code v_body
            v_code=$(echo "$verify_response" | tail -1)
            v_body=$(echo "$verify_response" | sed '$d')

            if [[ "$v_code" -ge 200 && "$v_code" -lt 300 ]]; then
                echo -e "${GREEN}✅ Captcha verified!${NC}"
            else
                echo -e "${RED}⚠️  Captcha verification returned HTTP ${v_code}: ${v_body}${NC}"
            fi
        fi
    fi

    # Update queue status
    python3 -c "
import json
with open('$QUEUE_FILE', 'r') as f:
    queue = json.load(f)
queue[${idx}]['status'] = 'posted'
with open('$QUEUE_FILE', 'w') as f:
    json.dump(queue, f, indent=2)
"

    # Log success
    local post_id
    post_id=$(echo "$body" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('id', d.get('post_id','unknown')))" 2>/dev/null || echo "unknown")

    python3 -c "
import json
from datetime import datetime, timezone
with open('$LOG_FILE', 'r') as f:
    log = json.load(f)
log.append({
    'title': '''${title}''',
    'submolt': '${submolt}',
    'post_id': '${post_id}',
    'status': 'posted',
    'http_code': ${http_code},
    'timestamp': datetime.now(timezone.utc).isoformat()
})
with open('$LOG_FILE', 'w') as f:
    json.dump(log, f, indent=2)
"

    echo -e "${GREEN}📝 Logged to posts-log.json${NC}"

    # Cooldown
    echo -e "${YELLOW}⏱️  Cooldown: waiting ${COOLDOWN}s (Moltbook rate limit)...${NC}"
    sleep "$COOLDOWN"
    echo -e "${GREEN}✅ Ready for next post.${NC}"
}

cmd_run_all() {
    ensure_queue

    local count
    count=$(python3 -c "
import json
with open('$QUEUE_FILE', 'r') as f:
    queue = json.load(f)
print(len([p for p in queue if p.get('status') == 'pending']))
")

    echo -e "${BLUE}🚀 Running all ${count} pending posts...${NC}"
    echo ""

    for ((i=1; i<=count; i++)); do
        echo -e "${BLUE}--- Post ${i}/${count} ---${NC}"
        cmd_run || true
        echo ""
    done

    echo -e "${GREEN}🎉 All done!${NC}"
}

# ---------- Main ----------

usage() {
    cat <<EOF
🦞 Moltbook Auto-Poster v1.0.0

Usage:
  $(basename "$0") --run          Post the next pending item from queue
  $(basename "$0") --run-all      Post all pending items (with cooldown)
  $(basename "$0") --list         Show current queue
  $(basename "$0") --add          Add a post to queue

Add options:
  --title TITLE         Post title (required)
  --content CONTENT     Post body (required)
  --submolt NAME        Target submolt (default: general)
  --time TIMESTAMP      Scheduled time (ISO 8601, default: now)

Environment:
  MOLTBOOK_API_KEY      API key (or use ~/.config/moltbook/credentials.json)

Examples:
  $(basename "$0") --add --title "Hello Moltbook" --content "First post!" --submolt lobsters
  $(basename "$0") --list
  $(basename "$0") --run
EOF
}

if [[ $# -eq 0 ]]; then
    usage
    exit 0
fi

case "$1" in
    --run-all) cmd_run_all ;;
    --run)     cmd_run ;;
    --list)    cmd_list ;;
    --add)     shift; cmd_add "$@" ;;
    --help|-h) usage ;;
    *)         echo "Unknown command: $1"; usage; exit 1 ;;
esac
