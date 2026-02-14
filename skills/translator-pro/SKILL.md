# 🌐 Multi-Language Translator Pro

**Version:** 1.0.0 | **Price:** $2.99 | **Author:** Peru 🇵🇪

## Description

High-quality translation between 10+ languages using free APIs (MyMemory, LibreTranslate). Features auto-detect language, batch translation, formal/informal modes, and domain-specific glossary management.

## Supported Languages

| Code | Language   | Code | Language   |
|------|-----------|------|-----------|
| en   | English   | zh   | Chinese   |
| es   | Spanish   | ja   | Japanese  |
| pt   | Portuguese| ko   | Korean    |
| fr   | French    | ar   | Arabic    |
| de   | German    | ru   | Russian   |

## Features

- **Auto-detect language** — Automatically identifies the source language
- **Multiple APIs** — Falls back between MyMemory and LibreTranslate for reliability
- **Batch translation** — Translate entire files or multiple strings at once
- **Formal/Informal modes** — Adapts register for professional or casual contexts
- **Glossary management** — Define domain-specific term mappings
- **Confidence scoring** — Shows translation quality confidence
- **Alternative translations** — Provides multiple options when available

## Requirements

- `bash` (4.0+)
- `curl`
- `jq`
- `python3` (for batch processing and glossary management)

## Installation

```bash
apt-get install -y curl jq python3
chmod +x translate.sh glossary.py
```

## Usage

### Basic Translation

```bash
# Auto-detect source, translate to English
./translate.sh "Hola, ¿cómo estás?"

# Specify source and target languages
./translate.sh --from es --to en "Hola, ¿cómo estás?"

# Translate to Spanish
./translate.sh --to es "Hello, how are you?"
```

### Formal/Informal Mode

```bash
# Formal translation (business, academic)
./translate.sh --formal --to de "Could you please send me the report?"

# Informal translation (casual, friendly)
./translate.sh --informal --to es "What's up dude?"
```

### Batch Translation

```bash
# Translate a file line by line
./translate.sh --file input.txt --to fr

# Translate multiple strings
./translate.sh --batch "Hello" "Goodbye" "Thank you" --to ja
```

### Glossary Management

```bash
# Add term to glossary
python3 glossary.py add --domain tech --from en --to es "API" "API"
python3 glossary.py add --domain tech --from en --to es "machine learning" "aprendizaje automático"

# Translate with glossary
./translate.sh --glossary tech --to es "The API uses machine learning"

# List glossary entries
python3 glossary.py list --domain tech

# Import/export glossary
python3 glossary.py export --domain tech --output tech_glossary.json
python3 glossary.py import --file tech_glossary.json
```

### All Options

```
Usage: translate.sh [OPTIONS] "TEXT"

Options:
  --from LANG    Source language code (default: auto-detect)
  --to LANG      Target language code (default: en)
  --formal       Use formal register
  --informal     Use informal register
  --file FILE    Translate file contents
  --batch        Translate multiple arguments
  --glossary DOM Use domain glossary for term mapping
  --json         Output as JSON
  --api API      Force API: mymemory or libre (default: auto)
  --output FILE  Save to file
  --help         Show help
```

## Output Format

### Standard Output

```
🌐 Translation Result
━━━━━━━━━━━━━━━━━━━━
Source (es): Hola, ¿cómo estás?
Target (en): Hello, how are you?
Confidence: 95%
API: MyMemory
━━━━━━━━━━━━━━━━━━━━
```

### JSON Output

```json
{
  "source_text": "Hola, ¿cómo estás?",
  "translated_text": "Hello, how are you?",
  "source_lang": "es",
  "target_lang": "en",
  "confidence": 0.95,
  "api_used": "mymemory",
  "alternatives": ["Hello, how are you doing?"],
  "glossary_applied": []
}
```

## Example

```bash
$ ./translate.sh --from en --to es --formal "Please review the attached document"
🌐 Translation Result
━━━━━━━━━━━━━━━━━━━━
Source (en): Please review the attached document
Target (es): Por favor, revise el documento adjunto
Confidence: 92%
API: MyMemory
Mode: Formal
━━━━━━━━━━━━━━━━━━━━

$ ./translate.sh --to ja "Good morning"
🌐 Translation Result
━━━━━━━━━━━━━━━━━━━━
Source (en): Good morning
Target (ja): おはようございます
Confidence: 98%
API: MyMemory
━━━━━━━━━━━━━━━━━━━━
```

## API Information

### MyMemory (Primary)
- Free tier: 5000 words/day
- Good quality for European languages
- Supports all 10 languages

### LibreTranslate (Fallback)
- Open source, self-hostable
- Public instances available
- Good for Asian languages

The skill automatically falls back between APIs if one is unavailable or returns low-confidence results.
