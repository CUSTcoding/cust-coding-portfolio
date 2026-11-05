import type { Metadata, Viewport } from "next";
import { texts } from "@/config/texts";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/vt323";
import "./connect.css";
import "./globals.css";

const SITE = "https://www.leandromaiscedo.dev/";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: texts.meta.title,
  description: texts.meta.description,
  alternates: { canonical: SITE },
  icons: {
    icon: [
      { url: "/build/images/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/build/images/favicon.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/build/images/favicon.png",
    apple: { url: "/build/images/favicon.png", sizes: "180x180" },
  },
  openGraph: {
    type: "website",
    url: SITE,
    title: texts.meta.title,
    description: texts.meta.description,
    images: ["/build/images/favicon.png"],
    locale: "pt_BR",
    siteName: "Leandro Macedo Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: texts.meta.title,
    description: texts.meta.description,
    images: [`${SITE}build/images/favicon.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={texts.meta.lang}>
      <head>
        <link rel="preload" href="/build/images/bg-70388ab4.webp" as="image" />
      </head>
      <body>{children}</body>
    </html>
  );
}
