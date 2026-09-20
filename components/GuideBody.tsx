import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GuideBody({ slug }: { slug: string }) {
  const file = join(process.cwd(), "content/guides", `${slug}.html`);
  const raw = await readFile(file, "utf8");
  const start = raw.indexOf("<article>");
  const html = start >= 0 ? raw.slice(start) : raw;

  return (
    <div
      className="guide-page"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
