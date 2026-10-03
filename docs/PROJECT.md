# Nova Terra — Project Documentation

Nova Terra is the citizen-services platform of the city of Nova Terra, built for the **24h Webcup**.
It gives the city's inhabitants a single digital identity and a set of online services, gives municipal
agents a dedicated workspace, and gives administrators the tools to manage content and access.

> The AI coding brief lives in [`AGENTS.md`](../AGENTS.md). How competition needs are fetched and
> tracked lives in [`NEEDS.md`](NEEDS.md). The generated checklist is [`TODO_terra_nova.md`](TODO_terra_nova.md).

## 1. Vision

One platform, three experiences:

- **Citizens** — create an account, log in, discover municipal services, read announcements, contact
  the administration and track their requests.
- **Agents** — work in a workspace clearly separated from the citizen area, see platform activity
  supplied by the Nova Terra API, and handle incoming citizen requests.
- **Administrators** — manage services, announcements, accounts and access rights.

## 2. Roles & permissions

| Role | Can reach | Cannot reach |
| --- | --- | --- |
| `CITIZEN` | Public site, personal space (`/espace`), own requests (`/demandes`) | `/agents`, `/admin` |
| `AGENT` | Agent workspace (`/agents`), citizen requests list | `/admin` |
| `ADMIN` | Everything, including `/admin` back-office | — |

Permissions are enforced **server-side**: in `middleware.ts` for navigation *and* again inside every
page and API route. Helpers live in `lib/permissions.ts` (`hasRole`, `hasAnyRole`, `requireRole`).

Each role has a default landing page after login:

| Role | Landing page |
| --- | --- |
| `CITIZEN` | `/espace` |
| `AGENT` | `/agents` |
| `ADMIN` | `/admin` |

## 3. Needs coverage

The scope is driven by the competition needs (see [`NEEDS.md`](NEEDS.md)). Mapping:

| Need | Feature |
| --- | --- |
| `D01` | Sign-up / account creation |
| `D03` | Login + personal space |
| `D04` | Contact the administration + acknowledgement |
| `D05` | Municipal services directory |
| `D06` | Municipal announcements / publications |
| `D07` | Clear, hierarchical home page |
| `D08` | Roles: citizen / agent / admin |
| `D09` | Differentiated permissions |
| `D19` | Agent workspace (Nova Terra API data) |
| `F22` | Citizen requests view with statuses |

## 4. Architecture

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Data:** Prisma ORM — SQLite for local dev, PostgreSQL (Neon/Supabase) in production
- **Auth:** NextAuth.js, Credentials provider (email + password, hashed with `bcrypt`)
- **Backend:** Route Handlers under `app/api/*` and Server Actions where convenient
- **Deployment:** Vercel-ready

Route groups keep the three experiences separate:

- `(public)` — unauthenticated visitor
- `(auth)` — login / register
- `(citizen)` — authenticated citizen space
- `agents` — agent workspace (separate shell)
- `admin` — administration back-office

See the target folder layout in [`AGENTS.md`](../AGENTS.md#-project-structure).

## 5. Route map

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | `D07` hierarchical home page |
| `/services`, `/services/[slug]` | Public | `D05` services directory + detail |
| `/announcements`, `/announcements/[slug]` | Public | `D06` publications + detail |
| `/contact` | Public | `D04` contact form + acknowledgement |
| `/login` | Public | `D03` login |
| `/register` | Public | `D01` sign-up |
| `/espace` | Citizen | `D03` personal space |
| `/demandes` | Citizen | own requests (list, new, detail) |
| `/agents` | Agent | `D19` activity dashboard |
| `/agents/demandes` | Agent | `F22` requests view + “needs action” filter |
| `/admin` | Admin | services, announcements, users |

### API surface

| Endpoint | Access | Purpose |
| --- | --- | --- |
| `/api/auth/[...nextauth]` | Public | NextAuth |
| `/api/services` | Public (read) / Admin (write) | Municipal services |
| `/api/announcements` | Public (read) / Admin (write) | Announcements |
| `/api/contact` | Public (create) | Contact messages |
| `/api/requests` | Citizen (own) | Citizen requests |
| `/api/agent/*` | Agent | Nova Terra API surface consumed by the agent workspace |

## 6. Data model (overview)

Full schema: see [`AGENTS.md`](../AGENTS.md#-prisma-schema) and [`prisma/schema.prisma`](../prisma/schema.prisma).

> **SQLite note:** the schema runs on SQLite for local dev, which does not support Prisma enums, so
> enum-like fields (`role`, `status`, `priority`, `status`) are stored as strings. The allowed values
> and their French labels live in [`lib/roles.ts`](../lib/roles.ts) and are validated server-side.

- `User` — one role (`CITIZEN` / `AGENT` / `ADMIN`), credentials + relations
- `MunicipalService` — `D05` directory entries
- `Announcement` — `D06` publications
- `ContactMessage` — `D04`, carries a unique `reference` for the acknowledgement
- `ServiceRequest` — citizen requests (`D03`), with `status`, `priority`, author and assignee
- `RequestStatusEvent` — status history for the request lifecycle

Request lifecycle:

```
SUBMITTED → IN_REVIEW → IN_PROGRESS → RESOLVED → CLOSED
```

## 7. Security model

- Passwords are hashed (`bcrypt`), never stored or returned in clear.
- The role is attached to the JWT in the `jwt` callback and exposed via the `session` callback.
- Navigation is guarded by `middleware.ts`; every page and API route re-checks the role.
- Ownership is verified for citizen resources (a citizen only sees their own requests).
- Unauthorized users are redirected to their own dashboard, never to a dead end.

## 8. UI / design system

- **Foundation:** Tailwind CSS v4 + shadcn/ui (`components/shadcn/*`); tokens are declared in
  `app/globals.css` through `@theme inline`.
- **Semantic tokens:** `background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`,
  `destructive`, `border`, `input`, `ring` (+ `chart-*`, `sidebar-*`). Components never hard-code
  colours — they use token utilities, so every theme applies everywhere.
- **Typography:** `font-mono` for headings, labels and figures (technical/terminal feel), `font-sans`
  for body copy.
- **Language:** user-facing copy is **French**; code, comments and docs are **English**.

### Themes

Ten user-selectable themes, applied by `next-themes` as a class on `<html>`:

| id | label | scheme |
| --- | --- | --- |
| `dark` | CRT Phosphor — default | dark |
| `light` | Paper Terminal | light |
| `mars-civic` | Mars Civic OS — the `docs/ui-v1.svg` design | dark |
| `bio-dome` | Bio-Dôme | dark |
| `nebula` | Nébuleuse | dark |
| `solar-flare` | Éruption Solaire | dark |
| `glacier` | Glacier | dark |
| `iron-oxide` | Oxyde de Fer | dark |
| `daylight` | Grand Jour | light |
| `void` | Vide Absolu — maximum contrast | dark |

- **Registry:** [`lib/themes.ts`](../lib/themes.ts) — ids, labels, swatches, light/dark scheme.
- **Token blocks:** `app/globals.css` — one class per theme (`.mars-civic`, `.bio-dome`, …).
- **Provider:** `app/layout.tsx` — `attribute="class"`, `themes={THEME_IDS}`, `storageKey="nt-theme"`.
- **Pickers:** the palette icon in the headers (`components/layout/ThemePicker.tsx`) and the gallery
  at `/apparence`.
- **Persistence:** `localStorage["nt-theme"]`; next-themes injects a blocking script so there is no
  flash of the wrong theme.

**Adding a theme:** add a `.<id> { …tokens… }` block in `app/globals.css`, add the entry to `THEMES`
in `lib/themes.ts`, and — if it is dark — add `.<id> *` to the `@custom-variant dark (…)` list at the
top of `globals.css` so `dark:` utilities keep applying.

## 9. Conventions

- French URL segments for citizen routes (`/espace`, `/demandes`) to match the copy.
- Server-side validation for every mutation; never trust the client.
- Seed a fresh database with demo users (one per role), services, announcements and a few requests.
- Short polling (≈5 s) for the agent view — no WebSockets.

## 10. Roadmap

| Phase | Focus |
| --- | --- |
| 1 — Foundation | Next.js + Tailwind, Prisma + SQLite, seed, NextAuth, register/login (`D01`, `D03`) |
| 2 — Public site | Home, services, announcements, contact (`D07`, `D05`, `D06`, `D04`) |
| 3 — Spaces | Citizen requests, agent workspace + requests view, admin (`D03`, `D19`, `F22`) |
| 4 — Polish & demo | Enforce roles everywhere, demo data, end-to-end journey, responsive pass |

## 11. Open questions

- **“Nova Terra API” (`D19`):** until the organisers confirm a dedicated endpoint, the agent workspace
  consumes the app's own read API. It is implemented as `GET /api/agent/activity`, which returns the
  platform statistics plus the latest activity (requests, contact messages, announcements).
