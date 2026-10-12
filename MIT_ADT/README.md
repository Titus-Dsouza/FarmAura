# KisanSaathi

An AI-powered agricultural assistance platform for Indian farmers — providing crop guidance, farming calculators, buyer-offer comparisons, government-scheme information, and an AI assistant. The project is being developed in phases so the frontend and backend can progress independently and integrate later.

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

KisanSaathi helps farmers access reliable agriculture information and productivity tools in one place. It combines practical utilities (calculators, guides, offer comparisons) with an AI assistant (Gemma 4 + MCP) and supports offline/demo workflows so frontend work can proceed without a running backend.

---

## Key features

- Farmer dashboard: profile, crop guidance, harvest & storage recommendations.
- Calculators: irrigation, fertilizer & manure (deterministic JS implementations).
- Seller dashboard: post purchase intents, browse listings, compare offers.
- Buyer-offer comparison and purchase request flow (demo data available).
- Government schemes viewer (sample entries in demo mode).
- AI assistant (planned): Gemma 4 via MCP with approved farming tools.
- Voice interaction (browser-supported).
- Language selection and light/dark themes.
- Offline support: service worker, cached app shell, IndexedDB for selected data.
- Demo mode: centralized mock data and API adapter so the frontend is usable without backend.

---

## Technology stack

- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: Python, Django, Django REST Framework
- Database: NeonDB (PostgreSQL)
- ORM: Django ORM
- AI Model: Gemma 4 (inference runtime chosen during AI integration)
- AI Tool integration: Model Context Protocol (MCP)
- Offline: Service Worker, Web App Manifest, IndexedDB
- Version control: Git + GitHub

---

## Architecture (high level)

Frontend ↔ api.js (adapter) ↔ Demo mode (mock-api.js / demo-data.js) OR Backend (Django REST API)
Backend ↔ NeonDB
Backend assistant ↔ Gemma 4 + MCP

The central `api.js` adapter switches between mock data and real API calls so UI code remains unchanged.

---

## Project structure (planned)

KisanSaathi/
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
- `login.html` — local demo role selection / profile setup (not authentication)
- `farmer-dashboard.html` — crop guides, calculators, illustrative buyer offers,
  placeholder scheme cards, and scripted assistant
- `seller-dashboard.html` — local purchase request form and sample crop listings
- `profile.html` — local profile, theme, language preference, and optional voice input

Sample offers, scheme entries, and assistant replies are explicitly demo content.
The default `frontend/js/config.js` mode is `demo`; in this mode the app makes no
backend requests. The API adapter is kept separate in `frontend/js/api.js` for
future integration against the documented Django endpoints.