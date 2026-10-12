# KisanSaathi — Project Memory

Last updated: 2026-10-12

## A. Project Overview

- Project name: KisanSaathi
- Purpose: AI-powered agricultural assistance for Indian farmers, combining crop guidance, calculators, buyer-offer comparisons, government-scheme information, and AI support.
- Intended users:
  - Farmers seeking crop guidance, irrigation and fertilizer estimates, market comparisons, and scheme awareness.
  - Sellers/buyers who want to post or view purchase requirements and available crop listings.
- Current repo reality: the repository currently contains project documentation, but no application source code or working frontend/backend implementation has been checked in.

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

- Verified in repository: documentation only.
- No actual frontend screens, dashboard logic, backend app, database config, authentication code, or AI integration are present in the checked-in files.
- No feature should be considered implemented unless it exists in code and is verifiable from the repo.

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

1. Frontend foundation and welcome page — Not Started
2. Frontend dashboards, mock data, and demo mode — Not Started
3. Django backend and database connection — Not Started
4. Farming APIs and business logic — Not Started
5. Authentication and role-based access — Not Started
6. Frontend/backend integration — Not Started
7. Gemma 4 and MCP integration — Not Started
8. Offline support, testing, and deployment — Not Started

Status note:
- The repository contains only planning/docs and no implementation files.
- No phase can be marked complete or in progress without code inspection and verification.

## G. Team Responsibilities

- Frontend developer — Titus Dsouza
  - Welcome page, dashboards, responsive design, mock data, frontend interactions, API adapter, and frontend/backend integration
- Backend developer — Backend teammate
  - Django, NeonDB, REST APIs, authentication, permissions, Gemma 4, and MCP integration
- Shared responsibility
  - Integration testing, offline support, deployment, documentation, and final verification

## H. Current Project Status

### Current phase
- Current documented phase: Phase 1 — Frontend Foundation and Welcome Page
- Implemented status: Not Started in the repository as checked in today

### Completed features
- None verified in code.

### Features currently being developed
- None verified in code.

### Features not yet started
- All planned features remain unimplemented in this repo snapshot.

### Existing file and folder structure
Repository root currently contains only project documentation, not an application scaffold:

- README.md
- Design.md
- Architect.md
- Phase.md
- No frontend/ folder
- No backend/ folder
- No Django project files
- No JS/CSS app files
- No package, requirements, settings, or migration files

Important naming note:
- The repo file is named Architect.md, while the docs reference Architecture.md.
- This may be a naming discrepancy or documentation shorthand, but as currently checked in, the repository does not include a true Architecture.md file in the root.

### Confirmed working commands
- No application commands verified.
- No run/build/test commands are present in the repo snapshot.
- No frontend or backend server has been started or validated.

### Known bugs and blockers
- No implementation code exists yet, so there are no runtime bugs confirmed.
- Active blocker: project is still at documentation/planning stage; the app itself has not been scaffolded.
- Additional blocker: no database, authentication configuration, or MCP service exists in the repo.

### Can the frontend run without the backend?
- The documented design says yes in demo mode.
- In the actual repo snapshot, no frontend app exists, so this cannot be confirmed.
- The implementation requirement is still pending.

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

## J. Next Steps

Actionable checklist for the next session:

- [ ] Create the frontend project scaffold (index/login/dashboard pages and shared CSS/JS structure).
- [ ] Add central API adapter (`api.js`) and mock data layer (`mock-api.js`, `demo-data.js`) for demo mode.
- [ ] Build the Welcome page and responsive navigation per Phase 1.
- [ ] Ensure demo mode runs without backend and does not show backend-unavailable errors.
- [ ] Keep all sample data clearly labeled as demo data.
- [ ] Wait to start backend work until the frontend demo flow is in place and validated.

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
- The project documentation is present, but there is no code implementation yet. The team should confirm whether the repo is intentionally in a planning-only state or if the app files are missing from this branch.
- No backend credentials, NeonDB connection, or MCP/Gemma runtime are present. This is still a planned implementation gap.

## Summary

This repository currently reflects a well-defined product plan, architecture, and phase roadmap, but not an implemented application. The immediate next step is Phase 1: create the frontend scaffold and demo-mode welcome page, while keeping mock data and API layering separated from any future production backend code.
