export const site = {
  name: "Aidvance Consultancy",
  shortName: "Aidvance",
  domain: "aidvance.xyz",
  url: "https://aidvance.xyz",
  email: "david.choukroun2@gmail.com",
  locale: "en_US",
  description:
    "Independent AI consultancy for small and mid-size operators. A fixed-fee Opportunity Assessment before anyone sells you a stack.",
  offer: {
    name: "AI Opportunity Assessment",
    feeUsd: 999,
    feeLabel: "$999",
    duration: "One working session plus a written brief",
  },
} as const;

export const assessmentMailto = (extraBody = ""): string => {
  const subject = "AI Opportunity Assessment — $999";
  const body = [
    "Hello Aidvance,",
    "",
    "I would like to request the $999 AI Opportunity Assessment.",
    "",
    "Business / role:",
    "",
    "What work feels slow, messy, or expensive right now:",
    "",
    "Tools you already pay for:",
    "",
    "Anything we should not touch:",
    "",
    extraBody,
  ]
    .filter((line, index, all) => !(line === "" && all[index - 1] === ""))
    .join("\n");

  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const contactMailto = (extraBody = ""): string => {
  const subject = "Aidvance Consultancy — enquiry";
  const body = [
    "Hello Aidvance,",
    "",
    "What I need:",
    "",
    extraBody,
  ].join("\n");

  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const nav = [
  { href: "/#method", label: "Method" },
  { href: "/#offer", label: "Assessment" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
] as const;
