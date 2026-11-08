import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { AppShell } from "@/features/shell/components/app-shell";
import { HBD_AREA, HBD_EMAIL, SITE_DESC, SITE_NAME, SITE_URL } from "@/shared/data/site";
import "./globals.css";
import "./responsive.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Hair By Debz — Wig installs, ponytails & updos in Northwest London", template: "%s — Hair By Debz" },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  alternates: { canonical: "./" },
  openGraph: { type: "website", locale: "en_GB", siteName: SITE_NAME, title: "Hair By Debz — Northwest London", description: SITE_DESC, url: "./" },
  twitter: { card: "summary_large_image", title: "Hair By Debz — Northwest London", description: SITE_DESC },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6E4E37",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: SITE_NAME,
  description: SITE_DESC,
  url: SITE_URL,
  email: HBD_EMAIL,
  image: `${SITE_URL}/opengraph-image.png`,
  areaServed: HBD_AREA,
  priceRange: "££",
  address: { "@type": "PostalAddress", addressRegion: HBD_AREA, addressCountry: "GB" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
