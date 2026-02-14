# 🔍 Smart Web Researcher

> Multi-source research tool that searches, cross-references, and produces structured reports with citations.

**Version:** 1.0.0 | **Author:** Peru 🇵🇪 | **Price:** $4.99

---

## ✨ Features

- 🌐 **Multi-source search** — Queries Wikipedia, DuckDuckGo, and Google simultaneously
- 🔗 **Cross-referencing** — Identifies claims that appear across multiple sources
- 📊 **Structured output** — Clean markdown reports with summary, key findings, and sources
- 📈 **Confidence scoring** — Rates findings based on source agreement and quality
- 📎 **Citation tracking** — Every claim is linked back to its source
- 🎚️ **Configurable depth** — Quick overview or deep research modes

## 🚀 Installation

### Prerequisites

```bash
# Install required tools
apt-get install -y curl jq python3
pip3 install beautifulsoup4
```

### Setup

```bash
chmod +x research.sh
```

## 📖 Usage

### Basic Research

```bash
./research.sh "quantum computing applications"
```

### Research Modes

```bash
# Quick overview (fewer sources, shorter report)
./research.sh --quick "climate change 2025"

# Deep research (more sources, detailed analysis)
./research.sh --deep "artificial intelligence in healthcare"
```

### Save to File

```bash
./research.sh --output report.md "blockchain technology"
```

### JSON Output

```bash
./research.sh --json "renewable energy trends"
```

## ⚙️ All Options

```
Usage: research.sh [OPTIONS] "QUERY"

Options:
  --quick       Quick overview (Wikipedia only, shorter)
  --deep        Deep research (all sources, expanded queries)
  --output FILE Save report to file (default: stdout)
  --json        Output as JSON instead of markdown
  --help        Show this help message
```

## 📄 Output Format

Reports are generated in structured markdown:

```markdown
# Research Report: [Topic]
Generated: [Date] | Sources: [N] | Confidence: [High/Medium/Low]

## Executive Summary
[2-3 sentence overview]

## Key Findings
1. **Finding 1** — [Description] [Source1, Source2]
2. **Finding 2** — [Description] [Source3]

## Detailed Analysis
[Expanded discussion of findings]

## Sources
1. [Title] — [URL] (Retrieved: [Date])

## Methodology
- Sources queried: [list]
- Cross-reference matches: [N]
```

## 🔍 Example

```bash
$ ./research.sh "Machu Picchu history"

# Research Report: Machu Picchu history
Generated: 2026-02-14 | Sources: 5 | Confidence: High

## Executive Summary
Machu Picchu is a 15th-century Inca citadel located in southern Peru.
Built during the reign of Inca emperor Pachacuti (1438–1472), it was
brought to international attention in 1911 by Hiram Bingham III.

## Key Findings
1. **Construction** — Built c. 1450 CE [Wikipedia, DuckDuckGo]
2. **Purpose** — Likely a royal estate for Pachacuti [Wikipedia]
3. **UNESCO** — World Heritage Site since 1983 [Wikipedia]
...
```

## ⚠️ Limitations

- Relies on free web APIs which may rate-limit
- Wikipedia is the most reliable source; web results may vary
- Not suitable for real-time data (stock prices, live events)
- Results quality depends on query specificity

## 📄 License

Free for personal and commercial use. Made with ❤️ in Peru.
