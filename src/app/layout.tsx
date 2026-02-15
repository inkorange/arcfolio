import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { getPortfolioMeta } from "@/lib/portfolio-server";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPortfolioMeta();

  const ogImageUrl = meta.ogImage
    ? `${meta.siteUrl}${meta.ogImage}`
    : undefined;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: meta.author.name, url: meta.author.url }],
    creator: meta.author.name,
    metadataBase: new URL(meta.siteUrl),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: meta.locale || "en_US",
      url: meta.siteUrl,
      title: meta.title,
      description: meta.description,
      siteName: meta.author.name,
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: meta.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      ...(meta.social?.twitter && { creator: meta.social.twitter }),
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
