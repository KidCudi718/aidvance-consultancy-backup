export const site = {
  name: "Aidvance Consultancy",
  shortName: "Aidvance",
  domain: "aidvance.xyz",
  url: "https://aidvance.xyz",
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

export function contactPath(options?: { message?: string; topic?: string }): string {
  const params = new URLSearchParams();
  const message = options?.message?.trim();
  const topic = options?.topic?.trim();

  if (message) {
    params.set("message", message);
  }
  if (topic) {
    params.set("topic", topic);
  }

  const query = params.toString();
  return query ? `/contact/?${query}` : "/contact/";
}

export const nav = [
  { href: "/#start", label: "Start here" },
  { href: "/library/", label: "Library" },
  { href: "/assessment/", label: "Assessment" },
  { href: "/contact/", label: "Contact" },
] as const;
