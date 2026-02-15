import { Portfolio } from "@/components/Portfolio";
import { getPortfolioMeta } from "@/lib/portfolio-server";

export default async function Home() {
  const meta = await getPortfolioMeta();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: meta.author.name,
    url: meta.siteUrl,
    jobTitle: meta.author.jobTitle,
    sameAs: [
      meta.social?.github,
      meta.social?.linkedin,
      meta.social?.twitter
        ? `https://x.com/${meta.social.twitter.replace("@", "")}`
        : undefined,
    ].filter(Boolean),
    knowsAbout: meta.keywords,
    ...(meta.ogImage && {
      image: `${meta.siteUrl}${meta.ogImage}`,
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Portfolio />
    </>
  );
}
