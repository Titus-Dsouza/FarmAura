# Design.md — FarmAura

## 1. Project Overview

**FarmAura** is a farmer-focused website designed to help farmers explore crop guidance, calculate agricultural quantities, compare illustrative buyer offers, and find reliable government-scheme information.

The website also provides a seller interface where buyers can enter crop purchase requirements using demo data for the prototype.

SOILY is available on the farmer and retailer demo workspaces. It uses scripted replies through the existing mock API adapter; no model or backend service is connected.

### Main Goals

- Help farmers understand crop harvesting and decay.
- Calculate irrigation, fertilizer, and manure requirements.
- Compare prices offered by different sellers or buyers.
- Provide information about government schemes and agricultural loans.
- Support voice commands and regional languages.
- Work as reliably as possible with poor internet connectivity.
- Provide a simple, accessible interface for farmers and sellers.

---

## 2. Website Structure

The current static demo has a welcome page, demo workspace selection, farmer and retailer dashboards, and profile/settings. The authentication and server-backed behavior below describe future design goals, not existing features.

The website consists of five main pages or interface areas.

| Page | Name | Purpose |
|---|---|---|
| 1 | Welcome Page | Introduce FarmAura and explain its benefits |
| 2 | Login / Signup | Authenticate users using Neon-backed authentication |
| 3 | Farmer / Seller Selection | Let users enter the correct interface |
| 4 | Farmer Dashboard | Farming tools, crop information, price comparison, schemes and profile settings |
| 5 | Seller Dashboard | Let sellers specify crops they want to purchase using dummy data |

The AI chatbot should remain accessible on all main pages, including the welcome page if practical.

---

## 3. Page 1 — Welcome Page

### Purpose

Introduce the platform in a friendly and trustworthy way before the user signs in.

### Layout

**Header**
- FarmAura logo and name.
- Home, About and Features navigation.
- Language selector.
- Login / Signup button.

**Hero Section**
- Main heading: *Practical support for every growing season.*
- Supporting text explaining how the platform helps farmers make informed decisions.
- Primary CTA: **Get Started**
- Secondary CTA: **Explore Features**
- Agricultural illustration or photograph featuring crops, farmland and a farmer.

**Feature Cards**
1. Harvest & Crop Health
2. Smart Irrigation Calculator
3. Fertilizer & Manure Calculator
4. Buyer Price Comparison
5. Government Schemes & Loans
6. SOILY soil and farming assistant

**Footer**
- About FarmAura.
- Available features.
- Disclaimer about agricultural estimates and information freshness.

### Design Notes

- Keep the hero section visually attractive but lightweight.
- Use a clear call to action.
- Avoid unnecessary animations and large media files.
- Make the layout responsive for mobile phones.

---

## 4. Page 2 — Login / Signup

### Purpose

Allow farmers and sellers to create accounts and securely access their respective dashboards.

### Login Interface

Fields:
- Email address or username.
- Password.
- Show / hide password control.
- Login button.
- Link to create an account.
- Forgot password option.

### Signup Interface

Fields:
- Full name.
- Email address.
- Password.
- Confirm password.
- Account role: Farmer or Seller.
- Accept terms and conditions.

Collect only information needed for the prototype. Additional profile information can be requested later.

### Authentication and Database

- **Database:** Neon PostgreSQL.
- **Authentication:** Backend-managed authentication.
- **Backend:** Django and Django REST Framework.
- **Database access:** Django ORM.
- Store password hashes, never plain-text passwords.
- Validate inputs on the backend.
- Protect authenticated APIs and restrict access according to account roles.
- Use secure session or token handling, appropriate to the chosen authentication implementation.

**Important:** Neon is a PostgreSQL database service, not a complete authentication system by itself. Django will manage user authentication and communicate with Neon through the Django ORM.

### Navigation

After successful authentication:
- Farmer account → Farmer Dashboard.
- Seller account → Seller Dashboard.

Users must not be able to gain seller or farmer permissions simply by changing frontend values.

---

## 5. Page 3 — Farmer / Seller Interface Selection

### Purpose

Provide a clear entry point for users who need to choose their interface.

### Layout

Display two large cards.

**Farmer Card**
- Icon: Leaf or Wheat.
- Title: Farmer.
- Description: Manage crops, calculate farming requirements, compare buyer offers, and explore schemes.
- CTA: Open Farmer Dashboard.

**Seller Card**
- Icon: Store or Handshake.
- Title: Seller / Buyer.
- Description: List the crops you want to purchase and review available dummy listings.
- CTA: Open Seller Dashboard.

### Behaviour

- If the user selected a role during signup, open the corresponding dashboard by default.
- Allow role selection only when permitted by the account's role and authorization rules.
- Use role-based routing to protect each dashboard.

---

## 6. Page 4 — Farmer Dashboard

### Purpose

Provide farmers with a single place to access essential farming tools and information.

### Dashboard Layout

**Top Navigation**
- FarmAura logo.
- Dashboard.
- Crop Tools.
- Buyer Offers.
- Schemes & Loans.
- Profile and Settings.
- Language selector.

**Welcome Section**

Display a greeting, quick actions, and helpful information.

Example:

"Welcome back! What would you like to do for your farm today?"

**Quick Action Cards**
- Check Harvest & Crop Decay.
- Calculate Irrigation.
- Calculate Fertilizer & Manure.
- Compare Buyer Offers.
- Explore Government Schemes.

**Information Cards**
- Saved crop information.
- Recent calculations.
- Saved buyer offers.
- Recently viewed schemes.

Use clearly labelled demo data whenever real integrations are not available.

### 6.1 Harvest / Crop Decay

**Purpose:** Help farmers understand crop maturity, harvesting readiness, and possible causes of crop deterioration.

**Inputs**
- Crop type.
- Planting or sowing date.
- Crop stage.
- Visible symptoms or observations.
- Optional photo, if supported.

**Outputs**
- General crop-stage guidance.
- Suggested harvesting checks.
- Possible causes of deterioration.
- Recommended next steps.
- Warning signs that require local agricultural expert advice.

The AI must not claim to diagnose a crop disease with certainty from insufficient information.

### 6.2 Irrigation Calculator

**Purpose:** Estimate irrigation requirements using the farmer's field and crop information.

**Inputs**
- Crop type.
- Field area.
- Soil type.
- Growth stage.
- Optional rainfall or soil-moisture information.

**Outputs**
- Estimated water requirement.
- Suggested irrigation interval.
- Calculation assumptions.
- Unit conversions where appropriate.

The result must be presented as an estimate rather than a guaranteed prescription.

### 6.3 Fertilizer & Manure Calculator

**Purpose:** Estimate the amount of fertilizer or manure needed for a field.

**Inputs**
- Crop type.
- Field area.
- Soil-test results, if available.
- Selected fertilizer or manure.
- Recommended application rate, when known.

**Outputs**
- Estimated quantity.
- Quantity per unit of land.
- Calculation breakdown.
- Important application precautions.

Recommendations should prioritize verified agricultural guidance and soil-test information. Do not invent precise application rates when required information is missing.

### 6.4 Buyer / Seller Price Comparison

**Purpose:** Help farmers compare the prices offered by multiple buyers for their crops.

**Inputs**
- Crop type.
- Quantity available.
- Quality or grade, if applicable.
- Location, if needed for the demo.

**Example Dummy Data**

| Buyer | Crop | Offered Price |
|---|---|---:|
| Buyer A | Wheat | ₹2,400/quintal |
| Buyer B | Wheat | ₹2,550/quintal |
| Buyer C | Wheat | ₹2,475/quintal |

These values are illustrative demo data, not live market prices or verified offers.

**Features**
- Display buyer offers side by side.
- Sort offers by price.
- Highlight the highest listed offer.
- Show quantity requirements and offer conditions when available.
- Let farmers save offers for later comparison.

**Important:** The highest price is not automatically the best deal. Transport costs, quality requirements, payment terms and quantity limits may affect the final value.

Clearly label every offer as dummy data until connected to verified real listings.

### 6.5 Government Schemes & Agricultural Loans

**Purpose:** Help farmers discover potentially relevant agricultural benefits and financing options.

**Features**
- Scheme and loan information cards.
- Eligibility criteria.
- Required documents.
- Application steps.
- Official source link.
- Last-verified date, where available.

Use verified government sources when populating real scheme information.

Do not guarantee eligibility, loan approval, or financial benefits.

### 6.6 Profile and Settings

Accessible from the profile icon in the top navigation.

**Profile**
- Name.
- Contact details.
- Account role.
- Preferred language.
- Optional farming information such as district and crops grown.

**Voice Commands**
- Microphone button.
- Speech recognition status.
- Clear indication when microphone permission is needed.
- Spoken or displayed confirmation of the understood command.

Example commands:
- "Open irrigation calculator."
- "Compare wheat buyer offers."
- "Show government schemes."

Voice input should be optional, with normal buttons and text input always available.

**Language Selection**
- English.
- Marathi.
- Additional languages can be added later.

Translate navigation, buttons, guidance and common error messages. AI responses should follow the selected language when supported.

**Light / Dark Mode**
- Light mode for a bright, clean interface.
- Dark mode for comfortable viewing in low-light environments.
- Maintain readable contrast and visible focus states.
- Save the user's preference when practical.

---

## 7. Page 5 — Seller Dashboard

### Purpose

Allow sellers or buyers to enter what crops they want to purchase and view matching dummy farmer listings.

### Design

Use a simple form-based interface with a listing section underneath.

### Purchase Request Form

Fields:
- Crop name.
- Quantity required.
- Maximum offered price per unit.
- Preferred location.
- Crop quality or grade, if required.
- Additional requirements.

**Primary CTA:** Publish Purchase Request.

### Dummy Data Listings

After submitting the form, show example farmer listings that match the selected crop and relevant conditions.

Example:

| Farmer Listing | Crop | Available Quantity | Asking Price |
|---|---|---:|---:|
| Listing A | Wheat | 20 quintals | ₹2,450/quintal |
| Listing B | Wheat | 35 quintals | ₹2,500/quintal |
| Listing C | Wheat | 15 quintals | ₹2,420/quintal |

All names, prices and quantities are illustrative prototype data.

### Features

- Create a purchase request.
- View matching sample listings.
- Filter by crop and quantity.
- Compare asking prices.
- View listing details.
- Show an empty state when there are no matches.

For the initial prototype, no real transactions, payments, or binding purchase agreements are required.

The seller interface should be visually consistent with the farmer dashboard while making the purchase-request workflow distinct.

---

## 8. SOILY Soil and Farming Assistant

### Purpose

**Role:** FarmAura's intelligent soil and farming assistant—friendly, practical, patient, and farmer-focused. The current frontend includes scripted demo replies only; no AI model, soil test, live weather, or verified scheme service is connected.

### Interface

- Floating chatbot button at the bottom-right corner.
- Prominent SOILY name and a small seed-inspired visual mark.
- Opens into a compact chat panel.
- Expands on desktop when more space is available.
- Fits the mobile viewport without obscuring the dashboard's key controls.
- Text input and send button.
- Suggested question chips.

### Example Questions

- "How can I check my soil health?"
- "What information do you need to discuss crop symptoms?"
- "How much water might my crop need?"
- "Explain this fertilizer calculation."
- "How do I compare these buyer offers?"
- "Which government schemes should I check?"
- "Explain crop harvesting in Marathi."

### AI Behaviour

- Communicate in simple language with concise, actionable guidance.
- Help with soil health, crop care, irrigation, nutrient management, calculations, harvest preparation, and agricultural schemes.
- Ask for missing context such as crop, growth stage, location, soil type, and soil-test results.
- Never invent soil-test results, diagnoses, live prices, weather, scheme eligibility, or guaranteed outcomes.
- State clearly when information is unavailable; recommend a soil test or local agricultural expert for field-specific or serious concerns.
- A future AI integration may use a configured inference runtime and verified, approved application tools. Gemma 4 and MCP are not connected in the current app.

### AI Architecture

The chatbot can call backend tools through a controlled service layer. If MCP is used, the MCP server can expose approved tools such as:

- `calculate_irrigation`
- `calculate_fertilizer`
- `get_crop_guidance`
- `compare_buyer_offers`
- `search_government_schemes`

The model can use tool results to produce explanations. MCP is an optional integration layer, not the model itself.

**Availability note:** SOILY currently returns scripted demo content through the existing demo API adapter. The chatbot UI must not be described as a live AI assistant until an inference service is configured and tested.

---

## 9. Visual Design System

### Colour Palette

Use an agriculture-inspired palette that feels natural, modern and trustworthy.

| Token | Colour | Purpose |
|---|---|---|
| Deep soil brown | `#3E2723` | Selected headings, navigation, and chat header |
| Rich earth brown | `#5D4037` | Secondary text accents and supporting details |
| Warm clay | `#A66A4C` | Restrained earth-toned detail |
| Terracotta accent | `#C66B45` | Focus rings and small highlights |
| Organic olive | `#697D45` | Primary actions and selected navigation |
| Fresh leaf green | `#7BA05B` | Positive states and restrained accents |
| Pale sand | `#F5EBDD` | Main dashboard background |
| Warm cream | `#FFFCF6` | Welcome background and cards |
| Soft beige | `#E8D9C5` | Subtle borders and dividers |
| Main text | `#29251F` | Primary light-mode text |
| Secondary text | `#71675D` | Supporting copy |
| White | `#FFFFFF` | Form and control surfaces |

The CSS custom properties are defined in the shared `frontend/css/style.css`. Dark mode retains warm soil-brown surfaces and accessible light text.

Check colour contrast in both themes. Do not communicate status through colour alone.

### Typography

- Use a highly readable sans-serif font such as Inter or a system font.
- Use a font with appropriate Devanagari support for Marathi.
- Use clear heading levels and comfortable line spacing.
- Keep form labels visible even after users start typing.
- Avoid small text for important instructions.

### Components

Create reusable styles for:
- Buttons.
- Navigation bars.
- Cards.
- Input fields.
- Dropdowns.
- Tabs.
- Status labels.
- Tables.
- Dialogs.
- Toast notifications.
- Chatbot messages.
- Loading indicators.
- Empty states.

### Icons

Use familiar, consistent icons for:
- Crops and leaves.
- Water and irrigation.
- Fertilizer and soil.
- Buyers and sellers.
- Government schemes.
- Voice commands.
- Language.
- Settings.
- Chatbot.

Icons must have text labels where their meaning might not be obvious.

---

## 10. Responsive Design

### Mobile

- Single-column layout where appropriate.
- Large touch targets.
- Compact navigation or a mobile menu.
- Easy-to-use calculator forms.
- Tables converted into stacked offer cards where necessary.
- Chatbot adapted to the screen size.

### Tablet

- Two-column card layouts.
- Wider forms.
- Side-by-side calculator inputs and results where practical.

### Desktop

- Sidebar or full navigation bar.
- Three-column card layouts when space allows.
- Larger comparison tables.
- Dashboard content centered within a readable maximum width.

The website must remain usable at narrow screen widths without horizontal overflow.

---

## 11. Offline and Low-Connectivity Design

Because rural connectivity can be unreliable, the interface should degrade gracefully when the network is unavailable.

### Offline Features

- Cache the app shell and essential static resources.
- Store selected crop guides locally.
- Keep basic calculators available without network access.
- Show previously loaded data with its timestamp.
- Indicate when the user is offline.
- Queue eligible non-critical changes for later synchronization.

### Data Freshness

Every time-sensitive data card should distinguish between:
- Fresh online information.
- Cached information.
- Demo data.
- Unavailable information.

Never present cached data as current live information.

Buyer offers, government information and other changing records must be refreshed from a reliable source before being described as current.

---

## 12. Accessibility and Usability

- Use semantic HTML.
- Support keyboard navigation.
- Provide visible focus indicators.
- Include labels for every form input.
- Use readable text sizes.
- Provide text alternatives for meaningful images.
- Keep controls easy to tap.
- Support screen readers.
- Provide text alternatives to voice commands.
- Show understandable validation and error messages.
- Confirm destructive actions before proceeding.

---

## 13. Technical Design Boundaries

### Frontend
- HTML5.
- CSS3.
- JavaScript.
- Responsive design.
- Progressive Web App capabilities and Service Worker caching.

### Backend
- Python.
- Django.
- Django REST Framework.

### Database
- Neon PostgreSQL.
- Django ORM for database operations.

### AI
- Gemma 4 through a suitable inference runtime.
- Optional MCP server for approved tools.
- Grounded responses based on application data and trusted agricultural references.

### Prototype Data

Use clearly labelled dummy data for:
- Buyer offers.
- Farmer crop listings.
- Seller purchase requests.
- Example crop scenarios.

Do not represent dummy data as live agricultural or financial information.

---

## 14. Overall User Flow

### Farmer Flow

Welcome Page → Login / Signup → Farmer Dashboard → Select a Farming Tool → Enter Information → View Results → Ask AI for Clarification.

### Seller Flow

Welcome Page → Login / Signup → Seller Dashboard → Enter Purchase Requirements → Publish Request → View Matching Dummy Listings.

### Settings Flow

Any Main Page → Profile / Settings → Update Language, Voice Preferences or Theme → Return to Current Page.

### Chatbot Flow

Any Main Page → Open Chatbot → Ask a Question → AI Uses Available Information or Approved Tools → Display Explanation and Sources Where Available.

---

## 15. Design Priorities for the MVP

Build in the following order:

1. Welcome page and responsive navigation.
2. Login/signup using Django authentication and Neon PostgreSQL.
3. Farmer and seller role-based dashboards.
4. Harvest guidance and basic irrigation/fertilizer calculators.
5. Seller purchase form and dummy listing comparison.
6. SOILY assistant demo; future AI integration only after a runtime is configured and tested.
7. Profile, language selection, voice commands and theme toggle.
8. Offline caching and saved crop guides.
9. Verified government-scheme information and data freshness indicators.
10. Accessibility, error states and mobile testing.

The first version should focus on a polished, functional demonstration rather than attempting to integrate every real-world agricultural data source immediately.

---

## 16. Final Design Principle

**FarmAura should help farmers make informed decisions, not overwhelm them with technology.**

Every page should answer three questions:

1. What can I do here?
2. What information do I need to provide?
3. What should I do with the result?

Prioritize trust, simplicity, regional accessibility, reliable calculations and transparent data over unnecessary visual effects.
