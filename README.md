# Nova Terra — 24h Webcup

Digital platform of the city of **Nova Terra**, built for the **24h Webcup** hackathon.

Citizens sign up, log in, discover municipal services, read announcements, contact the administration
and track their requests. Municipal agents get a dedicated workspace (separate from the citizen area)
fed by the Nova Terra API, and administrators manage content, accounts and access rights.

## Stack

Next.js (App Router) + TypeScript · Tailwind CSS v4 · shadcn/ui · Prisma · NextAuth.js · SQLite (dev) / PostgreSQL (prod)

## Status

✅ Base project implemented for the *Socle* needs — see the checklist below.

## Getting started

```bash
cp .env.example .env          # then fill in the values
npm install
npx prisma migrate dev        # creates prisma/dev.db (SQLite) and runs the seed
npm run dev                   # http://localhost:3000
```

> The default `.env` targets SQLite for local dev. Prisma enums are not supported by
> SQLite, so enum-like fields are stored as strings and validated through `lib/roles.ts`.

### Demo accounts (password: `password123`)

| Account | Role | Landing page |
| --- | --- | --- |
| `citoyen@novaterra.fr` | `CITIZEN` | `/espace` |
| `agent@novaterra.fr` | `AGENT` | `/agents` |
| `admin@novaterra.fr` | `ADMIN` | `/admin` |

## Implemented needs

| Need | Feature | Status |
| --- | --- | --- |
| `D01` | Sign-up / account creation | ✅ |
| `D03` | Login + personal space | ✅ |
| `D04` | Contact the administration + acknowledgement | ✅ |
| `D05` | Municipal services directory | ✅ |
| `D06` | Municipal announcements | ✅ |
| `D07` | Hierarchical home page | ✅ |
| `D08` | Roles: citizen / agent / admin | ✅ |
| `D09` | Differentiated permissions | ✅ |
| `D19` | Agent workspace (Nova Terra API data) | ✅ |
| `F22` | Citizen requests view with statuses | ✅ |

### Thèmes

Dix thèmes d'interface sont disponibles, dont **Mars Civic OS** (la maquette `docs/ui-v1.svg`) et les
deux thèmes d'origine (CRT Phosphor / Paper Terminal). Changez-en depuis l'icône palette de l'en-tête
ou la page `/apparence` ; le choix est mémorisé sur l'appareil. Voir
[`docs/PROJECT.md`](docs/PROJECT.md) § 8.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm run start` | Production build / start |
| `npm run db:migrate` | Create/apply Prisma migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:reset` | Reset the database and re-seed |
| `npm run db:studio` | Open Prisma Studio |


## Competition needs

The scope is driven by the needs published by the Webcup API, tracked in
[`docs/TODO_terra_nova.md`](docs/TODO_terra_nova.md). Refresh them whenever a new wave drops:

```fish
# from the repository root
set -x WEBCUP_API_KEY "<your-key>"
python3 scripts/fetch_new_features.py
```

Full workflow, API reference and troubleshooting: [`docs/NEEDS.md`](docs/NEEDS.md).

## Documentation

- [`AGENTS.md`](AGENTS.md) — AI coding agent brief (mission, features, data model, roadmap, demo)
- [`docs/PROJECT.md`](docs/PROJECT.md) — product & architecture overview
- [`docs/NEEDS.md`](docs/NEEDS.md) — needs API + fetch script workflow
- [`docs/README.md`](docs/README.md) — documentation index

## License

[MIT](LICENSE)
