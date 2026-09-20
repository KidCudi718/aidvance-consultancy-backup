export type ArticleSection = {
  heading?: string;
  paragraphs: string[];
  list?: string[];
};

export type Article = {
  slug: string;
  title: string;
  shortTitle: string;
  dek: string;
  published: string;
  updated: string;
  minutes: number;
  sections: ArticleSection[];
};

export const articles: Article[] = [
  {
    slug: "assessment-versus-hype",
    title: "An assessment is not a sales pitch with extra slides",
    shortTitle: "Assessment versus hype",
    dek: "How a useful AI evaluation differs from a vendor readiness workshop that ends in a quote.",
    published: "2026-03-12",
    updated: "2026-03-12",
    minutes: 9,
    sections: [
      {
        paragraphs: [
          "If you run a small or mid-size business, you have already been offered an “AI assessment.” It usually arrives as a complimentary workshop, a 30-slide deck, and a follow-up that happens to recommend the assessor’s software.",
          "That is not an assessment. That is a funnel. The two can look similar in the first hour. They diverge the moment someone has to write down what you should not buy.",
        ],
      },
      {
        heading: "What a real assessment has to produce",
        paragraphs: [
          "A useful evaluation ends with a decision, not a vision. You should leave with a short written record that a skeptical partner could read without you in the room. At minimum it should name the work, the cost of the current mess, the two or three moves that would actually change a week, and the things you will leave alone.",
          "If the document cannot survive contact with your bookkeeper, it is branding.",
        ],
        list: [
          "A map of the work as it is done today, including the ugly exceptions.",
          "A ranked list of opportunities with a reason each one is (or is not) worth money.",
          "A “do not automate” list. If this list is empty, be suspicious.",
          "A 90-day next step that a busy owner can actually staff.",
          "An explicit note on what was not inspected.",
        ],
      },
      {
        heading: "Questions that separate a brief from a pitch",
        paragraphs: [
          "You do not need to become technical to test an assessor. You need to notice whether they are curious about your operation or impatient to demonstrate a product.",
        ],
        list: [
          "Will you write down what we should not buy? Can I see an anonymized example?",
          "How do you get paid if we implement nothing after the written brief?",
          "Which of our tools will you refuse to replace on principle?",
          "What access do you need, and what will you not look at?",
          "If the honest answer is “hire a person, not a model,” will you say that in writing?",
        ],
      },
      {
        heading: "Red flags that are easy to miss",
        paragraphs: [
          "Complimentary assessments are not automatically dishonest. They are structurally biased. The person giving away the diagnosis is usually recovering the cost in a platform license, a retainer, or a build.",
          "Watch for language that cannot be falsified: transformation, unlock, intelligence layer, future-ready. Watch for a demo that uses someone else’s data. Watch for a recommendation that requires you to migrate files before anyone has counted how many files you have.",
          "Also watch for speed that feels like a favor. A two-day “strategy sprint” that never shadows a real workflow is a performance.",
        ],
      },
      {
        heading: "What Aidvance sells instead",
        paragraphs: [
          "The front door here is an AI Opportunity Assessment. You get a working session and a written brief. Implementation is scoped only after that brief exists, and only if you ask. There is no obligation to continue.",
          "That structure is the product. It keeps the assessment from turning into a quote in costume. If you want a longer engagement later, you will be buying a defined piece of work, not repairing a vague promise.",
        ],
      },
    ],
  },
  {
    slug: "where-smbs-waste-money-on-ai",
    title: "Where small businesses actually waste money on AI",
    shortTitle: "Where SMBs waste money",
    dek: "The spend is usually seats, retainers, and tools bought before anyone named the job.",
    published: "2026-03-18",
    updated: "2026-03-18",
    minutes: 10,
    sections: [
      {
        paragraphs: [
          "The popular story is that small businesses are “behind on AI.” The quieter story is that many of them are already paying for it and cannot point to a Friday that got shorter.",
          "Waste in this market is rarely a secret research lab. It is ordinary: unused seats, a chatbot nobody asked for, a training afternoon that was a slideshow, an agency retainer that produces decks instead of fewer handoffs.",
        ],
      },
      {
        heading: "Seats bought for a future version of the team",
        paragraphs: [
          "A common invoice is a Team or Business plan for a writing model, a meeting notetaker, and a “Copilot” attached to office software. The first month is busy. By the third month, two people still use it and everyone else has the tab closed.",
          "Seats are not a strategy. They are a distribution method. If you cannot name the weekly task each seat is supposed to change, you are renting a library card and hoping literacy appears.",
        ],
      },
      {
        heading: "Chatbots installed on a site that does not have a queue",
        paragraphs: [
          "If four people answer the same ten questions by email, a simple FAQ page and a shared reply document will beat a custom assistant. A chatbot starts to earn its keep when volume is high, answers are stable, and someone owns the wrong answers.",
          "Many builds skip that last part. The bot is launched, the owner is proud for a week, and the inbox is still the real system because nobody trusts the bot with an exception. You have paid to create a second, worse front door.",
        ],
      },
      {
        heading: "Training that cannot be used on Monday",
        paragraphs: [
          "A half-day “AI for your team” session can be useful if it ends with one workflow the team will run this week: a proposal outline, an intake form, a weekly report. If it ends with a list of tools and a vibe, you bought entertainment.",
          "Ask the trainer what artifact they will leave behind and who will maintain it. If the answer is “a recording of the session,” keep the money.",
        ],
      },
      {
        heading: "Retainers that outrun the work",
        paragraphs: [
          "Some firms sell a monthly AI retainer the way others sell SEO: a standing invoice, a standing call, a standing sense that something is happening. For a 12-person company this is often too much structure and too little output.",
          "Pay for a defined brief, a defined build, or a defined review. A retainer is for a stream of work you can already describe. If you cannot describe it, you are paying for companionship.",
        ],
      },
      {
        heading: "Building before filing",
        paragraphs: [
          "The most expensive pattern is also the dullest. The files are a mess, the naming is tribal, the “source of truth” is a person, and someone still commissions an assistant that is supposed to “know the business.”",
          "Models do not invent a filing system you refused to have. They amplify whatever you already tolerate. A week spent cleaning intake, templates, and permissions is less glamorous than a launch. It is also where most of the return is hiding.",
        ],
      },
      {
        heading: "A cheaper order of operations",
        paragraphs: [
          "Count the work before you count the models. Write down three recurring jobs that eat hours. For each one, note volume, exceptions, and what “done” looks like. Only then look at tools.",
          "If you want that written down with a second pair of eyes, that is the assessment. If you want a stack first, you can buy a stack without us. Plenty of people will sell you one.",
        ],
      },
    ],
  },
  {
    slug: "workflow-audit-before-tools",
    title: "Do a workflow audit before you buy another tool",
    shortTitle: "Audit the work first",
    dek: "Shadow the work for a week. The exceptions are the job. The software is optional.",
    published: "2026-03-24",
    updated: "2026-03-24",
    minutes: 11,
    sections: [
      {
        paragraphs: [
          "Most tool purchases fail for a reason that sounds insulting: the buyer did not know how the work actually happens. They knew the job title. They knew the software logo. They did not know the Thursday afternoon version, when the client sends a PDF named final_FINAL2 and someone retypes it into a spreadsheet.",
          "A workflow audit is the unglamorous habit of writing that Thursday down before anyone opens a pricing page.",
        ],
      },
      {
        heading: "What you are trying to see",
        paragraphs: [
          "You are not writing a process novel. You are trying to see four things: the trigger, the steps, the handoffs, and the exceptions. The exceptions are usually the job. The happy path is the brochure.",
          "If a task happens twice a year, do not automate it. If a task happens daily but every instance is a special case, do not automate it yet. If a task happens daily and the special cases are namable, you have something to work with.",
        ],
      },
      {
        heading: "A one-week method that fits a small team",
        paragraphs: [
          "Pick one lane of work: quotes, onboarding, invoicing, support, scheduling, reporting. Ask the person who actually does it to keep a plain log for five working days. Not a time-tracking religion. A log.",
        ],
        list: [
          "What started the task (email, form, walk-in, Slack, voicemail).",
          "What they opened (which file, which tab, which person).",
          "What they produced (a number, a PDF, a reply, a booking).",
          "Where they waited, and on whom.",
          "What broke the pattern, in one sentence.",
        ],
      },
      {
        heading: "How to read the log without turning it into a workshop",
        paragraphs: [
          "At the end of the week, sit with the log for an hour. Circle the waits and the rework. Those two cost more than almost any model invoice. Then mark each step as judgment, transcription, lookup, or chase. Tools are good at lookup and transcription. They are uneven at judgment. They are useless at chase if nobody owns the follow-up.",
          "You will usually find that the “AI problem” is a handoff problem: the estimate lives in one person’s head, the invoice lives in another system, and the client lives in a third.",
        ],
      },
      {
        heading: "Only then look at software",
        paragraphs: [
          "Once the lane is visible, the buying question gets smaller. You are no longer asking “which AI platform.” You are asking whether this step needs a template, a form, a checklist, a junior hire, or a model.",
          "Often the first fix is not a model at all. It is a single intake form, a shared folder with names that a stranger could understand, or a rule that no work starts without a complete brief. Those fixes make later automation cheaper. Skipping them makes later automation theatrical.",
        ],
      },
      {
        heading: "What we do with this in the assessment",
        paragraphs: [
          "The working session is a guided version of this audit. We do not need a month of access to your company. We need one honest lane of work, the numbers you already have, and permission to ask dull questions.",
          "The written brief is the audit turned into a ranking: what to change this quarter, what to leave, and what not to buy. If that ranking says “clean the files first,” that is the deliverable. It is not a failure of imagination.",
        ],
      },
    ],
  },
  {
    slug: "how-to-brief-a-consultant",
    title: "How to brief a consultant so the work stays small",
    shortTitle: "How to brief a consultant",
    dek: "Send the facts before the call. Name done. Name off-limits. Keep the ocean from being boiled.",
    published: "2026-04-02",
    updated: "2026-04-02",
    minutes: 8,
    sections: [
      {
        paragraphs: [
          "Consultants expand to fill the ambiguity you give them. That is not always malice. It is the natural shape of an open brief. If you want a contained piece of work, you have to write a contained request.",
          "This is true whether you hire Aidvance or someone else. A good brief protects both sides. It also makes the first conversation shorter, which is a kindness.",
        ],
      },
      {
        heading: "Send this before anyone books a working session",
        paragraphs: [
          "You do not need a prospectus. One page is enough if it is factual. Write it as if the reader has never stood in your office.",
        ],
        list: [
          "What the business sells, to whom, and roughly at what volume.",
          "Headcount, and who actually does the work you want examined.",
          "The tools you already pay for, including the ones people avoid.",
          "The lane of work you want inspected. One lane. Not “operations.”",
          "The last time that lane went badly, in concrete terms.",
          "Numbers you already trust: hours, error rate, turnaround, margin, backlog.",
          "What is off-limits: clients, data, people, systems.",
          "What “done” would look like in 90 days if the work went well.",
        ],
      },
      {
        heading: "Name the decision you are trying to make",
        paragraphs: [
          "A brief that says “help us with AI” will produce a tour. A brief that says “we need to decide whether to keep paying for three writing tools and a notetaker” will produce a decision.",
          "If you do not know the decision yet, say that. “We do not know what to decide” is an honest brief. It still needs a lane of work, or the consultant will invent a scenic one.",
        ],
      },
      {
        heading: "Access, and the temptation to give all of it",
        paragraphs: [
          "Do not hand over the keys to every drive because it feels efficient. Give access to the lane under review and a person who can explain the exceptions. If more is needed, it can be requested in writing.",
          "A consultant who demands company-wide access before they can ask questions is not being thorough. They are being convenient to themselves.",
        ],
      },
      {
        heading: "How we use a brief at Aidvance",
        paragraphs: [
          "The assessment assumes you can send something like the list above, even if it is rough. The working session is for the parts that do not survive email: the workarounds, the political facts, the “we tried that in 2023.”",
          "If you cannot write a brief yet, start with the workflow audit article and a week of notes. Come back when the lane has a name. We would rather wait than invent a project that only exists in a proposal.",
        ],
      },
    ],
  },
  {
    slug: "when-not-to-automate",
    title: "When you should not automate",
    shortTitle: "When not to automate",
    dek: "Some work gets worse when you speed it up. Here is how to leave it alone on purpose.",
    published: "2026-04-09",
    updated: "2026-04-09",
    minutes: 9,
    sections: [
      {
        paragraphs: [
          "Automation has a quiet cost: it freezes today’s understanding of a job and then runs that understanding faster. If the understanding is wrong, you get a more efficient mistake.",
          "A serious consultancy should be as willing to say no as it is to draw an architecture. The following cases are where we usually recommend leaving the work in human hands, at least for now.",
        ],
      },
      {
        heading: "You do not yet understand the work",
        paragraphs: [
          "If two employees would describe the same process differently, you do not have a process. You have folklore. Automating folklore produces a bot that argues with both of them.",
          "Write the work down. Run it the same way for a month. Then talk about tools. Speed is not the first problem in a shop that cannot agree what “done” means.",
        ],
      },
      {
        heading: "The exceptions are the product",
        paragraphs: [
          "Some businesses sell judgment on messy inputs: a custom quote, a care decision, a negotiation, a repair that is never the same twice. The catalog version of that work is not what clients pay for.",
          "You can still use a model for the boring collar around that work — the intake, the notes, the follow-up email. Automating the judgment itself usually makes the service cheaper in the wrong direction.",
        ],
      },
      {
        heading: "The work is rare, or about to stop",
        paragraphs: [
          "A task that happens six times a year does not want a system. It wants a checklist. Building an assistant for a process you will retire next quarter is a way to spend money on a eulogy.",
          "Ask “will we still do this in a year?” If the honest answer is no, do not encode it.",
        ],
      },
      {
        heading: "The risk sits in the error, not in the hour",
        paragraphs: [
          "If a wrong answer creates legal, medical, financial, or safety exposure, speed is not a gift. A model that drafts is different from a model that sends. A model that suggests is different from a model that files.",
          "Keep a human on the action that can hurt someone. That is not Luddism. It is an adult reading of liability.",
        ],
      },
      {
        heading: "Nobody will own the wrong answers",
        paragraphs: [
          "Every automated system drifts. Prices change, policies change, a supplier renames a SKU. If there is no named person who will correct the machine, the machine will quietly train your clients to distrust you.",
          "Ownership is part of the cost. If you cannot staff it, do not launch it.",
        ],
      },
      {
        heading: "Saying no is part of the brief",
        paragraphs: [
          "The Aidvance assessment always includes a “do not automate” list. Sometimes that list is the most valuable page. It stops a well-meaning owner from buying a product that would make a fragile process faster.",
          "If you already know a lane of work should stay human, write that in the brief. We will not try to talk you out of a good boundary.",
        ],
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function articlePath(slug: string): string {
  return `/resources/${slug}`;
}
