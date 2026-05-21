import {
  CHECKOUT_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  faq,
  mentors,
  offer,
} from "@/lib/sales/knowledge";

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export default function SalesJsonLd() {
  const siteUrl = getSiteUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
  };

  const course = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${SITE_NAME} — Mentoria para renda online`,
    description: SITE_DESCRIPTION,
    provider: { "@type": "Organization", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      price: offer.priceBrl,
      priceCurrency: "BRL",
      url: CHECKOUT_URL,
      availability: "https://schema.org/InStock",
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const people = mentors.map((m) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: m.name,
    jobTitle: m.role,
    description: m.bio,
    worksFor: { "@type": "Organization", name: SITE_NAME },
  }));

  const graphs = [organization, course, faqPage, ...people];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphs) }}
    />
  );
}
