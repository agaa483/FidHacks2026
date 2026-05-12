# HerFinance

Credit literacy app for first-gen immigrant college women. Static frontend + tiny Node/Express backend that proxies OpenAI.

## Setup

```bash
npm install
cp .env.example .env
# edit .env and paste your OpenAI key
npm start
```

Open http://localhost:3000

## Endpoints

- `POST /api/chat` — `{ profile, history, message }` → `{ reply }`. Profile = quiz answers; history = prior chat turns. System prompt is built from the profile so every reply is personalized.
- `POST /api/explain` — `{ profile, text }` → `{ reply }`. Simplifies the last bot answer for family.
- `POST /api/scan` — multipart `pdf` + `profile` → structured JSON (APR, fees, flags, summary). Reads the PDF text and asks the model to extract terms.
- `GET  /api/health` — sanity check.

## Files

- `server.js` — Express server
- `index.html` / `style.css` / `main.js` — frontend (served statically)
- `.env` — your OpenAI key (gitignored)
