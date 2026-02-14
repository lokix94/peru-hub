# 🔍 Smart Web Researcher

**Version:** 1.0.0 | **Price:** $4.99 | **Author:** Peru 🇵🇪

## Description

A powerful research skill that takes any topic, searches multiple sources (Wikipedia, DuckDuckGo, Google), cross-references results, and produces a structured research report with citations and confidence scoring.

## Features

- **Multi-source search** — Queries Wikipedia, DuckDuckGo, and Google simultaneously
- **Cross-referencing** — Identifies claims that appear across multiple sources
- **Structured output** — Clean markdown report with summary, key findings, and sources
- **Confidence scoring** — Rates findings based on source agreement and quality
- **Citation tracking** — Every claim is linked back to its source
- **Configurable depth** — Quick overview or deep research modes

## Requirements

- `bash` (4.0+)
- `curl`
- `jq` (for JSON parsing)
- `python3` (for HTML parsing and report generation)

## Installation

```bash
# Install dependencies (if not already present)
apt-get install -y curl jq python3
pip3 install beautifulsoup4
```

Copy this skill folder to your workspace and make the script executable:

```bash
chmod +x research.sh
```

## Usage

### Basic Research

```bash
./research.sh "quantum computing applications"
```

### Deep Research (more sources, longer report)

```bash
./research.sh --deep "artificial intelligence in healthcare"
```

### Quick Overview

```bash
./research.sh --quick "climate change 2025"
```

### Output to File

```bash
./research.sh --output report.md "blockchain technology"
```

### All Options

```
Usage: research.sh [OPTIONS] "QUERY"

Options:
  --quick       Quick overview (fewer sources, shorter)
  --deep        Deep research (more sources, detailed)
  --output FILE Save report to file (default: stdout)
  --json        Output as JSON instead of markdown
  --help        Show this help message
```

## Output Format

```markdown
# Research Report: [Topic]
Generated: [Date] | Sources: [N] | Confidence: [High/Medium/Low]

## Executive Summary
[2-3 sentence overview]

## Key Findings
1. **Finding 1** — [Description] [Source1, Source2]
2. **Finding 2** — [Description] [Source3]
...

## Detailed Analysis
[Expanded discussion of findings]

## Sources
1. [Title] — [URL] (Retrieved: [Date])
2. ...

## Methodology
- Sources queried: [list]
- Cross-reference matches: [N]
- Confidence calculation: [explanation]
```

## Example

```bash
$ ./research.sh "Machu Picchu history"
```

Output:
```markdown
# Research Report: Machu Picchu history
Generated: 2026-02-14 | Sources: 5 | Confidence: High

## Executive Summary
Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera
of southern Peru. Built during the reign of Inca emperor Pachacuti (1438–1472),
it was abandoned during the Spanish Conquest and remained largely unknown to the
outside world until 1911 when American historian Hiram Bingham III brought it to
international attention.

## Key Findings
1. **Construction Period** — Built c. 1450 CE during reign of Pachacuti [Wikipedia, DuckDuckGo]
2. **Purpose** — Likely a royal estate for Inca emperor Pachacuti [Wikipedia]
3. **Rediscovery** — Brought to global attention in 1911 by Hiram Bingham III [Wikipedia, DuckDuckGo]
4. **UNESCO Status** — Declared a UNESCO World Heritage Site in 1983 [Wikipedia]
...
```

## How It Works

1. **Query Expansion** — The input query is used as-is and also expanded with related terms
2. **Multi-Source Fetch** — Simultaneously queries Wikipedia API, DuckDuckGo HTML, and Google search
3. **Content Extraction** — Strips HTML, extracts relevant text passages
4. **Cross-Reference** — Identifies key claims and checks which sources agree
5. **Confidence Scoring** — Higher confidence when multiple independent sources agree
6. **Report Generation** — Compiles everything into a structured markdown report

## Limitations

- Relies on free web APIs which may rate-limit
- Wikipedia is the most reliable source; web search results may vary
- Not suitable for real-time data (stock prices, live events)
- Results quality depends on query specificity
