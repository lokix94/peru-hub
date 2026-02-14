# 🌐 Multi-Language Translator Pro

> High-quality translation between 10+ languages using free APIs. No API keys needed!

**Version:** 1.0.0 | **Author:** Peru 🇵🇪 | **Price:** $2.99

---

## ✨ Features

- 🔍 **Auto-detect language** — Automatically identifies source language
- 🔄 **Multiple APIs** — MyMemory (primary) with LibreTranslate fallback
- 📄 **Batch translation** — Translate entire files or multiple strings
- 🎩 **Formal/Informal modes** — Adapts register for professional or casual contexts
- 📚 **Glossary management** — Domain-specific term mappings for consistency
- 📊 **Confidence scoring** — Shows translation quality confidence
- 🔀 **Alternative translations** — Provides multiple options when available
- 📋 **JSON output** — Machine-readable output for automation

## 📋 Supported Languages

| Code | Language    | Code | Language   |
|------|------------|------|-----------|
| `en` | English    | `zh` | Chinese   |
| `es` | Spanish    | `ja` | Japanese  |
| `pt` | Portuguese | `ko` | Korean    |
| `fr` | French     | `ar` | Arabic    |
| `de` | German     | `ru` | Russian   |

## 🚀 Installation

### Prerequisites

```bash
# Install required tools
apt-get install -y curl jq python3
```

### Setup

```bash
# Make scripts executable
chmod +x translate.sh glossary.py
```

That's it! No API keys required — uses free translation APIs.

## 📖 Usage

### Basic Translation

```bash
# Auto-detect source → English
./translate.sh "Hola, ¿cómo estás?"

# Specify source and target
./translate.sh --from es --to en "Buenos días"

# English → Spanish
./translate.sh --to es "Hello, how are you?"
```

**Output:**
```
🌐 Translation Result
━━━━━━━━━━━━━━━━━━━━
Source (en): Hello, how are you?
Target (es): Hola, ¿cómo estás?
Confidence: 95%
API: MyMemory
━━━━━━━━━━━━━━━━━━━━
```

### 🎩 Formal / Informal Mode

```bash
# Formal (business, academic)
./translate.sh --formal --to de "Could you please send me the report?"

# Informal (casual, friendly)
./translate.sh --informal --to es "What's up dude?"
```

### 📄 File Translation

```bash
# Translate a text file line by line
./translate.sh --file document.txt --to fr

# Save output to file
./translate.sh --file input.txt --to es --output translated.txt
```

### 📦 Batch Translation

```bash
# Translate multiple strings at once
./translate.sh --batch "Hello" "Goodbye" "Thank you" --to ja
```

### 📋 JSON Output

```bash
./translate.sh --json --to es "Good morning"
```

```json
{
  "source_text": "Good morning",
  "translated_text": "Buenos días",
  "source_lang": "en",
  "target_lang": "es",
  "confidence": 0.95,
  "api_used": "mymemory",
  "alternatives": [],
  "glossary_applied": []
}
```

### 📚 Glossary Management

Create domain-specific glossaries to ensure consistent translations:

```bash
# Add terms to a glossary
python3 glossary.py add --domain tech --from en --to es "API" "API"
python3 glossary.py add --domain tech --from en --to es "machine learning" "aprendizaje automático"

# Translate with glossary
./translate.sh --glossary tech --to es "The API uses machine learning"

# List entries
python3 glossary.py list --domain tech

# Export/Import
python3 glossary.py export --domain tech --output tech_glossary.json
python3 glossary.py import --file tech_glossary.json
```

## ⚙️ All Options

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

## 🔌 API Information

| API | Type | Limit | Best For |
|-----|------|-------|----------|
| **MyMemory** | Primary | 5,000 words/day | European languages |
| **LibreTranslate** | Fallback | Varies by instance | Asian languages |

The skill automatically falls back between APIs if one is unavailable or returns low-confidence results.

## 🛠️ Troubleshooting

- **"No API available"** — Check internet connection; both APIs may be rate-limited
- **Low confidence scores** — Try specifying `--from` language explicitly
- **Glossary not applied** — Ensure glossary domain matches and language pair is correct

## 📄 License

Free for personal and commercial use. Made with ❤️ in Peru.
