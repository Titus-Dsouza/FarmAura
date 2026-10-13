# FarmAura

FarmAura is a farmer-focused agricultural web application for crop guidance, farming calculators, buyer-offer comparisons, and government-scheme information. Its current frontend is a local demo that can run independently while backend work progresses.

> NOTE: During frontend development the app runs in Demo Mode (sample data and simulated responses). Demo/sample data must never be presented as live market prices or verified government information.

---

## Table of contents

- Project overview
- Key features
- Technology stack
- Architecture (overview)
- Project structure
- Quick start (frontend demo)
- Backend setup (overview)
- Configuration
- Development roadmap
- Testing & offline
- Security & data reliability
- Contributing
- License

---

## Project overview

FarmAura brings practical farming tools and clearly labelled sample information together in one place. The frontend currently uses local demo data and a scripted SOILY assistant; Gemma 4, MCP, a backend, and offline caching are not connected or implemented.

**SOILY** is FarmAura's intelligent soil and farming assistant identity: friendly, practical, patient, and farmer-focused. The current implementation only explains scripted demo guidance and tools; it is not a connected generative AI service and does not supply field observations, soil-test results, live weather, or verified scheme eligibility.

---

## Key features

- Farmer dashboard: profile, crop guidance, harvest & storage recommendations.
- Calculators: irrigation, fertilizer & manure (deterministic JS implementations).
- Seller dashboard: post purchase intents, browse listings, compare offers.
- Buyer-offer comparison and purchase request flow (demo data available).
- Government schemes viewer (sample entries in demo mode).
- SOILY assistant: scripted demo replies for crop guidance, calculations, illustrative offers, and scheme placeholders. It is not a live AI service and does not provide soil tests, diagnoses, live weather, or verified scheme eligibility.
- Voice interaction hooks (browser support varies).
- Language selection and light/dark themes.
- Offline support: planned; no service worker, web app manifest, or IndexedDB implementation is present.
- Demo mode: centralized mock data and API adapter so the frontend is usable without backend.

---

## Technology stack

- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: Python, Django, Django REST Framework
- Database: NeonDB (PostgreSQL)
- ORM: Django ORM
- Planned AI integration: Gemma 4 inference runtime and Model Context Protocol (MCP); neither is currently configured.
- Planned offline integration: Service Worker, Web App Manifest, IndexedDB.
- Version control: Git + GitHub

---

## Architecture (high level)

Frontend ↔ api.js (adapter) ↔ Demo mode (mock-api.js / demo-data.js) OR Backend (Django REST API)
Backend ↔ NeonDB (planned; not present in this repository)
Future assistant integration ↔ Gemma 4 + MCP (not configured)

The central `api.js` adapter defaults to demo data. Its future API mode is an integration boundary only; no real backend is available.

---

## Project structure (planned)

FarmAura/ (planned structure; the checked-in project currently contains `frontend/` only)
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── farmer-dashboard.html
│   ├── seller-dashboard.html
│   ├── profile.html
│   ├── css/
│   ├── js/
│   │   ├── api.js
│   │   ├── mock-api.js
│   │   ├── demo-data.js
│   │   ├── auth.js
│   │   ├── farmer.js
│   │   ├── seller.js
│   │   ├── chatbot.js
│   │   ├── voice.js
│   │   ├── settings.js
│   │   └── offline.js
│   └── assets/
├── backend/
│   ├── accounts/
│   ├── crops/
│   ├── calculators/
│   ├── marketplace/
│   ├── schemes/
│   ├── assistant/
│   ├── manage.py
│   └── .env.example
├── Design.md
├── Architecture.md
├── phase.md
├── README.md
└── memory.md

---

## Quick start — Frontend (Demo Mode)

The frontend uses HTML5, CSS3 and vanilla JavaScript. It runs without Django,
NeonDB, credentials, an AI runtime, or a build step.

1. Open a terminal in `frontend/`.
2. Start a local static server with Python 3: `python3 -m http.server 8000`.
3. Open `http://localhost:8000` in a browser.

Demo pages:
- `index.html` — welcome page
- `login.html` — local demo workspace selection / profile setup (not authentication)
- `farmer-dashboard.html` — five primary tool links, crop guides, calculators,
  illustrative buyer offers, placeholder scheme cards, and local Sell Goods demo
- `seller-dashboard.html` — illustrative produce listing examples (including farmer
  listings saved in the same browser) and an optional local-only purchase-request demo
- `profile.html` — local profile, theme, language preference, and optional voice input

Sample offers, scheme entries, and assistant replies are explicitly demo content.
The default `frontend/js/config.js` mode is `demo`; in this mode the app makes no
backend requests. The API adapter is kept separate in `frontend/js/api.js` for
future integration against the documented Django endpoints.

The local role chooser is a demo shortcut, not a login or authenticated role
selection. Django authentication and a real database are not present yet, so
farmer-created listings and retailer requests stay in this browser and do not
reach real users. The retailer page shows clearly labelled illustrative records,
not live inventory or prices.

## Backend and Phase 4 status

The repository currently contains the Phase 1–2 frontend only. The Phase 3
Django/NeonDB backend, models, migrations, and Python dependency manifest are
not present, so no farming API is implemented or available yet. See
[PHASE4-INTEGRATION-PLAN.md](PHASE4-INTEGRATION-PLAN.md) for the proposed
versioned API contracts, implementation prerequisites, and migration/test
commands. The frontend remains in demo mode and is not changed by that plan.