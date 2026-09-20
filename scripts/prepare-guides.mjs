import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const uploads = "/home/ubuntu/.cursor/projects/workspace/uploads";
const outDir = join(root, "content/guides");

mkdirSync(outDir, { recursive: true });

const files = [
  ["01-ai-without-spending-a-dollar_50b8.html", "ai-without-spending-a-dollar.html"],
  ["02-stop-answering-the-same-questions_1a14.html", "stop-answering-the-same-questions.html"],
  ["03-quotes-and-estimates_f282.html", "quotes-and-estimates.html"],
  ["04-ai-for-hiring-and-onboarding_4f12.html", "ai-for-hiring-and-onboarding.html"],
  ["05-what-ai-actually-costs_5363.html", "what-ai-actually-costs.html"],
  ["06-keeping-your-business-data-safe_17e9.html", "keeping-your-business-data-safe.html"],
];

const vendorPrice =
  /<p>As a concrete example, verified on the vendor's own pricing page in September 2026:[\s\S]*?<\/p>/;

const vendorPriceReplacement = `<p>As a concrete example, verified on the vendor's own pricing page in September 2026: Claude publishes individual Pro and Team plans on their site. <a class="tlink" href="https://claude.com/pricing" rel="noopener">Check the current figures here</a> &mdash; these move, and we would rather you saw the real page than trusted a number on ours.</p>`;

for (const [from, to] of files) {
  let html = readFileSync(join(uploads, from), "utf8");
  html = html.replaceAll(' style="color:var(--accent)"', "");
  html = html.replaceAll('href="/start/"', 'href="/#start"');
  html = html.replace(vendorPrice, vendorPriceReplacement);
  if (/\$\d/.test(html)) {
    throw new Error(`Dollar amounts remain in ${to}`);
  }
  writeFileSync(join(outDir, to), html);
  console.log("wrote", to);
}
