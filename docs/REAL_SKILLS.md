# Skills reales en Langosta Hub

Estas skills **no son demos**: tienen runtime en el servidor o protocolo oficial instalable.

## Runtimes en vivo

| Skill ID | Endpoint | Proveedor | Licencia / fuente |
|----------|----------|-----------|-------------------|
| `smart-web-researcher` | `POST /api/skills/run/web-search` | DuckDuckGo (+ Serper opcional) | API pública DDG |
| `voice-synthesis` | `POST /api/skills/run/tts` | Edge TTS (protocolo community) | [rany2/edge-tts](https://github.com/rany2/edge-tts) |
| `weather-intelligence` | `POST /api/skills/run/weather` | [Open-Meteo](https://open-meteo.com) | Free / CC |
| `moltbook-*` | `GET /api/skills/run/moltbook` | [Moltbook Official](https://github.com/Moltbook-Official/moltbook) | skill.md oficial |

Índice: `GET /api/skills/run`  
Catálogo con flag `isReal`: `GET /api/skills?real=true`

## Ejemplos

### Búsqueda web
```bash
curl -X POST https://langosta-hub.vercel.app/api/skills/run/web-search \
  -H 'Content-Type: application/json' \
  -d '{"query":"IA en Perú","maxResults":5}'
```

### Voz (MP3)
```bash
curl -X POST https://langosta-hub.vercel.app/api/skills/run/tts \
  -H 'Content-Type: application/json' \
  -d '{"text":"Hola, soy tu agente.","voice":"camila"}' \
  --output voz.mp3
```

Voces: `camila`, `alex` (Perú), `es-mx-dalia`, `es-mx-jorge`, `jenny`

### Clima
```bash
curl -X POST https://langosta-hub.vercel.app/api/skills/run/weather \
  -H 'Content-Type: application/json' \
  -d '{"city":"Lima"}'
```

### Moltbook oficial
```bash
curl https://langosta-hub.vercel.app/api/skills/run/moltbook
```

Instalación en el agente:
```bash
mkdir -p ~/.moltbot/skills/moltbook
curl -s https://www.moltbook.com/skill.md > ~/.moltbot/skills/moltbook/SKILL.md
curl -s https://www.moltbook.com/heartbeat.md > ~/.moltbot/skills/moltbook/HEARTBEAT.md
```

## Fuentes OSS usadas / compatibles

- [openclaw/agent-skills](https://github.com/openclaw/agent-skills)
- [SKY-lv/awesome-openclaw-skills](https://github.com/SKY-lv/awesome-openclaw-skills)
- [blessonism/openclaw-skills](https://github.com/blessonism/openclaw-skills)
- [Moltbook-Official/moltbook](https://github.com/Moltbook-Official/moltbook)
- [rany2/edge-tts](https://github.com/rany2/edge-tts)
- [Open-Meteo](https://open-meteo.com)

## Próximas skills reales

- Memory (mnemosyne / mem0 self-host)
- Content extract (URL → markdown)
- Code review workflow (openclaw agent-skills)
