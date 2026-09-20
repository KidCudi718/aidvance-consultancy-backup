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
- Contact via the form on `/contact/` — no inbox address is published on the site

## Contact form delivery

The `/contact/` form posts to a **server action**. The inbox string never appears in the browser, page copy, JSON-LD, footer, or redirects.

1. If `RESEND_API_KEY` is set, the action sends mail through Resend to `CONTACT_INBOX`.
2. If Resend is unset, the action POSTs JSON `{ name, email, message, _subject }` to FormSubmit.co ajax (`https://formsubmit.co/ajax/${CONTACT_INBOX}`) as a zero-config fallback.

`CONTACT_INBOX` is server-only. If unset, the action uses a hardcoded server-only fallback inbox.

**FormSubmit activation:** the first fallback submission sends a one-time activation email to that inbox. Dave must click it once, or later notes will not arrive.

Optional: `CONTACT_FROM` sets the Resend From address (defaults to Resend’s onboarding sender for tests).

Preview hosting (Vercel or similar) is enough. Point `aidvance.xyz` at a host only when you decide to.

## Built with

- Next.js App Router and TypeScript
- Custom CSS (no default Tailwind SaaS theme)
- `next/font`: Newsreader + IBM Plex Sans + IBM Plex Mono
