import { site } from "@/lib/site";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.description,
    founder: {
      "@type": "Person",
      name: site.person.name,
      jobTitle: site.person.role,
      email: site.email,
    },
    areaServed: "Worldwide",
    image: `${site.url}/brand/logo.png`,
    logo: `${site.url}/brand/logo.png`,
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: site.offer.name,
        description: site.offer.duration,
      },
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
      logo: `${site.url}/brand/logo.png`,
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
