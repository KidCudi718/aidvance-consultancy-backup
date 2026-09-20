export type Guide = {
  slug: string;
  title: string;
  eyebrow: string;
  crumb: string;
  dek: string;
  meta: string;
  minutes: number;
  published: string;
  updated: string;
};

export const guides: Guide[] = [
  {
    slug: "ai-without-spending-a-dollar",
    title: "Your first hour with AI, and not a dollar spent",
    eyebrow: "Getting started",
    crumb: "Getting started",
    dek: "Before you buy anything: the one job to hand it, how to tell in twenty minutes whether it is any good at that job, and the three things that will make it useless.",
    meta: "Do it today · 9 min",
    minutes: 9,
    published: "2026-09-01",
    updated: "2026-09-01",
  },
  {
    slug: "stop-answering-the-same-questions",
    title: "Stop answering the same five questions",
    eyebrow: "Customer questions",
    crumb: "Customer questions",
    dek: "Every small business answers the same handful of questions forever. Here is how to find yours, answer each one properly once, and put those answers where they work while you sleep.",
    meta: "A weekend · 11 min",
    minutes: 11,
    published: "2026-09-01",
    updated: "2026-09-01",
  },
  {
    slug: "quotes-and-estimates",
    title: "Quotes and estimates without the evening shift",
    eyebrow: "Quoting & sales",
    crumb: "Quoting & sales",
    dek: "If quoting happens after dinner, you are not slow — you are doing the same assembly job by hand every time. Separate the thinking from the typing, and only the thinking stays yours.",
    meta: "A weekend · 10 min",
    minutes: 10,
    published: "2026-09-01",
    updated: "2026-09-01",
  },
  {
    slug: "ai-for-hiring-and-onboarding",
    title: "Getting it out of your head and onto paper",
    eyebrow: "Your team",
    crumb: "Your team",
    dek: "The job only you can do is usually just a job only you have written down. A practical way to capture how the work really happens — by talking, not typing.",
    meta: "A weekend · 12 min",
    minutes: 12,
    published: "2026-09-01",
    updated: "2026-09-01",
  },
  {
    slug: "what-ai-actually-costs",
    title: "What this actually costs",
    eyebrow: "What it costs",
    crumb: "What it costs",
    dek: "Free, a monthly subscription, or a project with a price tag: what separates the three tiers, which one a small business genuinely needs, and the costs nobody puts on the pricing page.",
    meta: "Do it today · 8 min",
    minutes: 8,
    published: "2026-09-01",
    updated: "2026-09-01",
  },
  {
    slug: "keeping-your-business-data-safe",
    title: "What not to paste into a chatbot",
    eyebrow: "Risk & privacy",
    crumb: "Risk & privacy",
    dek: "A short, unhysterical list: what is fine to put in, what is genuinely not, the setting worth checking on day one, and what to tell your team before they find out the hard way.",
    meta: "Do it today · 7 min",
    minutes: 7,
    published: "2026-09-01",
    updated: "2026-09-01",
  },
];

export const homepageGuideSlugs = [
  "ai-without-spending-a-dollar",
  "what-ai-actually-costs",
  "keeping-your-business-data-safe",
] as const;

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function guidePath(slug: string): string {
  return `/library/${slug}/`;
}

export function homepageGuides(): Guide[] {
  return homepageGuideSlugs.map((slug) => {
    const guide = getGuide(slug);
    if (!guide) {
      throw new Error(`Missing homepage guide: ${slug}`);
    }
    return guide;
  });
}
