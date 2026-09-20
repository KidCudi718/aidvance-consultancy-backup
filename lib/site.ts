export const site = {
  name: "Aidvance Consultancy",
  shortName: "Aidvance",
  domain: "aidvance.xyz",
  url: "https://aidvance.xyz",
  email: "david.choukroun2@gmail.com",
  locale: "en_US",
  description:
    "For small-business owners who need to know which AI tools to skip — and how to get hours back each week. A short call, a written go / no-go plan, no pressure.",
  offer: {
    name: "AI Opportunity Assessment",
    duration: "A short call, a look at how the work actually runs, and a written go / no-go plan",
  },
  person: {
    name: "David Choukroun",
    role: "Principal",
    line: "You write to David. He reads the mail. There is no sales floor.",
  },
} as const;

export const assessmentMailto = (extraBody = ""): string => {
  const subject = "AI Opportunity Assessment";
  const body = [
    "Hello David,",
    "",
    "I would like to request an AI Opportunity Assessment.",
    "",
    "What the business does:",
    "",
    "Work that feels slow, messy, or expensive:",
    "",
    "Software I already pay for (including tools nobody opens):",
    "",
    "Anything we should not look at:",
    "",
    extraBody,
  ]
    .filter((line, index, all) => !(line === "" && all[index - 1] === ""))
    .join("\n");

  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const talkMailto = (extraBody = ""): string => {
  const subject = "Talk to us";
  const body = [
    "Hello David,",
    "",
    "I am not ready for an assessment yet. A short note:",
    "",
    extraBody,
  ].join("\n");

  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const nav = [
  { href: "/#method", label: "How it works" },
  { href: "/assessment", label: "Assessment" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
] as const;
