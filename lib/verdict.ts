import { contactPath } from "@/lib/site";

export type PickerKey =
  | "faq"
  | "quote"
  | "admin"
  | "sched"
  | "bottleneck"
  | "train"
  | "afterhours"
  | "leads"
  | "other";

export const pickerRows: ReadonlyArray<{
  key: PickerKey;
  n: string;
  label: string;
}> = [
  { key: "faq", n: "01", label: "I answer the same handful of questions every day" },
  { key: "quote", n: "02", label: "I write quotes and estimates at night, after everything else" },
  { key: "admin", n: "03", label: "I type the same information into two or three different places" },
  { key: "sched", n: "04", label: "Half my week is chasing people to confirm, show up, or pay" },
  { key: "bottleneck", n: "05", label: "Everything has to come through me before it can happen" },
  { key: "train", n: "06", label: "Every new person learns the job by watching me" },
  { key: "afterhours", n: "07", label: "Calls and messages come in after hours and nobody answers" },
  { key: "leads", n: "08", label: "Leads come in and some of them just go cold" },
  { key: "other", n: "09", label: "Something else" },
];

export const verdictOrder: Exclude<PickerKey, "other">[] = [
  "faq",
  "quote",
  "admin",
  "sched",
  "bottleneck",
  "train",
  "afterhours",
  "leads",
];

/**
 * A row only carries a guide link when the library actually has a guide about
 * that problem. Three of these do not, and pointing them at the nearest
 * neighbour made the page look broken: you clicked "calls come in after hours"
 * and got an article titled "stop answering the same five questions", which
 * reads as the wrong thing opening. Better to say the honest read and send
 * them to Casey.
 */
export const verdictCopy: Record<
  Exclude<PickerKey, "other">,
  { html: string; title?: string; href?: string }
> = {
  faq: {
    html: "The most fixable thing on this list. The same five questions come in forever. Answer each one properly <em>once</em>, put the answers where they work while you sleep, and the after-hours problem mostly solves itself.",
    title: "Stop answering the same five questions",
    href: "/library/stop-answering-the-same-questions/",
  },
  quote: {
    html: "If quoting happens after dinner, you're not slow. You're doing the same assembly job by hand every time. The judgement in a quote stays yours. <em>The typing around it doesn't have to be.</em>",
    title: "Quotes and estimates without the evening shift",
    href: "/library/quotes-and-estimates/",
  },
  admin: {
    html: "The most boring thing here and the one that pays back fastest. <em>Forty minutes a day</em> retyping information you already have is the whole win, and it's bigger than it sounds.",
    title: "Your first hour with AI, and not a dollar spent",
    href: "/library/ai-without-spending-a-dollar/",
  },
  sched: {
    html: "Worth fixing, but probably not with AI. A booking link and one reminder rule solves most of this for <em>nothing</em>. We'd rather tell you that than sell you something.",
    title: "What this actually costs",
    href: "/library/what-ai-actually-costs/",
  },
  train: {
    html: "If you explain the same thing to every new person, that explanation is a document you haven't written yet. <em>Start there</em>, not with a tool.",
    title: "Getting it out of your head and onto paper",
    href: "/library/ai-for-hiring-and-onboarding/",
  },
  bottleneck: {
    html: "The most common one on this list and the hardest to say out loud. It is almost never that nobody else <em>could</em> do it. It is that nobody has ever written down how. That is a weekend, not a software project.",
  },
  afterhours: {
    html: "Worth being honest about: a robot that answers wrongly at midnight does more damage than silence. What works is a real answers page, and a holding reply that says <em>a person will call you in the morning</em>.",
  },
  leads: {
    html: "Almost never a lead problem. It is a follow-up problem, and follow-up is the highest-return thing on this whole list because nobody does it. <em>One short note a week later</em> moves the win rate more than anything else you could change.",
  },
};

export function framingLine(count: number): string {
  if (count === 1) {
    return "One thing, fixed properly, is the whole strategy. Here's where to start.";
  }
  if (count <= 3) {
    return "Start at the top and work down. The rest get easier once the first one is sorted.";
  }
  return "That's most of a week. Don't try to fix it all at once. Take the first one only.";
}

export function padN(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"]/g, (char) => {
    if (char === "&") return "&amp;";
    if (char === "<") return "&lt;";
    if (char === ">") return "&gt;";
    return "&quot;";
  });
}

export function otherVerdict(text: string): { html: string; href: string | null; label: string | null } {
  const trimmed = text.trim();
  if (trimmed) {
    return {
      html: `&ldquo;${escapeHtml(trimmed)}&rdquo; is not on the list, which usually means it's specific to how <em>your</em> business runs. Those are the ones worth looking at properly. No off-the-shelf tool is shaped like your week.`,
      href: contactPath({ message: trimmed, topic: "something-else" }),
      label: "Send it to me and I'll tell you if it's fixable →",
    };
  }

  return {
    html: "Type it into the box under the grid. If it isn't on this list it's usually specific to your business, and those are the ones worth a proper look.",
    href: null,
    label: null,
  };
}
