# Phase 4 Farming APIs — Integration Plan

## Status and prerequisite

**Status: blocked; no Phase 4 API code has been implemented.**

The checked-in repository currently contains the Phase 1–2 vanilla JavaScript
frontend only. It has no `backend/` directory, Django project or `manage.py`,
Python dependency manifest, Django REST Framework configuration, models,
migrations, `.env.example`, or NeonDB connection configuration. The local
`.venv` also does not have Django installed. Consequently there is no Phase 3
setup to extend or verify, and none of the endpoints below currently exists.

Do not create replacement Phase 3 configuration or assume the shape of its
models. Before implementation, obtain the Phase 3 Django project, its settings,
URL routing, installed-app list, database configuration, migrations, and model
definitions (at minimum `Crop`, `BuyerOffer`, and `GovernmentScheme`, or their
actual equivalents). Confirm its app names and existing response conventions
first. Keep NeonDB credentials in environment variables; no credentials belong
in this repository.

## Proposed endpoint contracts

All routes use the `/api/v1/` prefix. Responses are JSON. Crop catalogue and
scheme/loan collections use DRF's paginated shape (`count`, `next`, `previous`,
`results`) when pagination is configured in the existing Phase 3 settings.
Crop guidance returns the documented nested crop/guidance object. Offer
comparison returns its documented filter/notice wrapper plus pagination
metadata. Suggested errors use
`{"error":{"code":"...","message":"...","fields":{}}}`; `fields` is omitted
when there are no field-specific validation errors. These are planned
contracts, not deployed behavior.

For field errors, `fields` maps request field names to arrays of messages.
Example `400`:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Request validation failed.",
    "fields": {"field_area_acres": ["Must be greater than zero."]}
  }
}
```

Use `400` for invalid query parameters, request bodies, or malformed JSON;
`404` for a missing crop/resource; `405` for an unsupported HTTP method; and
`500` for an unexpected server error. Do not include stack traces, SQL,
credentials, or other internal details in error responses. Exact DRF error
translation should be implemented consistently with the Phase 3 project's
existing conventions.

### Crop guidance

**`GET /api/v1/crops/`** — no request body. Optional query parameter `search`
filters crop names case-insensitively; trim surrounding whitespace and limit
the value to 100 characters.

Response `200`:

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {"slug": "wheat", "name": "Wheat", "season": "Rabi"}
  ]
}
```

**`GET /api/v1/crops/{slug}/guidance/`** — no request body.

Response `200`:

```json
{
  "crop": {"slug": "wheat", "name": "Wheat"},
  "guidance": [
    {
      "topic": "harvest",
      "content": "Example guidance text",
      "source_name": null,
      "source_url": null,
      "verified_at": null,
      "data_status": "illustrative"
    }
  ]
}
```

The route should query Django ORM crop/guide records. Phase 3 specifies a
`Crop` model but does not list a `CropGuide` model; confirm or add an
appropriate model and migration only after inspecting the delivered project.
Any unverified guide content must be marked `illustrative`; do not imply
expert diagnosis or verified agronomic advice.

Validation and errors:

- `search` is optional; reject a value longer than 100 characters with `400`
  and a `search` field error.
- An unknown or malformed `{slug}` returns `404` with
  `{"error":{"code":"not_found","message":"Crop not found."}}`.
- A known crop with no guidance returns `200` with an empty `guidance` array.
- A list request with no matching crops returns `200` with an empty paginated
  `results` array.

**Data source:** retrieved from persistent Django ORM crop and guidance
records. A static guide catalogue could be packaged separately if offline
guidance is later required, but this API's managed guidance is database-backed.

### Irrigation calculator

**`POST /api/v1/calculators/irrigation/`**

Request:

```json
{
  "crop": "wheat",
  "field_area_acres": 2,
  "water_depth_mm": 10,
  "soil_type": "loamy",
  "growth_stage": "vegetative"
}
```

`crop` is optional context; `soil_type` and `growth_stage` are optional
context. `field_area_acres` and `water_depth_mm` are required positive decimal
numbers. Accept `0.01`–`10000` acres and `0.1`–`500` mm, matching the current
frontend's stated bounds. Reject non-finite values and values with more than
two decimal places. The
deterministic calculation is `area × depth × 4046.8564224` litres; it reports
an arithmetic volume, not a crop-specific irrigation prescription.

Response `200`:

```json
{
  "water_volume_liters": 80937.13,
  "water_volume_cubic_meters": 80.94,
  "inputs": {
    "field_area_acres": 2,
    "water_depth_mm": 10,
    "crop": "wheat",
    "soil_type": "loamy",
    "growth_stage": "vegetative"
  },
  "assumptions": [
    "1 mm of water over 1 acre is approximately 4046.8564224 litres.",
    "This is a unit conversion, not an agronomic recommendation."
  ],
  "data_status": "calculated_from_user_inputs"
}
```

Validation and errors:

- Missing, malformed, non-finite, zero/negative, out-of-range, or
  over-precision numeric values return `400` with field-specific errors.
- Malformed JSON returns `400` with code `invalid_request`.
- Unsupported methods return `405`.
- No crop record lookup is needed for the optional `crop` context; it must not
  make the calculation depend on the database.

**Data source:** calculated from request values only; no database read or
write is required.

### Fertilizer and manure calculator

**`POST /api/v1/calculators/fertilizer/`**

Request:

```json
{
  "crop": "wheat",
  "field_area_acres": 2,
  "application_rate_kg_per_acre": 50,
  "material": "fertilizer",
  "rate_source": "soil_test"
}
```

`field_area_acres` and `application_rate_kg_per_acre` are required positive
decimal numbers supplied by the caller. Accept `0.01`–`10000` acres and
`0.01`–`100000` kg/acre, matching the current frontend's stated bounds.
Reject non-finite values and values with more than two decimal places. `crop`
is optional context and does not trigger a database lookup. `material` is
required and limited to `fertilizer`, `manure`, or `other`; `rate_source` is
required and limited to `soil_test`, `agricultural_expert`, or
`other_trusted_guidance`. The API multiplies the supplied area and rate; it
must not select or invent an agronomic rate.

Response `200`:

```json
{
  "quantity_kg": 100,
  "quantity_tonnes": 0.1,
  "inputs": {
    "field_area_acres": 2,
    "application_rate_kg_per_acre": 50,
    "crop": "wheat",
    "material": "fertilizer",
    "rate_source": "soil_test"
  },
  "assumptions": [
    "Quantity is field area multiplied by the user-supplied application rate.",
    "The API does not verify or recommend the application rate."
  ],
  "data_status": "calculated_from_user_inputs"
}
```

Validation and errors:

- Missing, malformed, non-finite, zero/negative, out-of-range, or
  over-precision numeric values return `400` with field-specific errors.
- Unsupported `material` or `rate_source` values return `400` with a field
  error naming the accepted values.
- Malformed JSON returns `400` with code `invalid_request`; unsupported
  methods return `405`.

**Data source:** calculated from request values only; no database read or
write is required. Application rates are caller-provided and are neither
verified nor recommended by the endpoint.

### Buyer-offer comparison

**`GET /api/v1/offers/compare/`** — no request body. Required query parameter
`crop`; optional `quantity_quintals` excludes records with less available
quantity, and optional `district` filters the location. Trim text query
values. `crop` must be non-empty and at most 100 characters; quantity, when
provided, must be a finite decimal from `0.01` through `100000` quintals;
`district`, when provided, must be at most 80 characters.

Response `200`:

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "filters": {
    "crop": "Wheat",
    "quantity_quintals": 10,
    "district": "Nashik"
  },
  "results": [
    {
      "buyer_label": "Illustrative buyer A",
      "crop": "Wheat",
      "price": "2500.00",
      "price_unit": "INR/quintal",
      "quantity_quintals": "20.00",
      "district": "Nashik",
      "quality": "Illustrative",
      "payment_terms": "Not verified",
      "transport_terms": "Not verified",
      "data_status": "illustrative"
    }
  ],
  "notice": "Illustrative records only; not live prices, verified offers, or commitments."
}
```

Read `BuyerOffer` records through Django ORM and serialize prices as decimal
strings. Any mock/seed data must be explicitly labelled illustrative. Do not
show it as current market information or a real buyer commitment.

Validation and errors:

- Missing/blank/overlong `crop`, invalid or out-of-range quantity, or
  overlong `district` returns `400` with field-specific errors.
- A valid filter with no matching offers returns `200` with an empty `results`
  array; do not fabricate a fallback offer.
- Unsupported methods return `405`.

**Data source:** retrieved and filtered from persistent Django ORM offer
records. A record is `illustrative` unless it has a traceable source and
verification metadata; only verified records may be described as verified.
The endpoint does not promise real-time market coverage.

### Government schemes and agricultural loans

**`GET /api/v1/schemes/`** — no request body. Optional query parameter
`category` accepts `scheme` or `loan`; absent means both. Trim the value and
reject any other category.

Response `200`:

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "title": "Illustrative programme information",
      "category": "scheme",
      "summary": "Example placeholder; not a verified programme.",
      "eligibility": null,
      "required_documents": [],
      "application_steps": [],
      "official_source_url": null,
      "verified_at": null,
      "data_status": "illustrative"
    }
  ]
}
```

Read `GovernmentScheme` or its actual Phase 3 equivalent through Django ORM.
Include loan information only when represented by a suitable record. Any
unverified sample must be identified as illustrative; do not invent programme
names, current eligibility rules, benefits, approval likelihood, or official
sources. A nullable source and verification timestamp must not be interpreted
as verification.

Validation and errors:

- An unsupported `category` returns `400` with a `category` field error.
- A valid category with no matching records returns `200` with an empty
  paginated `results` array; do not substitute invented programme entries.
- Unsupported methods return `405`.

**Data source:** retrieved from persistent Django ORM scheme/loan records.
Records without verified source and verification metadata remain explicitly
`illustrative`; there is no claim of complete or current programme coverage.

## Validation and error behavior

- Use DRF serializers for POST bodies and validate query parameters with
  DRF serializers or the existing project validation pattern.
- Return the documented JSON error envelope for invalid inputs (`400`),
  missing crops/resources (`404`), unsupported methods (`405`), and unexpected
  server errors (`500`).
- Return paginated JSON for crop, offer, and scheme lists according to the
  existing Phase 3 pagination convention.
- Use ORM queries only for persisted crops/guides, offers, and schemes. The
  calculators are deterministic and do not need database writes.
- Do not add authentication in this phase unless the existing Phase 3
  architecture already requires it. Do not implement assistant, Gemma 4, or
  MCP endpoints as part of this plan.

## Database dependency by feature

| Feature | Can the calculation/behavior work without a database? | Persistent data needed for backend API |
|---|---|---|
| Irrigation calculator | Yes. It uses area and user-supplied water depth only. | None |
| Fertilizer/manure calculator | Yes. It multiplies area by a caller-supplied rate and does not choose a rate. | None |
| Crop guidance | A bundled static/offline guide can work without a database, but is not the managed API source. | Crop catalogue and guidance records for the proposed ORM-backed API |
| Crop offer comparison | Comparison logic can compare an explicitly supplied in-memory list, but that is not a persistent/shared offer service. | Buyer offers with price/unit, quantity, crop, terms, location, data status, and source/verification metadata |
| Schemes and loans | A UI can render an empty state without a database; it must not invent content. | Scheme/loan records with category, source, verification status/date, and only verified facts where asserted |

The existing frontend's demo calculators already run locally. This plan does
not change or connect them. No demo offer or placeholder scheme is promoted to
live data by the proposed API.

## Phase 3 handoff prerequisites

Before implementation, the backend teammate should provide or confirm:

- [ ] The actual Django project and `manage.py`, with project settings and root
  URL configuration.
- [ ] The installed-app list and app ownership/naming for crops, calculators,
  marketplace, and schemes; use existing apps rather than scaffolding another
  project.
- [ ] Python dependency/lock manifest and the supported Python version,
  including Django and Django REST Framework versions.
- [ ] Existing ORM model definitions and migration history for `Crop`,
  `BuyerOffer`, and `GovernmentScheme` (or their actual equivalents).
- [ ] A crop-guidance persistence decision: Phase 3's task model list does not
  include `CropGuide`, although `Architect.md` proposes it. Confirm whether a
  guide model already exists or should be added in a Phase 4 migration.
- [ ] A scheme-versus-loan representation in the existing model (category or
  equivalent), plus source URL, verification timestamp/status, and a clear
  way to mark illustrative records.
- [ ] Offer fields and units for crop, buyer label, price, quantity, location,
  quality/grade, payment terms, transport terms, status, and data
  source/verification. Confirm that no value will be represented as live
  without an appropriate source.
- [ ] NeonDB PostgreSQL environment-variable names and a safe development
  connection method, supplied outside source control; do not share or commit
  credential values.
- [ ] Confirmation that existing migrations apply and the configured database
  is reachable, plus the current health endpoint and API error/pagination
  conventions.
- [ ] Existing backend test runner and baseline test command/results.

## Backend integration checklist

After the prerequisites are available:

1. Inspect the supplied settings, URL configuration, apps, ORM models,
   migrations, and tests. Do not create another Django project or assume model
   fields.
2. Confirm the contracts in this document with the backend owner and reconcile
   them with the actual models and API conventions before coding.
3. Add only necessary model changes/migrations for crop guidance,
   scheme/loan category, and data-source/verification labels.
4. Implement versioned DRF routes, serializers, ORM queries, stateless
   calculator services, consistent errors, and pagination.
5. Add tests for each documented success and error case, calculator arithmetic
   and rounding, ORM filters, empty results, unknown crops, pagination, and
   illustrative-versus-verified labels.
6. Run project checks, migrations, and the backend test suite against the
   configured development database. Record actual command output; do not claim
   completion if migrations/tests fail.
7. Keep frontend demo mode enabled and the mock adapter intact. Treat
   frontend API integration as a later, separately verified phase.

## Migration and test commands

Once the existing Phase 3 Django project is available, run these from its
backend project directory:

```sh
python manage.py check
python manage.py makemigrations
python manage.py migrate
python manage.py test
```

These commands have **not** been run successfully in this repository:
`manage.py` is absent and Django is not installed in the local `.venv`.
Configure the existing Phase 3 database through environment variables before
running migrations; do not add credentials to source control.
