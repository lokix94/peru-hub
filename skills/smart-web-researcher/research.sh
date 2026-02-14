#!/usr/bin/env bash
# Smart Web Researcher v1.0.0
# Searches multiple sources, cross-references, produces structured research report
# Author: Peru 🇵🇪

set -euo pipefail

VERSION="1.0.0"
MODE="normal"  # quick, normal, deep
OUTPUT=""
FORMAT="markdown"
QUERY=""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

usage() {
    cat <<EOF
🔍 Smart Web Researcher v${VERSION}

Usage: $(basename "$0") [OPTIONS] "QUERY"

Options:
  --quick       Quick overview (Wikipedia only)
  --deep        Deep research (all sources + expanded queries)
  --output FILE Save report to file (default: stdout)
  --json        Output as JSON instead of markdown
  --help        Show this help message

Examples:
  $(basename "$0") "quantum computing"
  $(basename "$0") --deep "artificial intelligence in healthcare"
  $(basename "$0") --output report.md "climate change effects"
EOF
    exit 0
}

log() { echo -e "${BLUE}[researcher]${NC} $*" >&2; }
warn() { echo -e "${YELLOW}[warning]${NC} $*" >&2; }
err() { echo -e "${RED}[error]${NC} $*" >&2; exit 1; }

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --quick)  MODE="quick"; shift ;;
        --deep)   MODE="deep"; shift ;;
        --output) OUTPUT="$2"; shift 2 ;;
        --json)   FORMAT="json"; shift ;;
        --help)   usage ;;
        -*)       err "Unknown option: $1" ;;
        *)        QUERY="$1"; shift ;;
    esac
done

[[ -z "$QUERY" ]] && err "No query provided. Use --help for usage."

# Ensure dependencies
for cmd in curl python3; do
    command -v "$cmd" &>/dev/null || err "Missing dependency: $cmd"
done

# Temp directory for intermediate results
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

DATE=$(date -u +"%Y-%m-%d")
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M UTC")

# URL-encode function
urlencode() {
    python3 -c "import urllib.parse; print(urllib.parse.quote('$1'))"
}

ENCODED_QUERY=$(urlencode "$QUERY")

# ============================================================
# SOURCE 1: Wikipedia API
# ============================================================
fetch_wikipedia() {
    log "Searching Wikipedia..."
    local wiki_url="https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${ENCODED_QUERY}&format=json&srlimit=5&utf8=1"
    
    if curl -s --max-time 15 "$wiki_url" > "$TMPDIR/wiki_search.json" 2>/dev/null; then
        # Get top result title
        local top_title
        top_title=$(python3 -c "
import json, sys
try:
    data = json.load(open('$TMPDIR/wiki_search.json'))
    results = data.get('query', {}).get('search', [])
    if results:
        print(results[0]['title'])
except: pass
" 2>/dev/null)
        
        if [[ -n "$top_title" ]]; then
            local encoded_title
            encoded_title=$(urlencode "$top_title")
            local extract_url="https://en.wikipedia.org/w/api.php?action=query&titles=${encoded_title}&prop=extracts&exintro=0&explaintext=1&format=json&exsectionformat=plain"
            
            if curl -s --max-time 15 "$extract_url" > "$TMPDIR/wiki_extract.json" 2>/dev/null; then
                python3 -c "
import json, sys
try:
    data = json.load(open('$TMPDIR/wiki_extract.json'))
    pages = data.get('query', {}).get('pages', {})
    for pid, page in pages.items():
        extract = page.get('extract', '')
        if extract:
            # Limit to first ~3000 chars for summary
            text = extract[:3000]
            print(text)
            break
except Exception as e:
    print(f'Error: {e}', file=sys.stderr)
" > "$TMPDIR/wiki_content.txt" 2>/dev/null
                
                # Get all search results for sources
                python3 -c "
import json
try:
    data = json.load(open('$TMPDIR/wiki_search.json'))
    results = data.get('query', {}).get('search', [])
    for r in results[:5]:
        title = r['title']
        snippet = r.get('snippet', '').replace('<span class=\"searchmatch\">', '').replace('</span>', '')
        print(f'{title}|||{snippet}')
except: pass
" > "$TMPDIR/wiki_results.txt" 2>/dev/null
                
                echo "$top_title" > "$TMPDIR/wiki_title.txt"
                log "  ✅ Wikipedia: found article '${top_title}'"
                return 0
            fi
        fi
    fi
    warn "  ⚠️ Wikipedia: no results"
    return 1
}

# ============================================================
# SOURCE 2: DuckDuckGo Instant Answer API
# ============================================================
fetch_duckduckgo() {
    log "Searching DuckDuckGo..."
    local ddg_url="https://api.duckduckgo.com/?q=${ENCODED_QUERY}&format=json&no_html=1&skip_disambig=1"
    
    if curl -s --max-time 15 "$ddg_url" > "$TMPDIR/ddg_response.json" 2>/dev/null; then
        python3 -c "
import json
try:
    data = json.load(open('$TMPDIR/ddg_response.json'))
    results = []
    
    # Abstract
    abstract = data.get('Abstract', '')
    abstract_source = data.get('AbstractSource', '')
    abstract_url = data.get('AbstractURL', '')
    if abstract:
        results.append(f'ABSTRACT|||{abstract}|||{abstract_source}|||{abstract_url}')
    
    # Related topics
    for topic in data.get('RelatedTopics', [])[:8]:
        if 'Text' in topic:
            text = topic['Text']
            url = topic.get('FirstURL', '')
            results.append(f'TOPIC|||{text}|||DuckDuckGo|||{url}')
        elif 'Topics' in topic:
            for sub in topic['Topics'][:3]:
                if 'Text' in sub:
                    text = sub['Text']
                    url = sub.get('FirstURL', '')
                    results.append(f'TOPIC|||{text}|||DuckDuckGo|||{url}')
    
    # Infobox
    infobox = data.get('Infobox', {})
    if infobox and 'content' in infobox:
        for item in infobox['content'][:5]:
            label = item.get('label', '')
            value = item.get('value', '')
            if label and value:
                results.append(f'FACT|||{label}: {value}|||DuckDuckGo Infobox|||')
    
    for r in results:
        print(r)
except Exception as e:
    pass
" > "$TMPDIR/ddg_results.txt" 2>/dev/null
        
        if [[ -s "$TMPDIR/ddg_results.txt" ]]; then
            log "  ✅ DuckDuckGo: found $(wc -l < "$TMPDIR/ddg_results.txt") results"
            return 0
        fi
    fi
    warn "  ⚠️ DuckDuckGo: no results"
    return 1
}

# ============================================================
# SOURCE 3: Wikidata (structured data)
# ============================================================
fetch_wikidata() {
    log "Searching Wikidata..."
    local wd_url="https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${ENCODED_QUERY}&language=en&format=json&limit=3"
    
    if curl -s --max-time 15 "$wd_url" > "$TMPDIR/wikidata_search.json" 2>/dev/null; then
        python3 -c "
import json
try:
    data = json.load(open('$TMPDIR/wikidata_search.json'))
    results = data.get('search', [])
    for r in results[:3]:
        label = r.get('label', '')
        desc = r.get('description', '')
        wid = r.get('id', '')
        if label and desc:
            print(f'{label}|||{desc}|||Wikidata|||https://www.wikidata.org/wiki/{wid}')
except: pass
" > "$TMPDIR/wikidata_results.txt" 2>/dev/null
        
        if [[ -s "$TMPDIR/wikidata_results.txt" ]]; then
            log "  ✅ Wikidata: found $(wc -l < "$TMPDIR/wikidata_results.txt") entities"
            return 0
        fi
    fi
    warn "  ⚠️ Wikidata: no results"
    return 1
}

# ============================================================
# SOURCE 4: DuckDuckGo HTML search (deep mode only)
# ============================================================
fetch_ddg_html() {
    log "Searching DuckDuckGo HTML..."
    local ddg_html_url="https://html.duckduckgo.com/html/?q=${ENCODED_QUERY}"
    
    if curl -s --max-time 15 -A "Mozilla/5.0" "$ddg_html_url" > "$TMPDIR/ddg_html.html" 2>/dev/null; then
        python3 -c "
import re, html
try:
    with open('$TMPDIR/ddg_html.html', 'r', errors='ignore') as f:
        content = f.read()
    
    # Extract result snippets
    snippets = re.findall(r'class=\"result__snippet\">(.*?)</a>', content, re.DOTALL)
    urls = re.findall(r'class=\"result__url\"[^>]*>(.*?)</a>', content, re.DOTALL)
    titles = re.findall(r'class=\"result__a\"[^>]*>(.*?)</a>', content, re.DOTALL)
    
    for i in range(min(len(titles), 5)):
        title = html.unescape(re.sub(r'<[^>]+>', '', titles[i])).strip()
        snippet = html.unescape(re.sub(r'<[^>]+>', '', snippets[i])).strip() if i < len(snippets) else ''
        url = html.unescape(re.sub(r'<[^>]+>', '', urls[i])).strip() if i < len(urls) else ''
        if title:
            print(f'{title}|||{snippet}|||DuckDuckGo Web|||https://{url}')
except: pass
" > "$TMPDIR/ddg_web_results.txt" 2>/dev/null
        
        if [[ -s "$TMPDIR/ddg_web_results.txt" ]]; then
            log "  ✅ DuckDuckGo Web: found $(wc -l < "$TMPDIR/ddg_web_results.txt") results"
            return 0
        fi
    fi
    warn "  ⚠️ DuckDuckGo Web: no results"
    return 1
}

# ============================================================
# Run searches based on mode
# ============================================================
log "🔍 Smart Web Researcher v${VERSION}"
log "Query: \"${QUERY}\""
log "Mode: ${MODE}"
log ""

SOURCE_COUNT=0

# Always search Wikipedia
fetch_wikipedia && ((SOURCE_COUNT++)) || true

if [[ "$MODE" != "quick" ]]; then
    fetch_duckduckgo && ((SOURCE_COUNT++)) || true
    fetch_wikidata && ((SOURCE_COUNT++)) || true
fi

if [[ "$MODE" == "deep" ]]; then
    fetch_ddg_html && ((SOURCE_COUNT++)) || true
fi

log ""
log "Sources queried: ${SOURCE_COUNT}"

# ============================================================
# Generate Report
# ============================================================
log "Generating report..."

python3 << 'PYTHON_SCRIPT' > "$TMPDIR/report.md"
import os, sys, json, re
from datetime import datetime
from collections import defaultdict

tmpdir = os.environ.get('TMPDIR', '/tmp')
query = """QUERY_PLACEHOLDER"""
date = """DATE_PLACEHOLDER"""
timestamp = """TIMESTAMP_PLACEHOLDER"""
mode = """MODE_PLACEHOLDER"""
fmt = """FORMAT_PLACEHOLDER"""

# Collect all findings
sources = []
findings = []
all_text_chunks = []

# --- Wikipedia ---
wiki_content_file = os.path.join(tmpdir, 'wiki_content.txt')
wiki_title_file = os.path.join(tmpdir, 'wiki_title.txt')
wiki_results_file = os.path.join(tmpdir, 'wiki_results.txt')

wiki_content = ""
wiki_title = ""
if os.path.exists(wiki_content_file):
    with open(wiki_content_file) as f:
        wiki_content = f.read().strip()
if os.path.exists(wiki_title_file):
    with open(wiki_title_file) as f:
        wiki_title = f.read().strip()

if wiki_content:
    sources.append({
        'name': f'Wikipedia: {wiki_title}',
        'url': f'https://en.wikipedia.org/wiki/{wiki_title.replace(" ", "_")}',
        'type': 'encyclopedia'
    })
    # Extract key sentences as findings
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', wiki_content) if len(s.strip()) > 30]
    for s in sentences[:10]:
        findings.append({
            'text': s,
            'sources': ['Wikipedia'],
            'type': 'fact'
        })
    all_text_chunks.append(wiki_content)

if os.path.exists(wiki_results_file):
    with open(wiki_results_file) as f:
        for line in f:
            parts = line.strip().split('|||')
            if len(parts) >= 2:
                title, snippet = parts[0], parts[1]
                sources.append({
                    'name': f'Wikipedia: {title}',
                    'url': f'https://en.wikipedia.org/wiki/{title.replace(" ", "_")}',
                    'type': 'encyclopedia'
                })

# --- DuckDuckGo ---
ddg_file = os.path.join(tmpdir, 'ddg_results.txt')
if os.path.exists(ddg_file):
    with open(ddg_file) as f:
        for line in f:
            parts = line.strip().split('|||')
            if len(parts) >= 4:
                rtype, text, source, url = parts[0], parts[1], parts[2], parts[3]
                if text:
                    findings.append({
                        'text': text,
                        'sources': [source if source else 'DuckDuckGo'],
                        'type': 'abstract' if rtype == 'ABSTRACT' else 'topic' if rtype == 'TOPIC' else 'fact'
                    })
                    if url:
                        sources.append({'name': source, 'url': url, 'type': 'search'})
                    all_text_chunks.append(text)

# --- Wikidata ---
wd_file = os.path.join(tmpdir, 'wikidata_results.txt')
if os.path.exists(wd_file):
    with open(wd_file) as f:
        for line in f:
            parts = line.strip().split('|||')
            if len(parts) >= 4:
                label, desc, source, url = parts
                findings.append({
                    'text': f'{label}: {desc}',
                    'sources': ['Wikidata'],
                    'type': 'definition'
                })
                sources.append({'name': f'Wikidata: {label}', 'url': url, 'type': 'structured'})

# --- DuckDuckGo Web ---
ddg_web_file = os.path.join(tmpdir, 'ddg_web_results.txt')
if os.path.exists(ddg_web_file):
    with open(ddg_web_file) as f:
        for line in f:
            parts = line.strip().split('|||')
            if len(parts) >= 4:
                title, snippet, source, url = parts
                if snippet:
                    findings.append({
                        'text': snippet,
                        'sources': [f'Web: {title}'],
                        'type': 'web'
                    })
                    sources.append({'name': title, 'url': url, 'type': 'web'})
                    all_text_chunks.append(snippet)

# --- Cross-reference analysis ---
# Find findings mentioned in multiple sources
cross_refs = 0
finding_words = defaultdict(set)
for f in findings:
    key_words = set(re.findall(r'\b\w{5,}\b', f['text'].lower()))
    for w in key_words:
        for s in f['sources']:
            finding_words[w].add(s)

multi_source_words = {w for w, srcs in finding_words.items() if len(srcs) > 1}
for f in findings:
    key_words = set(re.findall(r'\b\w{5,}\b', f['text'].lower()))
    if key_words & multi_source_words:
        cross_refs += 1

# Confidence calculation
unique_sources = set()
for s in sources:
    unique_sources.add(s.get('name', 'Unknown'))

source_count = len(unique_sources)
if source_count >= 4 and cross_refs >= 3:
    confidence = "High"
    confidence_pct = min(95, 70 + source_count * 3 + cross_refs * 2)
elif source_count >= 2:
    confidence = "Medium"
    confidence_pct = min(80, 50 + source_count * 5 + cross_refs * 3)
else:
    confidence = "Low"
    confidence_pct = min(50, 20 + source_count * 10)

# --- Generate executive summary ---
summary_text = ""
if wiki_content:
    # Use first 2-3 sentences from Wikipedia as summary
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', wiki_content) if len(s.strip()) > 20]
    summary_text = ' '.join(sentences[:3])
elif findings:
    # Use first abstract or first few findings
    abstracts = [f for f in findings if f['type'] == 'abstract']
    if abstracts:
        summary_text = abstracts[0]['text']
    else:
        summary_text = '. '.join([f['text'] for f in findings[:3]])

if len(summary_text) > 500:
    summary_text = summary_text[:497] + '...'

# --- Deduplicate findings ---
seen = set()
unique_findings = []
for f in findings:
    short = f['text'][:80].lower().strip()
    if short not in seen:
        seen.add(short)
        unique_findings.append(f)
findings = unique_findings

# --- Build report ---
if fmt == 'json':
    report = {
        'query': query,
        'timestamp': timestamp,
        'mode': mode,
        'confidence': confidence,
        'confidence_pct': confidence_pct,
        'source_count': source_count,
        'cross_references': cross_refs,
        'summary': summary_text,
        'findings': findings[:15],
        'sources': [{'name': s['name'], 'url': s['url']} for s in sources if s.get('url')]
    }
    print(json.dumps(report, indent=2))
else:
    # Markdown report
    print(f'# Research Report: {query}')
    print(f'Generated: {timestamp} | Sources: {source_count} | Confidence: {confidence} ({confidence_pct}%)')
    print()
    
    print('## Executive Summary')
    print()
    if summary_text:
        print(summary_text)
    else:
        print(f'Limited information found for "{query}". Consider refining your search query.')
    print()
    
    print('## Key Findings')
    print()
    for i, f in enumerate(findings[:12], 1):
        src_str = ', '.join(f['sources'])
        text = f['text']
        if len(text) > 200:
            text = text[:197] + '...'
        print(f'{i}. **{text}** [{src_str}]')
    print()
    
    if wiki_content and mode != 'quick':
        print('## Detailed Analysis')
        print()
        # Break wiki content into paragraphs
        paragraphs = [p.strip() for p in wiki_content.split('\n') if p.strip()]
        for p in paragraphs[:8]:
            if len(p) > 50:  # Skip very short lines
                print(p)
                print()
    
    print('## Sources')
    print()
    seen_urls = set()
    src_num = 1
    for s in sources:
        url = s.get('url', '')
        if url and url not in seen_urls:
            seen_urls.add(url)
            print(f'{src_num}. [{s["name"]}]({url}) (Retrieved: {date})')
            src_num += 1
    print()
    
    print('## Methodology')
    print()
    source_types = set(s['type'] for s in sources)
    print(f'- **Sources queried:** {", ".join(source_types) if source_types else "N/A"}')
    print(f'- **Cross-reference matches:** {cross_refs}')
    print(f'- **Research mode:** {mode}')
    print(f'- **Confidence calculation:** Based on {source_count} unique sources and {cross_refs} cross-references')
    print()
    print('---')
    print(f'*Generated by Smart Web Researcher v1.0.0 | Peru 🇵🇪*')
PYTHON_SCRIPT

# Fix placeholders in the Python script
sed -i "s|QUERY_PLACEHOLDER|${QUERY}|g" "$TMPDIR/report.md" 2>/dev/null || true
sed -i "s|DATE_PLACEHOLDER|${DATE}|g" "$TMPDIR/report.md" 2>/dev/null || true
sed -i "s|TIMESTAMP_PLACEHOLDER|${TIMESTAMP}|g" "$TMPDIR/report.md" 2>/dev/null || true
sed -i "s|MODE_PLACEHOLDER|${MODE}|g" "$TMPDIR/report.md" 2>/dev/null || true
sed -i "s|FORMAT_PLACEHOLDER|${FORMAT}|g" "$TMPDIR/report.md" 2>/dev/null || true

# Generate with env vars
export QUERY DATE TIMESTAMP MODE FORMAT TMPDIR
python3 << 'PYTHON_REPORT' > "$TMPDIR/final_report.md"
import os, sys, json, re
from collections import defaultdict

tmpdir = os.environ['TMPDIR']
query = os.environ.get('QUERY', 'Unknown')
date = os.environ.get('DATE', 'Unknown')
timestamp = os.environ.get('TIMESTAMP', 'Unknown')
mode = os.environ.get('MODE', 'normal')
fmt = os.environ.get('FORMAT', 'markdown')

# Collect all findings
sources = []
findings = []
all_text_chunks = []

# --- Wikipedia ---
wiki_content = ""
wiki_title = ""
wc_path = os.path.join(tmpdir, 'wiki_content.txt')
wt_path = os.path.join(tmpdir, 'wiki_title.txt')
wr_path = os.path.join(tmpdir, 'wiki_results.txt')

if os.path.exists(wc_path):
    with open(wc_path) as f:
        wiki_content = f.read().strip()
if os.path.exists(wt_path):
    with open(wt_path) as f:
        wiki_title = f.read().strip()

if wiki_content:
    sources.append({
        'name': f'Wikipedia: {wiki_title}',
        'url': f'https://en.wikipedia.org/wiki/{wiki_title.replace(" ", "_")}',
        'type': 'encyclopedia'
    })
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', wiki_content) if len(s.strip()) > 30]
    for s in sentences[:10]:
        findings.append({'text': s, 'sources': ['Wikipedia'], 'type': 'fact'})
    all_text_chunks.append(wiki_content)

if os.path.exists(wr_path):
    with open(wr_path) as f:
        for line in f:
            parts = line.strip().split('|||')
            if len(parts) >= 2:
                title = parts[0]
                sources.append({
                    'name': f'Wikipedia: {title}',
                    'url': f'https://en.wikipedia.org/wiki/{title.replace(" ", "_")}',
                    'type': 'encyclopedia'
                })

# --- DuckDuckGo ---
ddg_path = os.path.join(tmpdir, 'ddg_results.txt')
if os.path.exists(ddg_path):
    with open(ddg_path) as f:
        for line in f:
            parts = line.strip().split('|||')
            if len(parts) >= 4:
                rtype, text, source, url = parts[0], parts[1], parts[2], parts[3]
                if text:
                    findings.append({'text': text, 'sources': [source or 'DuckDuckGo'], 'type': rtype.lower()})
                    if url:
                        sources.append({'name': source or 'DuckDuckGo', 'url': url, 'type': 'search'})
                    all_text_chunks.append(text)

# --- Wikidata ---
wd_path = os.path.join(tmpdir, 'wikidata_results.txt')
if os.path.exists(wd_path):
    with open(wd_path) as f:
        for line in f:
            parts = line.strip().split('|||')
            if len(parts) >= 4:
                label, desc, source, url = parts
                findings.append({'text': f'{label}: {desc}', 'sources': ['Wikidata'], 'type': 'definition'})
                sources.append({'name': f'Wikidata: {label}', 'url': url, 'type': 'structured'})

# --- DDG Web ---
ddg_web_path = os.path.join(tmpdir, 'ddg_web_results.txt')
if os.path.exists(ddg_web_path):
    with open(ddg_web_path) as f:
        for line in f:
            parts = line.strip().split('|||')
            if len(parts) >= 4:
                title, snippet, source, url = parts
                if snippet:
                    findings.append({'text': snippet, 'sources': [f'Web: {title}'], 'type': 'web'})
                    sources.append({'name': title, 'url': url, 'type': 'web'})
                    all_text_chunks.append(snippet)

# Cross-reference
cross_refs = 0
finding_words = defaultdict(set)
for f in findings:
    key_words = set(re.findall(r'\b\w{5,}\b', f['text'].lower()))
    for w in key_words:
        for s in f['sources']:
            finding_words[w].add(s)

multi_source = {w for w, srcs in finding_words.items() if len(srcs) > 1}
for f in findings:
    kw = set(re.findall(r'\b\w{5,}\b', f['text'].lower()))
    if kw & multi_source:
        cross_refs += 1

# Confidence
unique_src = set(s.get('name', '') for s in sources)
sc = len(unique_src)
if sc >= 4 and cross_refs >= 3:
    conf, conf_pct = "High", min(95, 70 + sc*3 + cross_refs*2)
elif sc >= 2:
    conf, conf_pct = "Medium", min(80, 50 + sc*5 + cross_refs*3)
else:
    conf, conf_pct = "Low", min(50, 20 + sc*10)

# Summary
summary = ""
if wiki_content:
    sents = [s.strip() for s in re.split(r'(?<=[.!?])\s+', wiki_content) if len(s.strip()) > 20]
    summary = ' '.join(sents[:3])
elif findings:
    abstracts = [f for f in findings if f['type'] == 'abstract']
    summary = abstracts[0]['text'] if abstracts else '. '.join(f['text'] for f in findings[:3])
if len(summary) > 500:
    summary = summary[:497] + '...'

# Deduplicate
seen = set()
uniq = []
for f in findings:
    k = f['text'][:80].lower().strip()
    if k not in seen:
        seen.add(k)
        uniq.append(f)
findings = uniq

# Output
if fmt == 'json':
    report = {
        'query': query, 'timestamp': timestamp, 'mode': mode,
        'confidence': conf, 'confidence_pct': conf_pct,
        'source_count': sc, 'cross_references': cross_refs,
        'summary': summary,
        'findings': findings[:15],
        'sources': [{'name': s['name'], 'url': s['url']} for s in sources if s.get('url')]
    }
    print(json.dumps(report, indent=2))
else:
    print(f'# Research Report: {query}')
    print(f'Generated: {timestamp} | Sources: {sc} | Confidence: {conf} ({conf_pct}%)')
    print()
    print('## Executive Summary')
    print()
    print(summary if summary else f'Limited information found for "{query}".')
    print()
    print('## Key Findings')
    print()
    for i, f in enumerate(findings[:12], 1):
        src = ', '.join(f['sources'])
        t = f['text'][:200]
        print(f'{i}. **{t}** [{src}]')
    print()
    if wiki_content and mode != 'quick':
        print('## Detailed Analysis')
        print()
        for p in [p.strip() for p in wiki_content.split('\n') if p.strip() and len(p.strip()) > 50][:8]:
            print(p)
            print()
    print('## Sources')
    print()
    seen_u = set()
    n = 1
    for s in sources:
        u = s.get('url', '')
        if u and u not in seen_u:
            seen_u.add(u)
            print(f'{n}. [{s["name"]}]({u}) (Retrieved: {date})')
            n += 1
    print()
    print('## Methodology')
    print()
    stypes = set(s['type'] for s in sources)
    print(f'- **Sources queried:** {", ".join(stypes) if stypes else "N/A"}')
    print(f'- **Cross-reference matches:** {cross_refs}')
    print(f'- **Research mode:** {mode}')
    print(f'- **Confidence calculation:** Based on {sc} unique sources and {cross_refs} cross-references')
    print()
    print('---')
    print('*Generated by Smart Web Researcher v1.0.0 | Peru 🇵🇪*')
PYTHON_REPORT

# Output
if [[ -n "$OUTPUT" ]]; then
    cp "$TMPDIR/final_report.md" "$OUTPUT"
    log "✅ Report saved to: ${OUTPUT}"
else
    cat "$TMPDIR/final_report.md"
fi

log "✅ Research complete!"
