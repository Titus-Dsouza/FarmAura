# KisanSaathi — Project Memory

Last updated: 2026-10-13

## A. Project Overview

- Project name: KisanSaathi
- Purpose: AI-powered agricultural assistance for Indian farmers, combining crop guidance, calculators, buyer-offer comparisons, government-scheme information, and AI support.
- Intended users:
  - Farmers seeking crop guidance, irrigation and fertilizer estimates, market comparisons, and scheme awareness.
  - Sellers/buyers who want to post or view purchase requirements and available crop listings.
- Current repo reality: Phase 1 and Phase 2 vanilla frontend pages are implemented under `frontend/`; backend, authentication, database, and AI/MCP services are not implemented.

## B. Fixed Technology Stack

This is the stack defined by the architecture docs and must not be replaced without explicit approval.

- Frontend: HTML5, CSS3, vanilla JavaScript
- Backend: Python, Django
- API: Django REST Framework
- Database: NeonDB using PostgreSQL
- Database interaction: Django ORM
- Authentication: Django authentication backed by NeonDB/PostgreSQL
- AI model: Gemma 4
- AI tool integration: Model Context Protocol (MCP)
- Offline support: Service Worker, Web App Manifest, and IndexedDB where appropriate

Important clarifications:
- NeonDB is a managed PostgreSQL service; it is not a complete authentication provider.
- Gemma 4 is the model, while its runtime is a separate component.
- MCP is a tool-exposure protocol for the AI workflow, not a model runtime.
- Offline capabilities do not imply offline AI inference by default.

## C. Product Features

### Planned features

- Welcome page
  - Project introduction and navigation
  - Feature cards and calls to action
- Farmer dashboard
  - Farmer profile
  - Harvest and crop guidance
  - Irrigation calculator
  - Fertilizer and manure calculator
  - Seller-offer comparison
  - Government schemes and loans
  - Voice interaction where supported
  - Language selector
  - Dark/light theme
  - AI chatbot
- Seller dashboard
  - Enter crop-purchasing requirements
  - Explore available crop listings
  - View purchase requests
- Supporting capabilities
  - Frontend demo mode with mock data
  - Backend API integration
  - Gemma 4 + MCP-powered assistant
  - Selected offline functionality

### Implemented features

- Responsive KisanSaathi welcome page and navigation.
- Local demo role selection/profile setup, with no real authentication.
- Farmer dashboard with crop guidance, saved-guide state, input-driven irrigation and fertilizer/manure arithmetic, sortable/filterable illustrative offers, placeholder scheme cards, and recent activity.
- Seller workspace with filterable/sortable illustrative listings, local purchase-request matching, and locally saved/removable requests.
- Local profile preferences, persistent light/dark theme, language preference, and optional browser speech-command hooks.
- Scripted demo assistant with suggested prompts and no AI/backend dependency.
- Separate demo data, mock API, configuration, API adapter, UI logic, shared styles, and responsive styles.
- No backend, database, authentication provider, MCP server, or Gemma runtime implementation.

## D. Design System

The design system is defined in Design.md and Phase.md.

- Primary green: #2E7D32
- Deep green: #174D35
- Fresh green: #8BC34A
- Warm cream: #FFFDF5
- White cards: #FFFFFF
- Earth brown: #795548
- Sunny yellow: #F9C74F
- Dark text: #202820
- Dark background: #121A15
- Dark card: #1D2921

Design intent:
- Modern, responsive, accessible, farmer-friendly
- Consistent with the documented product direction
- Use the agreed language set from the project docs; no additional language list should be invented without approval

## E. Architecture and Development Rules

1. Keep frontend UI code separate from API communication.
2. Use a central frontend API adapter.
3. Keep mock data separate from production API logic.
4. The frontend must run in demo mode without the backend.
5. Never show a backend-unavailable error simply because demo mode is active.
6. Do not present sample prices or sample schemes as verified live information.
7. Keep authentication and authorization enforcement on the backend.
8. Do not expose credentials, API keys, or database secrets in frontend code.
9. Use Django ORM for database interactions.
10. Do not introduce frameworks or change the stack without explicit approval.
11. Follow phase.md and work only on the requested phase.
12. Avoid rewriting working code unnecessarily.

## F. Development Phases

Source of truth: Phase.md

1. Frontend foundation and welcome page — Complete (static checks and local HTTP verification)
2. Frontend dashboards, mock data, and demo mode — Complete (syntax, static structure, demo API and local HTTP checks)
3. Django backend and database connection — Not Started
4. Farming APIs and business logic — Not Started
5. Authentication and role-based access — Not Started
6. Frontend/backend integration — Not Started
7. Gemma 4 and MCP integration — Not Started
8. Offline support, testing, and deployment — Not Started

Status note:
- Phase 1 and Phase 2 frontend deliverables are implemented in `frontend/` and verified with the checks recorded below.
- Phase 3 and later backend/integration work remain unimplemented.

## G. Team Responsibilities

- Frontend developer — Titus Dsouza
  - Welcome page, dashboards, responsive design, mock data, frontend interactions, API adapter, and frontend/backend integration
- Backend developer — Backend teammate
  - Django, NeonDB, REST APIs, authentication, permissions, Gemma 4, and MCP integration
- Shared responsibility
  - Integration testing, offline support, deployment, documentation, and final verification

## H. Current Project Status

### Current phase
- Current phase: Phase 2 — Frontend Dashboards, Mock Data, and Demo Mode
- Implemented status: Complete for documented Phase 2 frontend scope, verified 2026-10-13
- Governing source: Phase.md is the authoritative project roadmap for scope, sequencing, and ownership.
- Frontend-first rule: the default `demo` configuration runs independently of backend, database, authentication, and MCP.

### Completed features
- Welcome page, local demo role flow, farmer and seller workspaces, profile/settings, mock data and API layers, deterministic input-based calculators, buyer/listing filters and sorts, local save/remove flows, scripted assistant, optional speech input, theme persistence, validation and feedback states.

### Features not yet started
- Django backend, NeonDB connection, server-side authentication/authorization, production APIs, Gemma 4, MCP integration, offline caching/IndexedDB, and verified live scheme/market data.

### Existing file and folder structure

- Project docs: README.md, Design.md, Architect.md, Phase.md, memory.md
- Frontend pages: index.html, login.html, farmer-dashboard.html, seller-dashboard.html, profile.html
- Frontend CSS: css/style.css, css/dashboard.css, css/responsive.css
- Frontend JS: config.js, demo-data.js, mock-api.js, api.js, app.js, auth.js, farmer.js, seller.js, chatbot.js, settings.js, welcome.js
- No backend/ folder or Django project files
- No dependency installation or build step required

Important naming note:
- The repo file is named Architect.md, while the docs reference Architecture.md.
- This may be a naming discrepancy or documentation shorthand, but as currently checked in, the repository does not include a true Architecture.md file in the root.
- No PRD.md is present. The docs consistently identify the product as KisanSaathi; “MediScribe” in the task title was not treated as a project rename.

### Confirmed working commands
- Run from `frontend/`: `python3 -m http.server 8000`; open `http://localhost:8000`.
- `node --check` passed for every frontend JavaScript file.
- HTML references/section/label/anchor and CSS structure checks passed.
- Local HTTP checks returned 200 for pages, CSS and JavaScript assets.
- Demo API behavior was checked in Node with a stubbed fetch; demo mode made no network calls.
- Dashboard handlers were exercised with DOM stubs for crop/listing filters, calculator arithmetic, saved offers, request matching and local request state.
- A real browser visual/interaction run was not available in the environment.

### Known bugs and blockers
- No known runtime blocker from the available static and local-server checks.
- No browser runner was available for rendered visual QA or real speech-recognition testing.
- The welcome-page hero image is hosted remotely and needs internet connectivity; the rest of the app shell is local.
- Language choice is stored as a preference, but most interface copy is currently English.
- API mode is an integration boundary only; the default and demonstrated mode is local demo mode.

### Can the frontend run without the backend?
- Yes. Static local HTTP delivery and demo-mode data loading were verified without Django, NeonDB, authentication, or MCP.

### Are the real backend, authentication, and MCP server available?
- No. None are present in the checked-in repository.
- No real Django backend or NeonDB access is configured.
- No authentication implementation is present.
- No MCP server or Gemma 4 runtime is included.

## I. Recent Decisions

- 2026-10-12 — Defined the core product direction: AI-powered agricultural website for Indian farmers, with calculators, buyer-offer comparison, government schemes, and chat support.
- 2026-10-12 — Agreed stack locked: HTML5/CSS3/vanilla JS frontend, Python/Django backend, Django REST Framework, PostgreSQL/NeonDB, Gemma 4, MCP, and offline support via service worker/IndexedDB.
- 2026-10-12 — Established demo-mode architecture: frontend should operate without backend using a central API adapter and mock data layer.
- 2026-10-12 — Confirmed backend enforcement for authentication and authorization; do not trust browser-side role checks.
- 2026-10-12 — Documented safety and labeling rules: sample prices and schemes must never be described as live or verified information.
- 2026-10-12 — Documented AI safety constraints: model outputs must use validated data sources and approved tools; no arbitrary DB access.
- 2026-10-12 — Set the phase order and ownership boundaries for frontend-first development.
- 2026-10-13 — Completed Phase 1 welcome page and Phase 2 frontend demo using the documented vanilla stack; mock records and local-only interactions remain separate from future backend integration.
- 2026-10-13 — Demo offers and scheme cards are marked illustrative/unverified; calculator rates come from user input or explicit unit conversion rather than embedded agronomic prescriptions.

## J. Next Steps

Actionable next steps:

- [ ] Backend teammate: begin Phase 3 Django foundation and NeonDB connection.
- [ ] Agree and document API request/response contracts before frontend API mode is enabled.
- [ ] Frontend follow-up: test pages and mobile layouts in real browsers and review localized copy when translation scope is agreed.
- [ ] Keep demo mode available and preserve clear demo/unverified labels during integration.

## K. Instructions for Future AI Agents

- Read memory.md, Phase.md, Architect.md/Architecture.md, and Design.md before making significant changes.
- Inspect the current source code before modifying files.
- Ask before making changes that conflict with documented architectural decisions.
- Follow the requested phase boundaries.
- Preserve existing functionality.
- Update memory.md after completing a meaningful task.
- Record only verified progress.
- Keep the next steps concise and actionable.

## Notes / Unresolved Questions

- The repo references Architecture.md in the project docs, but the actual file in the root is named Architect.md. Confirm whether the filename should be standardized to Architecture.md.
- No PRD.md was found; the supplied design, architecture and phase documentation governed this work.
- No backend credentials, NeonDB connection, or MCP/Gemma runtime are present. This is still a planned implementation gap.

## Summary

The repository now contains a verified Phase 1 welcome page and Phase 2 vanilla frontend demo. The default demo runs without external services; the next roadmap phase is the backend teammate's Django foundation, with API contracts to be agreed before production integration.
