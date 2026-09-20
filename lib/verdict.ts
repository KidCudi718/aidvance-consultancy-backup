import { contactPath } from "@/lib/site";

export type PickerKey = "faq" | "quote" | "admin" | "sched" | "train" | "other";

export const pickerRows: ReadonlyArray<{
  key: PickerKey;
  n: string;
  label: string;
}> = [
  { key: "faq", n: "01", label: "Answering the same questions" },
  { key: "quote", n: "02", label: "Quotes, estimates and proposals" },
  { key: "admin", n: "03", label: "Paperwork, data entry, retyping the same information" },
  { key: "sched", n: "04", label: "Scheduling and chasing people" },
  { key: "train", n: "05", label: "Training people, repeating myself" },
  { key: "other", n: "06", label: "Something else" },
];

export const verdictOrder: Exclude<PickerKey, "other">[] = [
  "faq",
  "quote",
  "admin",
  "sched",
  "train",
];

export const verdictCopy: Record<
  Exclude<PickerKey, "other">,
  { html: string; title: string; href: string }
> = {
  faq: {
    html: "The most fixable thing on this list. The same five questions come in forever. Answer each one properly <em>once</em>, put the answers where they work while you sleep, and the after-hours problem mostly solves itself.",
    title: "Stop answering the same five questions",
    href: "/library/stop-answering-the-same-questions/",
  },
  quote: {
    html: "If quoting happens after dinner, you're not slow — you're doing the same assembly job by hand every time. The judgement in a quote is yours and stays yours. <em>The typing around it doesn't have to be.</em>",
    title: "Quotes and estimates without the evening shift",
    href: "/library/quotes-and-estimates/",
  },
  admin: {
    html: "The most boring thing here and the one that pays back fastest. <em>Forty minutes a day</em> retyping information you already have is the whole win, and it's bigger than it sounds.",
    title: "Your first hour with AI, and not a dollar spent",
    href: "/library/ai-without-spending-a-dollar/",
  },
  sched: {
    html: "Worth fixing — but probably not with AI. A booking link and one reminder rule solves most of this for <em>nothing</em>. We'd rather tell you that than sell you something.",
    title: "What this actually costs",
    href: "/library/what-ai-actually-costs/",
  },
  train: {
    html: "If you explain the same thing to every new person, that explanation is a document you haven't written yet. <em>Start there</em>, not with a tool.",
    title: "Getting it out of your head and onto paper",
    href: "/library/ai-for-hiring-and-onboarding/",
  },
};

export const emptyVerdict =
  "Pick what's eating your week. We'll tell you straight — including when AI isn't the answer.";

export function framingLine(count: number): string {
  if (count === 1) {
    return "One thing, fixed properly, is the whole strategy. Here's where to start.";
  }
  if (count <= 3) {
    return "Start at the top and work down. The rest get easier once the first one is sorted.";
  }
  return "That's most of a week. Don't try to fix it all at once — take the first one only.";
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
      html: `&ldquo;${escapeHtml(trimmed)}&rdquo; — That's not on the list, which usually means it's specific to how <em>your</em> business runs. Those are the ones worth looking at properly — no off-the-shelf tool is shaped like your week.`,
      href: contactPath({ message: trimmed, topic: "something-else" }),
      label: "Send it to me and I'll tell you if it's fixable →",
    };
  }

  return {
    html: "Tell us what it is in the box above. If it isn't on this list it's usually specific to your business, and those are the ones worth a proper look.",
    href: null,
    label: null,
  };
}
