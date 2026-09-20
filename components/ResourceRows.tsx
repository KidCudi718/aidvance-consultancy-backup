import Link from "next/link";
import { articles } from "@/lib/articles";

export function ResourceRows({ limit }: { limit?: number }) {
  const list = limit ? articles.slice(0, limit) : articles;

  return (
    <div className="resource-grid">
      {list.map((article, index) => (
        <Link
          key={article.slug}
          href={`/resources/${article.slug}`}
          className="res-card"
        >
          <span className="res-card__n">
            {String(index + 1).padStart(2, "0")} · {article.minutes} min
          </span>
          <h3>{article.shortTitle}</h3>
          <p>{article.dek}</p>
        </Link>
      ))}
    </div>
  );
}
