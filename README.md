# Aidvance Consultancy

Private **backup** marketing site for [Aidvance Consultancy](https://aidvance.xyz). This repository is a parallel build. Do not treat it as a merge source for any other Aidvance project.

Intended public hostname: **aidvance.xyz**. DNS is the owner’s choice later. This repo does not configure DNS.

## Local run

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
npm run lint
```

## What this is

A production-ready Next.js (App Router, TypeScript) site:

- Homepage journey from the signed-off handoff (picker, live verdict, assessment, library)
- Six library guides at canonical `/library/.../` routes
- Assessment and unnamed human contact pages
- Official wordmark only (`public/brand/`)
- Black and white ledger shell
- Contact via `mailto:hello@aidvance.xyz` (placeholder)

Preview hosting (Vercel or similar) is enough. Point `aidvance.xyz` at a host only when you decide to.

## Built with

- Next.js App Router and TypeScript
- Custom CSS (no default Tailwind SaaS theme)
- `next/font`: Newsreader + IBM Plex Sans + IBM Plex Mono
