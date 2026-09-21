export const site = {
  name: "Aidvance Consultancy",
  shortName: "Aidvance",
  domain: "aidvance.xyz",
  url: "https://aidvance.xyz",
  locale: "en_US",
  city: "New York",
  year: 2026,
  description:
    "Aidvance works out which job in your week is actually worth fixing, and says so when the answer is not AI. One fixed fee, five business days, for owner-operators.",
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
