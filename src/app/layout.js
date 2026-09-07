import { Great_Vibes, Outfit, Playfair_Display } from "next/font/google";
import SiteChrome from "@/components/site/SiteChrome";
import { getPublicSiteSettings } from "@/lib/settings/getPublicSiteSettings";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  adjustFontFallback: false,
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: false,
  preload: true,
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script-face",
  display: "swap",
  adjustFontFallback: false,
  preload: true,
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getPublicSiteSettings();

  return {
    title: settings.metadata.title,
    description: settings.metadata.description,
    openGraph: {
      title: settings.metadata.title,
      description: settings.metadata.description,
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function RootLayout({ children }) {
  const settings = await getPublicSiteSettings();

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body
        className={`${outfit.className} flex min-h-full flex-col bg-ivory font-sans text-ink`}
      >
        <SiteChrome settings={settings}>{children}</SiteChrome>
      </body>
    </html>
  );
}
