# Terra Nova — 24h Webcup

Digital ecosystem of **Terra Nova**, the first human city on Mars.

Citizens have one civic identity and can report incidents, order services (rover, meals), file
administrative requests, read Council announcements and follow everything from a single dashboard.
Each municipal service — security, medical, maintenance, transport, commerce, administration — gets a
dedicated operations console fed by the same **signalement → intervention → closure** engine, and the
High Council pilots the whole colony.

## Stack

Next.js (App Router) + TypeScript · Tailwind CSS v4 · shadcn/ui · Prisma · NextAuth.js ·
SQLite (dev) / PostgreSQL (prod)

## Getting started

```bash
cp .env.example .env          # then fill in the values
npm install
npx prisma migrate dev        # creates prisma/dev.db (SQLite)
npm run db:seed               # Terra Nova demo dataset
npm run dev                   # http://localhost:3000
```

```bash
npm run db:reset              # wipe, re-migrate and re-seed (recommended after schema changes)
```

> The default `.env` targets SQLite for local dev. SQLite has no Prisma enums, so enum-like fields
> (`role`, `status`, `priority`, …) are stored as strings and validated through `lib/roles.ts`.

## Demo accounts

Password for every account: `password123`.

| Account | Role | Landing page |
| --- | --- | --- |
| `citoyen@terranova.fr` | Citizen (Amina Okafor) | `/citizen` |
| `securite@terranova.fr` | Security (Sana Rhee) | `/operations/security` |
| `medical@terranova.fr` | Medical (Dr Ilyas Voss) | `/operations/medical` |
| `maintenance@terranova.fr` | Maintenance (Mateo Silva) | `/operations/maintenance` |
| `transport@terranova.fr` | Driver (Nadia Petrov) | `/operations/transport` |
| `commerce@terranova.fr` | Merchant (Yuki Tanaka) | `/operations/commerce` |
| `administration@terranova.fr` | Administrative agent (Claire Fontaine) | `/operations/administration` |
| `conseil@terranova.fr` | High Council (Elias Marr) | `/council` |

## The core engine

1. A citizen files a **signalement** (security, medical, maintenance or cleanliness) from `/citizen/report`.
2. The report is routed to the owning service and appears **live** in its console.
3. The service takes charge, sets `EN_ROUTE` / `IN_PROGRESS` / `RESOLVED` / `CLOSED` and logs notes.
4. Security can additionally open a simulated **arrest + PV** (police case).
5. The citizen sees every transition in their tracking view.

Best demo path: citizen reports an intrusion → it appears in **Ares Security Command** → the officer
takes charge, sets the status and files a PV.

## Competition needs

The Webcup needs remain demonstrable through the ecosystem:

| Need | Where |
| --- | --- |
| `D01` | `/register` — civic identity creation |
| `D03` | `/login` + `/citizen` personal dashboard |
| `D04` | `/contact` — form + reference acknowledgement |
| `D05` | `/services` — services directory |
| `D06` | `/announcements` — Council publications |
| `D07` | `/` — hierarchical landing page |
| `D08` | 8 roles in `lib/roles.ts` + session |
| `D09` | `middleware.ts` + server-side guards |
| `D19` | `/operations/*` — dedicated service consoles |
| `F22` | Incident/request lists with statuses and “needs action” filters |

Refresh the need list whenever a wave drops — see [`docs/NEEDS.md`](docs/NEEDS.md).

## Themes

Ten selectable themes, including **Mars Civic OS** (the `docs/ui-v1.svg` design, now the default).
Switch from the palette icon in any header or from `/apparence`. See
[`docs/PROJECT.md`](docs/PROJECT.md) § 8.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm run start` | Production build / start |
| `npm run db:migrate` | Create/apply Prisma migrations |
| `npm run db:seed` | Seed the Terra Nova dataset |
| `npm run db:reset` | Reset the database and re-seed |
| `npm run db:studio` | Open Prisma Studio |

## Documentation

- [`AGENTS.md`](AGENTS.md) — AI coding agent brief
- [`docs/PROJECT.md`](docs/PROJECT.md) — product & architecture overview
- [`docs/terra_nova_ecosysteme_roles.md`](docs/terra_nova_ecosysteme_roles.md) — the ecosystem spec
- [`docs/NEEDS.md`](docs/NEEDS.md) — needs API + fetch script workflow
- [`docs/README.md`](docs/README.md) — documentation index

## License

[MIT](LICENSE)
