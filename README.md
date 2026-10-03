# Nova Terra — 24h Webcup

Digital platform of the city of **Nova Terra**, built for the **24h Webcup** hackathon.

Citizens sign up, log in, discover municipal services, read announcements, contact the administration
and track their requests. Municipal agents get a dedicated workspace (separate from the citizen area)
fed by the Nova Terra API, and administrators manage content, accounts and access rights.

## Stack

Next.js (App Router) + TypeScript · Tailwind CSS · Prisma · NextAuth.js · SQLite (dev) / PostgreSQL (prod)

## Status

🚧 Scaffolding — the repository currently contains the documentation and the needs-fetch tooling.
Application code is added per competition need.

## Getting started

```bash
cp .env.example .env   # then fill in the values
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

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
