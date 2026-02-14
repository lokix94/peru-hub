#!/usr/bin/env bash
# Multi-Language Translator Pro v1.0.0
# Translates text using free APIs (MyMemory primary, LibreTranslate fallback)
# Author: Peru 🇵🇪

set -euo pipefail

VERSION="1.0.0"
FROM_LANG="auto"
TO_LANG="en"
MODE=""          # formal, informal, or empty
FILE_INPUT=""
BATCH_MODE=false
JSON_OUTPUT=false
GLOSSARY_DOMAIN=""
API_CHOICE="auto"
OUTPUT_FILE=""
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Supported languages
declare -A LANG_NAMES=(
    [en]="English" [es]="Spanish" [pt]="Portuguese" [fr]="French"
    [de]="German" [zh]="Chinese" [ja]="Japanese" [ko]="Korean"
    [ar]="Arabic" [ru]="Russian" [it]="Italian" [nl]="Dutch"
    [auto]="Auto-detect"
)

usage() {
    cat <<EOF
🌐 Multi-Language Translator Pro v${VERSION}

Usage: $(basename "$0") [OPTIONS] "TEXT" [..."TEXT"]

Options:
  --from LANG    Source language code (default: auto-detect)
  --to LANG      Target language code (default: en)
  --formal       Use formal register
  --informal     Use informal register
  --file FILE    Translate file contents (line by line)
  --batch        Translate multiple arguments
  --glossary DOM Use domain glossary for term mapping
  --json         Output as JSON
  --api API      Force API: mymemory or libre (default: auto)
  --output FILE  Save output to file
  --help         Show this help message

Supported Languages:
  en (English), es (Spanish), pt (Portuguese), fr (French),
  de (German), zh (Chinese), ja (Japanese), ko (Korean),
  ar (Arabic), ru (Russian), it (Italian), nl (Dutch)

Examples:
  $(basename "$0") "Hola, ¿cómo estás?"
  $(basename "$0") --from es --to en "Buenos días"
  $(basename "$0") --to es --formal "Please review the document"
  $(basename "$0") --file input.txt --to fr
  $(basename "$0") --batch "Hello" "Goodbye" "Thank you" --to ja
EOF
    exit 0
}

# URL-encode a string
urlencode() {
    local string="$1"
    python3 -c "import urllib.parse; print(urllib.parse.quote('''$string'''))" 2>/dev/null \
        || printf '%s' "$string" | curl -Gso /dev/null -w '%{url_effective}' --data-urlencode @- '' 2>/dev/null | sed 's/^./?/;s/^.//;'
}

# Translate using MyMemory API
translate_mymemory() {
    local text="$1"
    local src="$2"
    local tgt="$3"

    local langpair
    if [[ "$src" == "auto" ]]; then
        # MyMemory uses autodetect when source is empty or "auto"
        langpair="autodetect|${tgt}"
    else
        langpair="${src}|${tgt}"
    fi

    local encoded_text
    encoded_text=$(python3 -c "import urllib.parse, sys; print(urllib.parse.quote(sys.argv[1]))" "$text" 2>/dev/null)

    local response
    response=$(curl -s --max-time 15 \
        "https://api.mymemory.translated.net/get?q=${encoded_text}&langpair=${langpair}" 2>/dev/null)

    if [[ -z "$response" ]]; then
        echo ""
        return 1
    fi

    local status
    status=$(echo "$response" | jq -r '.responseStatus' 2>/dev/null)

    if [[ "$status" == "200" ]]; then
        local translated
        translated=$(echo "$response" | jq -r '.responseData.translatedText' 2>/dev/null)
        local confidence
        confidence=$(echo "$response" | jq -r '.responseData.match' 2>/dev/null)
        local detected_lang
        detected_lang=$(echo "$response" | jq -r '.responseData.detectedLanguage // empty' 2>/dev/null)

        # Get confidence as percentage
        local conf_pct
        if [[ -n "$confidence" && "$confidence" != "null" ]]; then
            conf_pct=$(python3 -c "print(int(float('$confidence') * 100))" 2>/dev/null || echo "0")
        else
            conf_pct="0"
        fi

        # Collect alternatives from matches
        local alternatives
        alternatives=$(echo "$response" | jq -r '[.matches[]? | select(.translation != "'"$translated"'") | .translation] | unique | .[0:3] | join("|||")' 2>/dev/null || echo "")

        echo "${translated}|||${conf_pct}|||mymemory|||${detected_lang}|||${alternatives}"
        return 0
    else
        echo ""
        return 1
    fi
}

# Translate using LibreTranslate (public instance)
translate_libre() {
    local text="$1"
    local src="$2"
    local tgt="$3"

    # Public LibreTranslate instances
    local -a libre_urls=(
        "https://libretranslate.com/translate"
        "https://translate.argosopentech.com/translate"
        "https://translate.terraprint.co/translate"
    )

    local src_code="$src"
    [[ "$src_code" == "auto" ]] && src_code="auto"

    for url in "${libre_urls[@]}"; do
        local response
        response=$(curl -s --max-time 10 -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "{\"q\": $(echo "$text" | jq -Rs .), \"source\": \"$src_code\", \"target\": \"$tgt\"}" 2>/dev/null)

        if [[ -n "$response" ]]; then
            local translated
            translated=$(echo "$response" | jq -r '.translatedText // empty' 2>/dev/null)
            if [[ -n "$translated" ]]; then
                local detected
                detected=$(echo "$response" | jq -r '.detectedLanguage.language // empty' 2>/dev/null)
                echo "${translated}|||75|||libretranslate|||${detected}|||"
                return 0
            fi
        fi
    done

    echo ""
    return 1
}

# Apply glossary substitutions
apply_glossary() {
    local text="$1"
    local domain="$2"
    local from_lang="$3"
    local to_lang="$4"

    local glossary_file="${SCRIPT_DIR}/.glossaries/${domain}.json"
    if [[ ! -f "$glossary_file" ]]; then
        echo "$text"
        return 0
    fi

    # Use Python to apply glossary
    python3 -c "
import json, sys, re

text = sys.argv[1]
domain = sys.argv[2]
from_lang = sys.argv[3]
to_lang = sys.argv[4]
glossary_file = sys.argv[5]

with open(glossary_file, 'r') as f:
    glossary = json.load(f)

applied = []
entries = glossary.get('entries', [])
for entry in entries:
    if entry.get('from_lang') == from_lang and entry.get('to_lang') == to_lang:
        source_term = entry['source']
        target_term = entry['target']
        pattern = re.compile(re.escape(source_term), re.IGNORECASE)
        if pattern.search(text):
            text = pattern.sub(target_term, text)
            applied.append(f'{source_term} -> {target_term}')

# Print result and applied terms
print(text)
if applied:
    print('GLOSSARY_APPLIED:' + '|||'.join(applied))
" "$text" "$domain" "$from_lang" "$to_lang" "$glossary_file" 2>/dev/null || echo "$text"
}

# Adjust register (formal/informal) - post-processing hint
adjust_register() {
    local text="$1"
    local mode="$2"
    local lang="$3"

    # For Spanish, swap tú/usted forms
    if [[ "$lang" == "es" ]]; then
        if [[ "$mode" == "formal" ]]; then
            text=$(echo "$text" | sed 's/\btú\b/usted/gi')
        elif [[ "$mode" == "informal" ]]; then
            text=$(echo "$text" | sed 's/\busted\b/tú/gi')
        fi
    fi
    # For German, swap du/Sie forms
    if [[ "$lang" == "de" ]]; then
        if [[ "$mode" == "formal" ]]; then
            text=$(echo "$text" | sed 's/\bdu\b/Sie/gi')
        elif [[ "$mode" == "informal" ]]; then
            text=$(echo "$text" | sed 's/\bSie\b/du/gi')
        fi
    fi
    # For French, swap tu/vous forms
    if [[ "$lang" == "fr" ]]; then
        if [[ "$mode" == "formal" ]]; then
            text=$(echo "$text" | sed 's/\btu\b/vous/gi')
        elif [[ "$mode" == "informal" ]]; then
            text=$(echo "$text" | sed 's/\bvous\b/tu/gi')
        fi
    fi

    echo "$text"
}

# Main translate function
do_translate() {
    local text="$1"
    local glossary_applied=""

    # Apply glossary pre-processing if requested
    if [[ -n "$GLOSSARY_DOMAIN" ]]; then
        local glossary_result
        glossary_result=$(apply_glossary "$text" "$GLOSSARY_DOMAIN" "$FROM_LANG" "$TO_LANG")
        # Check if glossary terms were applied
        if echo "$glossary_result" | grep -q "GLOSSARY_APPLIED:"; then
            glossary_applied=$(echo "$glossary_result" | grep "GLOSSARY_APPLIED:" | sed 's/GLOSSARY_APPLIED://')
            text=$(echo "$glossary_result" | grep -v "GLOSSARY_APPLIED:")
        else
            text="$glossary_result"
        fi
    fi

    local result=""

    # Try MyMemory first (or forced API)
    if [[ "$API_CHOICE" == "auto" || "$API_CHOICE" == "mymemory" ]]; then
        result=$(translate_mymemory "$text" "$FROM_LANG" "$TO_LANG" 2>/dev/null || true)
    fi

    # Fallback to LibreTranslate
    if [[ -z "$result" && ("$API_CHOICE" == "auto" || "$API_CHOICE" == "libre") ]]; then
        result=$(translate_libre "$text" "$FROM_LANG" "$TO_LANG" 2>/dev/null || true)
    fi

    if [[ -z "$result" ]]; then
        echo -e "${RED}✗ Translation failed. No API available.${NC}" >&2
        return 1
    fi

    # Parse result
    IFS='|||' read -r translated _ conf_raw _ api_used _ detected_lang _ alternatives <<< "$result"
    # Fix: the delimiter is ||| so we need smarter parsing
    translated=$(echo "$result" | awk -F'\\|\\|\\|' '{print $1}')
    conf_raw=$(echo "$result" | awk -F'\\|\\|\\|' '{print $2}')
    api_used=$(echo "$result" | awk -F'\\|\\|\\|' '{print $3}')
    detected_lang=$(echo "$result" | awk -F'\\|\\|\\|' '{print $4}')
    alternatives=$(echo "$result" | awk -F'\\|\\|\\|' '{print $5}')

    local confidence="${conf_raw:-0}"
    local source_lang="${FROM_LANG}"
    if [[ "$source_lang" == "auto" && -n "$detected_lang" ]]; then
        source_lang="$detected_lang"
    fi

    # Apply register adjustment
    if [[ -n "$MODE" ]]; then
        translated=$(adjust_register "$translated" "$MODE" "$TO_LANG")
    fi

    # Build glossary applied list
    local glossary_list=""
    if [[ -n "$glossary_applied" ]]; then
        glossary_list="$glossary_applied"
    fi

    # Output
    if [[ "$JSON_OUTPUT" == true ]]; then
        local alt_json="[]"
        if [[ -n "$alternatives" ]]; then
            alt_json=$(echo "$alternatives" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read().strip().split('|||')))" 2>/dev/null || echo "[]")
        fi
        local gloss_json="[]"
        if [[ -n "$glossary_list" ]]; then
            gloss_json=$(echo "$glossary_list" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read().strip().split('|||')))" 2>/dev/null || echo "[]")
        fi

        local json_result
        json_result=$(python3 -c "
import json, sys
result = {
    'source_text': sys.argv[1],
    'translated_text': sys.argv[2],
    'source_lang': sys.argv[3],
    'target_lang': sys.argv[4],
    'confidence': float(sys.argv[5]) / 100,
    'api_used': sys.argv[6],
    'alternatives': json.loads(sys.argv[7]),
    'glossary_applied': json.loads(sys.argv[8])
}
if sys.argv[9]:
    result['mode'] = sys.argv[9]
print(json.dumps(result, indent=2, ensure_ascii=False))
" "$text" "$translated" "$source_lang" "$TO_LANG" "$confidence" "$api_used" "$alt_json" "$gloss_json" "$MODE" 2>/dev/null)
        output_text "$json_result"
    else
        local src_name="${LANG_NAMES[$source_lang]:-$source_lang}"
        local tgt_name="${LANG_NAMES[$TO_LANG]:-$TO_LANG}"

        local display=""
        display+="🌐 Translation Result\n"
        display+="━━━━━━━━━━━━━━━━━━━━\n"
        display+="Source (${source_lang}): ${text}\n"
        display+="Target (${TO_LANG}): ${translated}\n"
        display+="Confidence: ${confidence}%\n"
        display+="API: $(echo "$api_used" | sed 's/mymemory/MyMemory/;s/libretranslate/LibreTranslate/')\n"
        if [[ -n "$MODE" ]]; then
            display+="Mode: $(echo "$MODE" | sed 's/^./\U&/')\n"
        fi
        if [[ -n "$glossary_list" ]]; then
            display+="Glossary: ${GLOSSARY_DOMAIN} ($(echo "$glossary_list" | tr '|||' ', '))\n"
        fi
        display+="━━━━━━━━━━━━━━━━━━━━"

        output_text "$(echo -e "$display")"
    fi
}

# Output helper
output_text() {
    local text="$1"
    if [[ -n "$OUTPUT_FILE" ]]; then
        echo "$text" >> "$OUTPUT_FILE"
    else
        echo "$text"
    fi
}

# Parse arguments
TEXTS=()
while [[ $# -gt 0 ]]; do
    case $1 in
        --from)
            FROM_LANG="$2"
            shift 2
            ;;
        --to)
            TO_LANG="$2"
            shift 2
            ;;
        --formal)
            MODE="formal"
            shift
            ;;
        --informal)
            MODE="informal"
            shift
            ;;
        --file)
            FILE_INPUT="$2"
            shift 2
            ;;
        --batch)
            BATCH_MODE=true
            shift
            ;;
        --json)
            JSON_OUTPUT=true
            shift
            ;;
        --glossary)
            GLOSSARY_DOMAIN="$2"
            shift 2
            ;;
        --api)
            API_CHOICE="$2"
            shift 2
            ;;
        --output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        --help|-h)
            usage
            ;;
        -*)
            echo -e "${RED}Unknown option: $1${NC}" >&2
            usage
            ;;
        *)
            TEXTS+=("$1")
            shift
            ;;
    esac
done

# Clear output file if specified
if [[ -n "$OUTPUT_FILE" ]]; then
    > "$OUTPUT_FILE"
fi

# File mode
if [[ -n "$FILE_INPUT" ]]; then
    if [[ ! -f "$FILE_INPUT" ]]; then
        echo -e "${RED}✗ File not found: ${FILE_INPUT}${NC}" >&2
        exit 1
    fi
    echo -e "${BLUE}📄 Translating file: ${FILE_INPUT}${NC}" >&2
    line_num=0
    total_lines=$(wc -l < "$FILE_INPUT")
    while IFS= read -r line || [[ -n "$line" ]]; do
        line_num=$((line_num + 1))
        if [[ -z "$line" ]]; then
            output_text ""
            continue
        fi
        echo -e "${YELLOW}  [${line_num}/${total_lines}] Translating...${NC}" >&2
        do_translate "$line"
        # Rate limit to be polite
        sleep 0.5
    done < "$FILE_INPUT"
    echo -e "${GREEN}✓ File translation complete.${NC}" >&2
    exit 0
fi

# Batch mode
if [[ "$BATCH_MODE" == true ]]; then
    if [[ ${#TEXTS[@]} -eq 0 ]]; then
        echo -e "${RED}✗ No text provided for batch translation.${NC}" >&2
        exit 1
    fi
    if [[ "$JSON_OUTPUT" == true ]]; then
        output_text "["
    fi
    total=${#TEXTS[@]}
    for i in "${!TEXTS[@]}"; do
        echo -e "${YELLOW}  [$((i+1))/${total}] Translating...${NC}" >&2
        do_translate "${TEXTS[$i]}"
        if [[ "$JSON_OUTPUT" == true && $((i+1)) -lt $total ]]; then
            output_text ","
        fi
        sleep 0.5
    done
    if [[ "$JSON_OUTPUT" == true ]]; then
        output_text "]"
    fi
    echo -e "${GREEN}✓ Batch translation complete.${NC}" >&2
    exit 0
fi

# Single text mode
if [[ ${#TEXTS[@]} -eq 0 ]]; then
    # Check if input is coming from stdin (pipe)
    if [[ ! -t 0 ]]; then
        while IFS= read -r line; do
            TEXTS+=("$line")
        done
    fi
fi

if [[ ${#TEXTS[@]} -eq 0 ]]; then
    echo -e "${RED}✗ No text provided. Use --help for usage.${NC}" >&2
    exit 1
fi

# Translate all provided texts
for text in "${TEXTS[@]}"; do
    do_translate "$text"
done
