export const site = {
  name: "Aidvance Consultancy",
  shortName: "Aidvance",
  domain: "aidvance.xyz",
  url: "https://aidvance.xyz",
  email: "hello@aidvance.xyz",
  locale: "en_US",
  city: "New York",
  year: 2026,
  description:
    "Most businesses pay twenty dollars a month for something nobody has opened since March. Aidvance helps owner-operators find the one job worth fixing — and says so when AI is not the answer.",
  offer: {
    name: "The Assessment",
    duration: "One fixed fee, agreed before we start. Five business days.",
  },
} as const;

export const contactMailto = (subject = "A question", extraBody = ""): string => {
  const body = ["Hello,", "", extraBody].join("\n");
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const assessmentMailto = (extraBody = ""): string => {
  const subject = "The Assessment";
  const body = [
    "Hello,",
    "",
    "I would like to ask about the assessment.",
    "",
    extraBody,
  ].join("\n");

  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const otherMailto = (text: string): string => {
  return `mailto:${site.email}?subject=${encodeURIComponent("Something else is eating my week")}&body=${encodeURIComponent(text)}`;
};

export const nav = [
  { href: "/#start", label: "Start here" },
  { href: "/library/", label: "Library" },
  { href: "/assessment/", label: "Assessment" },
  { href: "/contact/", label: "Contact" },
] as const;
