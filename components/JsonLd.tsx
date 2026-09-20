import { site } from "@/lib/site";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.description,
    areaServed: "Worldwide",
    image: `${site.url}/brand/wordmark.svg`,
    logo: `${site.url}/brand/wordmark.svg`,
    offers: {
      "@type": "Offer",
      name: site.offer.name,
      price: site.offer.feeUsd,
      priceCurrency: "USD",
      description: site.offer.duration,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  dek,
  path,
  published,
  updated,
}: {
  title: string;
  dek: string;
  path: string;
  published: string;
  updated: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: dek,
    datePublished: published,
    dateModified: updated,
    author: {
      "@type": "Organization",
      name: site.name,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    mainEntityOfPage: `${site.url}${path}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
