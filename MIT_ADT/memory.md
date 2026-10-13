# FarmAura — Project Memory

Last updated: 2026-10-13

## A. Project Overview

- Project name: FarmAura
- Purpose: agricultural assistance for Indian farmers, combining crop guidance, calculators, buyer-offer comparisons, government-scheme information, and a planned AI service.
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
- Planned AI model: Gemma 4 (not configured or connected)
- AI tool integration: Model Context Protocol (MCP)
- Planned offline support: Service Worker, Web App Manifest, and IndexedDB; none is present yet

Important clarifications:
- NeonDB is a managed PostgreSQL service; it is not a complete authentication provider.
- Gemma 4 is the model, while its runtime is a separate component.
- MCP is a tool-exposure protocol for the AI workflow, not a model runtime.
- Offline capabilities do not imply offline AI inference by default.
- The visible assistant is SOILY. It currently returns scripted demo responses, not model-generated answers.

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
  - SOILY scripted demo assistant
- Seller dashboard
  - Enter crop-purchasing requirements
  - Explore available crop listings
  - View purchase requests
- Supporting capabilities
  - Frontend demo mode with mock data
  - Backend API integration
  - Gemma 4 + MCP-powered assistant (planned; not connected)
  - Selected offline functionality

### Implemented features

- Responsive FarmAura welcome page and navigation.
- Local demo role selection/profile setup, with no real authentication.
- Farmer dashboard with five primary feature links, including Sell Goods; crop guidance, saved-guide state, input-driven irrigation and fertilizer/manure arithmetic, sortable/filterable illustrative offers, placeholder scheme cards, and recent activity.
- Sell Goods demo form with positive-number and required-field validation, browser-local create/edit/remove, and clear unpublished/demo notices.
- Retailer dashboard with filterable/sortable illustrative listings, farmer-created browser-local demo listings through the existing mock API, unit-normalized purchase-request matching, and locally saved/removable requests.
- Local profile preferences, persistent light/dark theme, language preference, and optional browser speech-command hooks.
- Scripted demo assistant with suggested prompts and no AI/backend dependency.
- SOILY branding, seed-inspired chat identity, soil/crop-care demo prompts, and explicit model/data limitations.
- Separate demo data, mock API, configuration, API adapter, UI logic, shared styles, and responsive styles.
- No backend, database, authentication provider, MCP server, or Gemma runtime implementation.

## D. Design System

The design system is defined in Design.md and Phase.md.

- Deep soil brown: #3E2723
- Rich earth brown: #5D4037
- Warm clay: #A66A4C
- Terracotta: #C66B45
- Organic olive: #697D45
- Fresh leaf green: #7BA05B
- Pale sand: #F5EBDD
- Warm cream: #FFFCF6
- Soft beige: #E8D9C5
- Main text: #29251F
- Secondary text: #71675D
- White: #FFFFFF

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
3. Django backend and database connection — Not present in the checked-in repository; completion unverified
4. Farming APIs and business logic — Blocked on missing Phase 3 setup; integration plan documented
5. Authentication and role-based access — Not Started
6. Frontend/backend integration — Not Started
7. Gemma 4 and MCP integration — Not Started
8. Offline support, testing, and deployment — Not Started

Status note:
- Phase 1 and Phase 2 frontend deliverables are implemented in `frontend/` and verified with the checks recorded below.
- Phase 3 and later backend/integration work remain unimplemented. Phase 4 contracts and prerequisites are documented in `PHASE4-INTEGRATION-PLAN.md`.

## G. Team Responsibilities

- Frontend developer — Titus Dsouza
  - Welcome page, dashboards, responsive design, mock data, frontend interactions, API adapter, and frontend/backend integration
- Backend developer — Backend teammate
  - Django, NeonDB, REST APIs, authentication, permissions, Gemma 4, and MCP integration
- Shared responsibility
  - Integration testing, offline support, deployment, documentation, and final verification

## H. Current Project Status

### Current phase
- Frontend status: Phase 2 — Frontend Dashboards, Mock Data, and Demo Mode; complete for documented Phase 2 frontend scope, verified 2026-10-13.
- Backend status: Phase 3 is not present in the checked-in repository. Phase 4 was requested but is blocked pending the Phase 3 Django project, models, migrations, and database configuration.
- Governing source: Phase.md is the authoritative project roadmap for scope, sequencing, and ownership.
- Frontend-first rule: the default `demo` configuration runs independently of backend, database, authentication, and MCP.
- Phase execution guardrail: each documented phase can be considered complete only when its deliverables and completion criteria are verified in code and local checks; backend and integration work must not be assumed to be complete without evidence.

### Completed features
- Welcome page, local demo role flow, farmer and seller workspaces, profile/settings, mock data and API layers, deterministic input-based calculators, buyer/listing filters and sorts, local save/remove flows, scripted assistant, optional speech input, theme persistence, validation and feedback states.
- The current static UI presents a minimal welcome page, an explicitly demo-only workspace/profile chooser, a farmer dashboard with five primary tool cards, and a retailer dashboard that prioritizes illustrative listing cards. Farmer Sell Goods entries are browser-local demo records visible through the retailer's existing mock listing adapter; they are not published to actual retailers. Existing calculator, filter, local purchase-request, and assistant behaviors remain in place.

### Features not yet started
- Django backend, NeonDB connection, server-side authentication/authorization, production APIs, Gemma 4, MCP integration, offline caching/IndexedDB, and verified live scheme/market data. Phase 4 implementation is blocked by the absent Phase 3 setup.

### Existing file and folder structure

- Project docs: README.md, Design.md, Architect.md, Phase.md, memory.md
- Frontend pages: index.html, login.html, farmer-dashboard.html, seller-dashboard.html, profile.html
- Frontend CSS: css/style.css, css/dashboard.css, css/responsive.css
- Frontend JS: config.js, demo-data.js, mock-api.js, api.js, app.js, auth.js, farmer.js, seller.js, chatbot.js, settings.js, welcome.js
- No backend/ folder or Django project files
- No web app manifest or service worker is present.
- Phase 4 proposed contracts and prerequisites: `PHASE4-INTEGRATION-PLAN.md`; no backend endpoint implementation exists.
- No dependency installation or build step required

Important naming note:
- The repo file is named Architect.md, while the docs reference Architecture.md.
- This may be a naming discrepancy or documentation shorthand, but as currently checked in, the repository does not include a true Architecture.md file in the root.
- No PRD.md is present. Project branding is FarmAura.

### Confirmed working commands
- From the repository root, start the frontend with `python3 -m http.server 8000 --directory frontend`; open `http://localhost:8000`. On 2026-10-13, this served the FarmAura homepage with HTTP 200 and the correct page title.
- A server was already using port 8080 but served an unrelated project; check the page title/content when localhost responds, since a successful connection alone does not confirm the correct app is being served.
- `node --check` passed for every frontend JavaScript file.
- HTML references/section/label/anchor and CSS structure checks passed.
- Local HTTP checks returned 200 for pages, CSS and JavaScript assets.
- Chrome visual checks covered the welcome, farmer and seller pages at 1440px desktop and 390px mobile widths; dashboard light/dark themes and mobile navigation were also exercised.
- The welcome illustration and favicon are local SVG assets; the hero's CSS illustration fallback was verified by simulating an image-load error.
- The welcome image, favicon, stylesheets and scripts loaded without console errors in the normal browser checks, and the tested pages made no external resource requests.
- Demo API behavior was checked in Node with a stubbed fetch; demo mode made no network calls.
- Dashboard handlers were exercised with DOM stubs for crop/listing filters, calculator arithmetic, saved offers, request matching and local request state.

### Known bugs and blockers
- No known runtime blocker from static, local-server, and Chrome visual checks.
- The farmer and seller dashboards contain no image elements, CSS image backgrounds, or JavaScript-created images; their existing CSS/text hero visuals were confirmed visible and left unchanged.
- The welcome hero uses a local agricultural SVG and displays a CSS illustration if the image fails to load.
- Real speech-recognition behavior and browsers other than Chrome were not tested.
- Language choice is stored as a preference, but most interface copy is currently English.
- API mode is an integration boundary only; the default and demonstrated mode is local demo mode.
- The existing `window.KisanSaathi` JavaScript namespace and `kisansathi-demo` browser storage prefix are compatibility identifiers, not user-facing branding; keep them stable unless a migration is planned.

### Can the frontend run without the backend?
- Yes. Static local HTTP delivery and demo-mode data loading were verified without Django, NeonDB, authentication, or MCP.

### Are the real backend, authentication, and MCP server available?
- No. None are present in the checked-in repository.
- No real Django backend or NeonDB access is configured.
- No authentication implementation is present.
- No MCP server or Gemma 4 runtime is included.

## I. Recent Decisions

- 2026-10-12 — Defined the core product direction: AI-powered agricultural website for Indian farmers, with calculators, buyer-offer comparison, government schemes, and chat support.
- 2026-10-12 — Agreed target stack: HTML5/CSS3/vanilla JS frontend, Python/Django backend, Django REST Framework, PostgreSQL/NeonDB, planned Gemma 4/MCP integration, and planned offline support via service worker/IndexedDB.
- 2026-10-12 — Established demo-mode architecture: frontend should operate without backend using a central API adapter and mock data layer.
- 2026-10-12 — Confirmed backend enforcement for authentication and authorization; do not trust browser-side role checks.
- 2026-10-12 — Documented safety and labeling rules: sample prices and schemes must never be described as live or verified information.
- 2026-10-12 — Documented AI safety constraints: model outputs must use validated data sources and approved tools; no arbitrary DB access.
- 2026-10-12 — Set the phase order and ownership boundaries for frontend-first development.
- 2026-10-13 — Completed Phase 1 welcome page and Phase 2 frontend demo using the documented vanilla stack; mock records and local-only interactions remain separate from future backend integration.
- 2026-10-13 — Demo offers and scheme cards are marked illustrative/unverified; calculator rates come from user input or explicit unit conversion rather than embedded agronomic prescriptions.
- 2026-10-13 — Replaced the welcome hero's remote image with a local SVG, verified its CSS fallback in Chrome, and confirmed farmer/seller pages have no broken image references.
- 2026-10-13 — Inspected the repository for the requested Phase 4 work: no Phase 3 Django project, models, migrations, dependency manifest, or NeonDB configuration is present, and Django is unavailable in `.venv`. Documented proposed API contracts and integration prerequisites in `PHASE4-INTEGRATION-PLAN.md`; left frontend demo mode unchanged.
- 2026-10-13 — Resolved local website access confusion: port 8080 was serving another project, so started FarmAura from `frontend/` on port 8000 and verified its page title and HTTP 200 response in a browser. Use `http://localhost:8000`; do not assume another localhost port serves this project.
- 2026-10-13 — Simplified the static demo UI after confirming there are no Django apps, templates, routes, models, or real authentication/session handling in the checked-in workspace. Kept the existing role chooser and local profile flow explicitly demo-only; added four farmer tool links; prioritized retailer listing examples while retaining local purchase-request tools as optional demo content. No live inventory or backend authentication is claimed.
- 2026-10-13 — Added Sell Goods to the farmer dashboard using the existing mock API and browser storage. Verified create/edit/remove, positive-input validation, persistence across page loads, visibility in the retailer's existing listing view, kg-to-quintal purchase matching, and 390px mobile layout without horizontal overflow in Chrome. Listings remain demo-only and are not sent to real retailers; Django/backend files and demo mode were unchanged.
- 2026-10-13 — Rebranded the UI and project documentation to FarmAura, named the scripted soil/farming assistant SOILY, and aligned shared light/dark styles and local SVG artwork to the soil palette. Gemma 4, MCP, backend, and offline support remain unimplemented.

## J. Next Steps

Actionable next steps:

- [ ] Provide and verify the Phase 3 Django/DRF foundation, ORM models, migrations, and NeonDB environment configuration.
- [ ] Implement and test the Phase 4 APIs against the delivered Phase 3 setup using `PHASE4-INTEGRATION-PLAN.md`.
- [ ] Agree and document API request/response contracts before frontend API mode is enabled; preserve the default demo mode.
- [ ] Frontend follow-up: check Safari/mobile-device rendering and review localized copy when translation scope is agreed.
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
