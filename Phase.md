# KisanSaathi — Phase.md

Version: 1.0
Last updated: 2026-10-12
Owner (frontend): Titus Dsouza
Owner (backend): Backend teammate

---

## Project Overview

KisanSaathi is an AI-assisted agricultural web application to help Indian farmers access tools, crop information, seller offers, government schemes, and an AI assistant. The project is developed in phases so frontend and backend work can progress independently and integrate smoothly.

Core principle: The frontend must run independently before the backend is ready — use centralized mock data and a demo-mode API adapter until the real backend is available.

Design system (from Design.md)
- Primary green: `#2E7D32`
- Deep green: `#174D35`
- Fresh green: `#8BC34A`
- Warm cream: `#FFFDF5`
- Sunny yellow: `#F9C74F`

Technologies (source of truth: Architecture.md)
- Frontend: HTML5, CSS3, JavaScript (vanilla)
- Backend: Django + Django REST Framework
- Database: Neon (PostgreSQL)
- AI: Gemma 4 via MCP server (backend integration)

Important rules
- Do not change the agreed stack without discussion.
- Keep mock/demo data separated from production logic.
- Authentication must be implemented on the backend.
- The frontend uses a single API adapter (`api.js`) to switch between demo and backend modes.

---

## Phase 1 — Frontend Foundation and Welcome Page
Owner: Frontend

Goal: Build the basic website structure, navigation, visual identity, and a responsive welcome page that runs locally without a backend.

Tasks
1. Create the frontend project folder and initial HTML pages.
2. Set up base HTML/CSS/JS structure and component layout.
3. Implement KisanSaathi logo and visual identity.
4. Implement the Welcome page with:
   - Clear introduction
   - Hero section with agriculture imagery
   - Feature cards: farming tools, seller offers, government schemes, AI assistant
   - Prominent "Get Started" button
5. Create shared navigation and footer components.
6. Apply the design system colors, spacing, typography, and buttons.
7. Make the page responsive (mobile, tablet, desktop).
8. Add initial JavaScript interactions (menu toggles, smooth scroll, Get Started behavior).

Deliverables
- Working welcome page and navigation.
- Shared CSS and JS files (style.css, dashboard.css, responsive.css, shared JS).
- No missing assets or broken links.

Completion criteria
- Opens locally without backend.
- Navigation and buttons work.
- Mobile and desktop layouts OK.

---

## Phase 2 — Frontend Dashboards, Mock Data, and Demo Mode
Owner: Frontend

Goal: Implement farmer and seller flows and ensure the entire frontend is usable locally without Django or NeonDB.

A. Authentication / Role selection (UI only)
- Login/signup pages (UI only in demo mode).
- Role selection: Farmer or Seller.

B. Farmer dashboard
- Farmer profile (sample name, location, crops, prefs).
- Harvest and decay guidance (sample content).
- Irrigation calculator (client-side JS).
- Fertilizer & manure calculator (client-side JS).
- Seller offer comparison (sample offers).
- Government schemes UI (clearly labelled sample data).
- Voice commands interface (browser-supported hooks).
- Language selector (languages from Architecture.md).
- Dark/light theme switch.
- AI chatbot interface (simulated responses in demo-mode).

C. Seller dashboard
- View sample farmer crop listings.
- Create purchase intent (crop, quantity, requirements).
- View matches and sample purchase requests.

D. Mock data and demo mode
- Central mock-data layer (no mixing into UI code).
- Suggested structure:

  frontend/
  ├── index.html
  ├── login.html
  ├── farmer-dashboard.html
  ├── seller-dashboard.html
  ├── profile.html
  ├── css/
  │   ├── style.css
  │   ├── dashboard.css
  │   └── responsive.css
  ├── js/
  │   ├── api.js            // central adapter
  │   ├── mock-api.js       // demo backend shim
  │   ├── demo-data.js      // sample records
  │   ├── auth.js
  │   ├── farmer.js
  │   ├── seller.js
  │   ├── chatbot.js
  │   ├── voice.js
  │   ├── settings.js
  │   └── offline.js
  └── assets/

- Central config example:

```javascript
const APP_CONFIG = {
  DEMO_MODE: true
};
```

Demo-mode behavior
- api.js routes to mock-api.js when DEMO_MODE is true.
- Load sample farmer and seller data.
- Simulate login and role selection.
- Calculators run locally.
- Chatbot returns predefined demo responses.
- UI shows clear "Demo Data" or "Sample Data" labels where appropriate.
- Do not present sample data as verified live information.

Deliverables
- Complete welcome, login/role-selection, farmer, and seller pages.
- Centralized mock data and API adapter.
- Working calculators and chatbot UI (demo responses).
- Demo-mode toggle in config.

Completion criteria
- Full frontend demonstrable locally without authentication or backend.
- Demo mode available and correctly labeled.

---

## Phase 3 — Django Backend Foundation and Database Connection
Owner: Backend

Goal: Create the Django project, configure NeonDB, and provide the initial models and health endpoints.

Tasks
1. Create Django project and apps per Architecture.md:
   - accounts, crops, calculators, marketplace, schemes, assistant
2. Install Django REST Framework.
3. Add environment variables and `.env.example` (no secrets).
4. Connect to Neon PostgreSQL using Django settings.
5. Create initial models:
   - User, FarmerProfile, SellerProfile, Crop, BuyerOffer, PurchaseRequest, GovernmentScheme, SavedResource
6. Run migrations and confirm DB connectivity.
7. Create API health endpoint (e.g., `/api/health/`).

Deliverables
- Working Django project with migrations.
- Successful NeonDB connection and health endpoint.

Completion criteria
- Django runs, migrations apply, and DB reads/writes test records.

---

## Phase 4 — Farming APIs and Backend Business Logic
Owner: Backend

Goal: Implement REST APIs used by the frontend.

Suggested endpoints (follow Architecture.md conventions)
- GET/POST /api/profile/
- GET /api/crops/
- GET /api/crops/{id}/guides/
- POST /api/calculators/irrigation/
- POST /api/calculators/fertilizer/
- GET /api/buyer-offers/
- POST /api/purchase-requests/
- GET /api/schemes/
- POST /api/assistant/chat/

Tasks
- Implement serializers, viewsets, validation, and pagination where needed.
- Provide sample records for testing.
- Document the request/response JSON contracts and share with frontend.

Deliverables
- Working REST endpoints and API docs.
- Consistent JSON responses and validation.

Completion criteria
- Endpoints testable independently and return expected payloads/errors.

---

## Phase 5 — Authentication and Role-Based Access
Owner: Backend (Auth)

Goal: Implement secure signup/login/logout and role-based permissions.

Tasks
1. Implement endpoints:
   - POST /api/auth/signup/
   - POST /api/auth/login/
   - POST /api/auth/logout/
   - GET /api/profile/ (current user)
2. Use Django auth and password hashing.
3. Add farmer/seller role fields and enforce server-side permissions.
4. Configure secure session or token-based auth depending on deployment architecture (same-origin vs cross-origin).
5. Add CSRF protections for cookie-based session auth.
6. Test edge cases: invalid login, session expiry, permission enforcement.

Frontend coordination
- Once ready, the frontend replaces DEMO auth calls with real API calls through api.js.

Deliverables
- Working auth endpoints, role enforcement, and client integration guidance.

Completion criteria
- Users can sign up/login; protected endpoints reject unauthenticated requests.

---

## Phase 6 — Frontend and Backend Integration
Owners: Both

Goal: Replace mock API implementation with real Django REST APIs without rewriting the frontend.

Tasks
1. Agree and finalize API contracts.
2. Update api.js to call production endpoints when DEMO_MODE is false.
3. Wire login, logout, profile retrieval, crop guides, calculators, buyer offers, purchase requests, and schemes.
4. Add loading states, retry options, and error messages.
5. Keep demo mode available as a switch for offline demos.

Important rule
- Only change the API adapter; do not rewrite the UI when backend becomes available.

Deliverables
- Connected frontend and backend; working authenticated dashboards.

Completion criteria
- UI works with real API; demo mode still available.

---

## Phase 7 — Gemma 4 and MCP Server Integration
Owner: Backend (AI/MCP)

Goal: Connect Gemma 4-powered assistant through MCP to the application safely.

Responsibilities
- Gemma 4 model + inference runtime
- MCP server exposing approved tools
- Django assistant service mediating requests and permissions
- Frontend chatbot connecting to `/api/assistant/chat/`

Approved MCP tools (examples)
- get_crop_guide
- calculate_irrigation
- calculate_fertilizer
- compare_buyer_offers
- search_government_schemes
- get_saved_resources

AI reliability & safety rules
- Use deterministic server-side code for numeric calculations.
- Use verified data sources for prices and schemes; state uncertainty if unavailable.
- Keep model/service credentials on the server.
- Validate tool inputs/outputs and enforce timeouts.
- Prevent exposure of private user data.

Demo-mode behavior
- Until MCP/Gemma are available, the chatbot must use predefined demo responses and be clearly labelled "Demo assistant."

Deliverables
- Gemma 4 inference tests, MCP server configuration, Django assistant integration, and at least one working tool call.

Completion criteria
- A user can ask a farming question and get an answer via the site; errors do not break other features.

---

## Phase 8 — Offline Support, Testing, and Deployment
Owners: Both

Goal: Hardening, testing, and preparing the final demo and production deployment.

Frontend tasks
- Add web app manifest and service worker.
- Cache app shell and selected assets.
- Use IndexedDB for locally saved data where appropriate.
- Keep calculators functional offline.
- Show offline indicator and clearly mark cached vs live data.

Backend tasks
- Robust API validation and error handling.
- Authentication/permission tests.
- DB migration and access tests.
- Monitor assistant and MCP failures.
- Configure production env vars and HTTPS.
- Logging and health checks.

Joint testing scenarios
- Welcome page runs without backend.
- Demo mode loads expected data.
- Login and role selection work in demo mode.
- Real auth works when enabled.
- Chatbot gracefully degrades if assistant unavailable.
- Offline-cached pages and calculators function without network.

Deliverables
- Offline support, deployment config, test reports, updated docs (README.md, Architecture.md, Phase.md).

Completion criteria
- Application reliably demonstrable with clear separation of demo vs live data.

---

## Development Order and Ownership Summary

| Phase | Main work | Owner |
|---|---:|:---|
| 1 | Frontend foundation and welcome page | Frontend |
| 2 | Dashboards, mock data, demo mode | Frontend |
| 3 | Django + NeonDB setup | Backend |
| 4 | Farming APIs & logic | Backend |
| 5 | Authentication & roles | Backend |
| 6 | Frontend ↔ Backend integration | Both |
| 7 | Gemma 4 & MCP integration | Backend |
| 8 | Offline support, testing, deployment | Both |

---

## Team Rules and Agreements

1. Frontend first — the frontend must be demonstrable without the backend.
2. Keep the chosen stack — do not introduce new frontend/backend frameworks or databases without discussion.
3. Agree on API contracts early and document them.
4. Keep mock/demo data separate from production logic and centralized behind api.js.
5. Authentication and permission enforcement must be server-side.
6. Integrate incrementally and test each API as it becomes available.
7. Document phase completion and major technical decisions in memory.md or repo docs.
8. AI/assistant outages must not block core website functionality.

---

## Immediate Next Step (short actionable)
Start Phase 1: initialize the frontend project structure, implement the shared design system, and build the Welcome page. Ensure `api.js` and `mock-api.js` are in place and APP_CONFIG.DEMO_MODE = true so the site runs locally without any backend.

---

## Appendix — Example config snippet and mock-api contract

APP_CONFIG example:
```javascript
const APP_CONFIG = {
  DEMO_MODE: true,
  SUPPORTED_LANGUAGES: ['en', 'hi', 'mr', 'bn'], // example set - align with Architecture.md
  THEME: 'light' // default
};
```

api.js responsibilities (contract)
- Export methods used by the UI (e.g., auth.login(), profile.get(), crops.list(), calculators.irrigation(params), offers.list()).
- When DEMO_MODE is true, forward calls to mock-api.js which returns Promise-resolved demo data.
- When DEMO_MODE is false, make fetch/XHR calls to the Django REST endpoints and return normalized responses or well-structured errors.

Mock data files (recommended)
- demo-data.js — sample objects and arrays for profiles, crops, offers, schemes.
- mock-api.js — functions that return Promises and simulate latency/errors for testing.

---

If you want, I can:
- commit this Phase.md to a specific repo/branch,
- or generate the initial frontend file/folder scaffold and the api.js + mock-api.js stubs next.
Which would you like me to do now?