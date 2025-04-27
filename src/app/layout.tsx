import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Lucky Draw System | Event Drawing Tool",
  description:
    "Professional online lucky draw system supporting customized participant lists, winner counts and prize settings. Suitable for company events, marketing campaigns, and offline meetings.",
  keywords:
    "lucky draw system,fortune draw,event drawing,annual meeting draw,random draw,online drawing tool",
  authors: [{ name: "Lucky Draw Team" }],
  category: "Tools",
  openGraph: {
    title: "Lucky Draw System | Professional Event Drawing Tool",
    description:
      "Simple and easy-to-use online lucky draw system, suitable for company events, marketing campaigns, and offline meetings. Supports customized participant lists, winner counts, and prize settings.",
    url: "https://luckydraw.pub",
    siteName: "Lucky Draw System",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lucky Draw System Screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucky Draw System | Professional Event Drawing Tool",
    description:
      "Simple and easy-to-use online lucky draw system, suitable for company events, marketing campaigns, and offline meetings.",
    images: ["/twitter-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: { url: "/apple-icon.png", type: "image/png" },
  },
  viewport: "width=device-width, initial-scale=1.0",
  robots: "index, follow",
  alternates: {
    canonical: "https://luckydraw.pub",
    languages: {
      "en-US": "https://luckydraw.pub/en",
      "zh-CN": "https://luckydraw.pub/zh",
      "fr-FR": "https://luckydraw.pub/fr",
      "de-DE": "https://luckydraw.pub/de",
      "es-ES": "https://luckydraw.pub/es",
      "ko-KR": "https://luckydraw.pub/ko",
      "ja-JP": "https://luckydraw.pub/ja",
      "pt-BR": "https://luckydraw.pub/pt",
      "ru-RU": "https://luckydraw.pub/ru",
    },
  },
};

// Structured data for better search engine understanding
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Lucky Draw System",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Professional online lucky draw system supporting customized participant lists, winner counts and prize settings. Suitable for company events, marketing campaigns, and offline meetings.",
  url: "https://luckydraw.pub",
  featureList:
    "Random draw,Custom participants,Multilingual support,Animation effects,Prize settings",
  screenshot: "https://luckydraw.pub/screenshot.jpg",
  softwareVersion: "1.0.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#061433" />
        <link rel="manifest" href="/manifest.json" />

        {/* Links to different language versions */}
        <link rel="alternate" hrefLang="zh" href="https://luckydraw.pub/zh" />
        <link rel="alternate" hrefLang="en" href="https://luckydraw.pub/en" />
        <link rel="alternate" hrefLang="fr" href="https://luckydraw.pub/fr" />
        <link rel="alternate" hrefLang="de" href="https://luckydraw.pub/de" />
        <link rel="alternate" hrefLang="es" href="https://luckydraw.pub/es" />
        <link rel="alternate" hrefLang="ko" href="https://luckydraw.pub/ko" />
        <link rel="alternate" hrefLang="ja" href="https://luckydraw.pub/ja" />
        <link rel="alternate" hrefLang="pt" href="https://luckydraw.pub/pt" />
        <link rel="alternate" hrefLang="ru" href="https://luckydraw.pub/ru" />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://luckydraw.pub"
        />

        <style>
          {`
            html, body {
              margin: 0;
              padding: 0;
              overflow: hidden;
              background-color: #061433;
              width: 100%;
              height: 100%;
            }
            
            /* Fix icon size change issue during loading */
            svg {
              width: 1em !important;
              height: 1em !important;
              transform: none !important;
              transition: none !important;
            }
            
            /* Ensure font icons display correctly */
            [class^="fa-"],
            [class*=" fa-"],
            .fa, 
            .fas, 
            .far, 
            .fab,
            .svg-inline--fa {
              font-size: inherit !important;
              width: auto !important;
              height: 1em !important;
              vertical-align: -0.125em !important;
              transform: none !important;
              transition: none !important;
            }
          `}
        </style>
        {/* Preload font icon script */}
        <Script src="/fontawesome-preload.js" strategy="beforeInteractive" />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-REE8EMMCB4"
        ></Script>
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag("config", "G-REE8EMMCB4");
          `}
        </Script>

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-[#061433] text-gray-900 min-h-screen w-full overflow-hidden">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=id=G-REE8EMMCB4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
