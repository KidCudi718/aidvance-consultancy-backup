# Aidvance Consultancy

Private **backup** marketing and resource site for [Aidvance Consultancy](https://aidvance.xyz). This repository is a parallel build. Do not treat it as a merge source for any other Aidvance project.

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

- Owner-facing pages (home, assessment, contact) in black and white
- Resource index plus five short notes that help before anyone hires
- **AI Opportunity Assessment** as the front door (no prices on the site)
- Contact via `mailto:david.choukroun2@gmail.com`
- Official wordmark in the header, footer, favicon, and Open Graph image (see `public/brand/`)

Preview hosting (Vercel or similar) is enough. Point `aidvance.xyz` at a host only when you decide to.

## Built with

- Next.js App Router and TypeScript
- Custom CSS (no default Tailwind SaaS theme)
- `next/font`: Newsreader + IBM Plex Sans + IBM Plex Mono
