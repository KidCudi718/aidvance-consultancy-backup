import type { Article } from "@/lib/articles";

export function ArticleBody({ article }: { article: Article }) {
  return (
    <div className="prose">
      {article.sections.map((section) => (
        <section key={section.heading ?? section.paragraphs[0]}>
          {section.heading ? <h2>{section.heading}</h2> : null}
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.list ? (
            <ul>
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}
