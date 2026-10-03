# Terra Nova — Project Documentation

Terra Nova is the digital ecosystem of the first human city on Mars, built for the **24h Webcup**.
It gives every colon one civic identity, routes incidents to the right municipal service, and gives
each service an operational console — with the High Council overseeing the whole colony.

> The agent brief lives in [`AGENTS.md`](../AGENTS.md), the ecosystem spec in
> [`terra_nova_ecosysteme_roles.md`](terra_nova_ecosysteme_roles.md), and the needs workflow in
> [`NEEDS.md`](NEEDS.md).

## 1. Vision

One platform, one civic identity, three families of experience:

- **Citizens** — one dashboard to report incidents, order services, file administrative requests,
  read Council announcements, manage a fictional wallet and follow every request.
- **Services** — security, medical, maintenance, transport, commerce and administration each get a
  console centred on their own queue, with a live feed, a radar and one-click actions.
- **High Council** — colony-wide oversight: incidents, interventions, accounts, services and content.

## 2. Roles

Eight roles, defined in [`lib/roles.ts`](../lib/roles.ts) and attached to the JWT.

| Role | Landing page | Purpose |
| --- | --- | --- |
| `CITIZEN` | `/citizen` | Daily services, reports, orders, démarches |
| `SECURITY` | `/operations/security` | Incidents, interventions, arrest + PV (simulated) |
| `MEDIC` | `/operations/medical` | Emergency triage and care |
| `MAINTENANCE` | `/operations/maintenance` | Air, power, water, cleanliness |
| `DRIVER` | `/operations/transport` | Rover / shuttle rides |
| `MERCHANT` | `/operations/commerce` | Food orders and preparation |
| `ADMIN_AGENT` | `/operations/administration` | Administrative requests |
| `COUNCIL` | `/council` | Oversight, accounts, services, announcements |

Access is enforced **server-side** twice: in `middleware.ts` for navigation and again in every page
and route handler via `lib/permissions.ts` (`requirePageRole`, `requireApiRole`, `hasRole`,
`hasAnyRole`, `requireRole`). A colon can only ever read their own reports and orders.

## 3. The core engine

```
Report (signalement)
  OPEN → ASSIGNED → EN_ROUTE → IN_PROGRESS → RESOLVED → CLOSED
```

- A citizen files a report (`SECURITY` / `MEDICAL` / `MAINTENANCE` / `CLEANLINESS`).
- `REPORT_TYPE_ROLE` routes it to the owning service.
- The service moves it through the lifecycle; each transition writes a `ReportEvent` (audit trail).
- Security can attach a `PoliceCase` (suspect, notes, fine, PV) — simulated.

A second, parallel flow handles **démarches administratives** (`ServiceRequest`, statuses
`SUBMITTED → IN_REVIEW → IN_PROGRESS → RESOLVED → CLOSED`) handled by the administrative agent.

## 4. Architecture

- **Framework:** Next.js (App Router) + TypeScript
- **UI:** Tailwind CSS v4 + shadcn/ui, token-based theming
- **Data:** Prisma — SQLite for local dev, PostgreSQL (Neon/Supabase) in production
- **Auth:** NextAuth.js Credentials provider (bcrypt-hashed passwords), JWT sessions
- **Backend:** Server Actions for mutations (`lib/actions/*`), Route Handlers for reads (`app/api/*`);
  both call the shared `lib/data.ts` / `lib/services.ts`
- **Live updates:** short polling (≈5 s) in the consoles

## 5. Route map

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Landing / hero (D07) |
| `/services`, `/services/[slug]` | Public | Services directory (D05) |
| `/announcements`, `/announcements/[slug]` | Public | Council publications (D06) |
| `/contact` | Public | Contact + acknowledgement (D04) |
| `/login`, `/register` | Public | Auth (D03 / D01) |
| `/citizen` | Citizen | Dashboard |
| `/citizen/report`, `/citizen/reports`, `/citizen/reports/[id]` | Citizen | Signalements |
| `/citizen/orders`, `/citizen/wallet`, `/citizen/map`, `/citizen/notifications` | Citizen | Services & profile |
| `/operations/security`, `/operations/medical`, `/operations/maintenance` | Service (+Council) | Incident consoles + `/[id]` |
| `/operations/transport`, `/operations/commerce` | Driver / Merchant (+Council) | Order queues |
| `/operations/administration`, `/operations/administration/[id]` | Admin agent (+Council) | Démarches |
| `/council`, `/council/users`, `/council/announcements`, `/council/services` | Council | Oversight |
| `/apparence` | Public | Theme gallery |

Legacy routes redirect: `/espace → /citizen`, `/demandes → /citizen/reports`,
`/agents → /operations/administration`, `/admin → /council`.

### API

| Endpoint | Access | Purpose |
| --- | --- | --- |
| `/api/auth/[...nextauth]` | Public | NextAuth |
| `/api/services`, `/api/announcements` | Public read / Council write | Content |
| `/api/contact` | Public | Contact messages |
| `/api/requests` | Citizen (own) / staff (all) | Démarches + incidents feed |
| `/api/agent/activity` | Staff | Activity feed for the consoles |

## 6. Data model

Full schema: [`prisma/schema.prisma`](../prisma/schema.prisma).

| Model | Purpose |
| --- | --- |
| `User` | One role, sector, fictional wallet balance |
| `Report` + `ReportEvent` | Signalements and their audit trail |
| `PoliceCase` | Simulated arrest + PV attached to a security report |
| `Order` | Taxi rides (Hermes) and food orders (Mercator) |
| `ServiceRequest` + `RequestStatusEvent` | Administrative démarches |
| `MunicipalService` | Services directory |
| `Announcement` | Council publications |
| `ContactMessage` | Contact form + reference |
| `Notification`, `WalletTransaction`, `Message` | Notifications, wallet, messaging |

> **SQLite note:** no Prisma enums — enum-like fields are strings validated against
> [`lib/roles.ts`](../lib/roles.ts).

## 7. Security model

- Passwords hashed with bcrypt; never returned.
- Role stored in the JWT (`jwt` callback) and surfaced in the session.
- Navigation guarded by `middleware.ts`; every page/route re-checks the role.
- Ownership enforced (a colon only reads their own reports/orders).
- Unauthorized users are redirected to their own landing page, never a dead end.

## 8. UI / design system

- **Foundation:** Tailwind v4 + shadcn/ui; tokens declared in `app/globals.css` via `@theme inline`.
- **Layout:** reproduced from `docs/ui-v1.svg` — colony status strip, circular mark, `COLONY NOMINAL`
  pill, mono labels, metric tiles, radar card, filter chips and live feed rows
  (`components/colony/*`).
- **Typography:** `font-mono` for headings and figures, `font-sans` for body copy.
- **Copy:** user-facing text is **French**; code, comments and docs are **English**.

### Themes

Ten selectable themes applied by `next-themes` as a class on `<html>`:

| id | label | scheme |
| --- | --- | --- |
| `mars-civic` | **Mars Civic OS — the ui-v1 design (default)** | dark |
| `dark` | CRT Phosphor | dark |
| `light` | Paper Terminal | light |
| `bio-dome` | Bio-Dôme | dark |
| `nebula` | Nébuleuse | dark |
| `solar-flare` | Éruption Solaire | dark |
| `glacier` | Glacier | dark |
| `iron-oxide` | Oxyde de Fer | dark |
| `daylight` | Grand Jour | light |
| `void` | Vide Absolu | dark |

- Registry: [`lib/themes.ts`](../lib/themes.ts); token blocks: one class per theme in `app/globals.css`.
- Provider: `app/layout.tsx` (`attribute="class"`, `themes={THEME_IDS}`, `storageKey="nt-theme"`).
- Pickers: palette icon in the headers + the gallery at `/apparence`.

**Adding a theme:** add a `.<id> { …tokens… }` block in `globals.css`, register it in `THEMES`
(`lib/themes.ts`), and — if dark — add `.<id> *` to the `@custom-variant dark (…)` list.

## 9. Conventions

- French URL segments and copy for user-facing routes.
- Server-side validation on every mutation (Zod in `lib/validation.ts`).
- Seed a fresh database with one account per role and believable colony data.
- Simulate everything risky: payments, GPS, medical data, arrests and PV are fictional.

## 10. Roadmap

| Phase | Focus |
| --- | --- |
| 1 — Foundation | Next.js, Prisma, seed, NextAuth, roles, redirects |
| 2 — Common UI | Shells, status strip, tiles, radar, notifications |
| 3 — Signalements | Citizen creation, routing, statuses, assignment, API guards |
| 4 — Service consoles | Security (live feed, radar, intervention, PV), medical, maintenance |
| 5 — Other services | Transport, commerce, administration |
| 6 — Council & polish | Oversight, roles, announcements, responsive, demo script |

## 11. Open questions

- **“Nova Terra API” (`D19`)**: still tracked as the platform's own read API (`/api/agent/activity`).
