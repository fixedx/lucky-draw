import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import PerformanceMonitor from "@/components/SEO/PerformanceMonitor";

export const metadata: Metadata = {
  title: {
    default: "Lucky Draw System | Professional 3D Event Drawing Tool",
    template: "%s | Lucky Draw System",
  },
  description:
    "Professional multi-mode lucky draw system featuring 3D sphere animation, grid cards, and spinning wheel. Supports customized participant lists, winner counts and prize settings. Perfect for company events, marketing campaigns, annual meetings, team building and celebrations. Free, multilingual and easy to use.",
  keywords: [
    "lucky draw system",
    "3D lottery animation",
    "spinning wheel lottery",
    "grid card lottery",
    "event drawing tool",
    "annual meeting draw",
    "random draw generator",
    "online drawing tool",
    "prize drawing",
    "raffle system",
    "wheel of fortune",
    "company event tool",
    "marketing campaign draw",
    "participant management",
    "winner selection",
    "multilingual lottery",
    "free drawing tool",
    "3D sphere animation",
    "interactive wheel",
    "visual grid lottery",
    "event management",
    "team building activity",
    "celebration tool",
    "game show wheel",
    "contest platform",
    "instant winner",
    "fair randomization",
    "excel import",
    "participant cards",
    "winner history",
    "customizable prizes",
    "entertainment events",
    "corporate lottery",
    "workshop activities",
    "interactive presentations",
  ],
  authors: [{ name: "Lucky Draw Team", url: "https://luckydraw.pub" }],
  creator: "Lucky Draw Team",
  publisher: "Lucky Draw System",
  category: "Productivity",
  classification: "Business Tools",
  openGraph: {
    title: "Lucky Draw System | Professional Multi-Mode Event Drawing Tool",
    description:
      "Professional multi-mode lucky draw system featuring 3D sphere animation, grid cards, and spinning wheel. Supports customized participant lists, winner counts and prize settings. Perfect for company events, marketing campaigns, annual meetings, team building and celebrations. Free, multilingual and easy to use.",
    url: "https://luckydraw.pub",
    siteName: "Lucky Draw System",
    images: [
      {
        url: "/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Lucky Draw System - 3D Sphere Animation Screenshot",
        type: "image/webp",
      },
      {
        url: "/images/og-image-square.webp",
        width: 800,
        height: 800,
        alt: "Lucky Draw System Logo",
        type: "image/webp",
      },
    ],
    locale: "en_US",
    type: "website",
    countryName: "Global",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucky Draw System | Professional Multi-Mode Event Drawing Tool",
    description:
      "Professional multi-mode lucky draw system featuring 3D sphere animation, grid cards, and spinning wheel. Perfect for company events, marketing campaigns, annual meetings, team building and celebrations. Free, multilingual and easy to use.",
    images: ["/images/twitter-image.webp"],
    creator: "@luckydrawsystem",
    site: "@luckydrawsystem",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/images/icon-192.webp", type: "image/webp", sizes: "192x192" },
      { url: "/images/icon-512.webp", type: "image/webp", sizes: "512x512" },
    ],
    apple: [
      {
        url: "/images/apple-icon-180.webp",
        type: "image/webp",
        sizes: "180x180",
      },
      {
        url: "/images/apple-icon-152.webp",
        type: "image/webp",
        sizes: "152x152",
      },
      {
        url: "/images/apple-icon-120.webp",
        type: "image/webp",
        sizes: "120x120",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/images/safari-pinned-tab.svg",
        color: "#f59e0b",
      },
    ],
  },
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    other: {
      bing: "your-bing-verification-code",
    },
  },
  alternates: {
    canonical: "https://luckydraw.pub",
    // 语言跳转链接已移除，因为URL结构已改变
  },
};

// Enhanced structured data for better search engine understanding
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://luckydraw.pub/#webapp",
      name: "Lucky Draw System",
      alternateName: [
        "Lucky Draw",
        "3D Lottery System",
        "Spinning Wheel Lottery",
        "Grid Card Lottery",
        "Event Drawing Tool",
      ],
      description:
        "Professional multi-mode lucky draw system featuring 3D sphere animation, grid cards, and spinning wheel. Supports customized participant lists, winner counts and prize settings. Perfect for company events, marketing campaigns, annual meetings, team building and celebrations.",
      url: "https://luckydraw.pub",
      applicationCategory: ["UtilityApplication", "BusinessApplication"],
      operatingSystem: "Web Browser",
      browserRequirements: "WebGL 2.0, Modern Browser",
      permissions: "no special permissions required",
      installUrl: "https://luckydraw.pub",
      downloadUrl: "https://luckydraw.pub",
      softwareVersion: "2.0.0",
      releaseNotes:
        "Enhanced 3D animations, multilingual support, improved performance",
      datePublished: "2024-01-01",
      dateModified: new Date().toISOString().split("T")[0],
      author: {
        "@type": "Organization",
        name: "Lucky Draw Team",
        url: "https://luckydraw.pub",
      },
      publisher: {
        "@type": "Organization",
        name: "Lucky Draw System",
        url: "https://luckydraw.pub",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        category: "Free Software",
      },
      featureList: [
        "3D Sphere Animation",
        "Spinning Wheel Lottery",
        "Grid Card Layout",
        "Random Draw Algorithm",
        "Custom Participant Lists",
        "Multiple Prize Levels",
        "Multilingual Support (9 languages)",
        "Real-time Animation Effects",
        "Excel Data Import",
        "Winner History Tracking",
        "Export Winner Results",
        "Import/Export Participant Data",
        "Interactive Visual Effects",
        "Responsive Design",
        "No Registration Required",
      ],
      screenshot: [
        "https://luckydraw.pub/images/screenshot-3d-sphere.webp",
        "https://luckydraw.pub/images/screenshot-winner-animation.webp",
        "https://luckydraw.pub/images/screenshot-participant-management.webp",
      ],
      inLanguage: ["en", "zh", "fr", "de", "es", "ko", "ja", "pt", "ru"],
      accessibilityFeature: [
        "highContrastDisplay",
        "resizeText",
        "keyboardNavigation",
      ],
      accessibilityHazard: "none",
      accessibilityControl: [
        "fullKeyboardControl",
        "fullMouseControl",
        "fullTouchControl",
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://luckydraw.pub/#organization",
      name: "Lucky Draw System",
      url: "https://luckydraw.pub",
      description:
        "Providing professional online lottery and event drawing solutions",
      foundingDate: "2024",
      numberOfEmployees: "1-10",
      slogan: "Professional 3D Event Drawing Made Easy",
    },
    {
      "@type": "WebSite",
      "@id": "https://luckydraw.pub/#website",
      url: "https://luckydraw.pub",
      name: "Lucky Draw System",
      description: "Professional online lucky draw system with 3D animation",
      publisher: {
        "@id": "https://luckydraw.pub/#organization",
      },
      inLanguage: ["en", "zh", "fr", "de", "es", "ko", "ja", "pt", "ru"],
      potentialAction: {
        "@type": "SearchAction",
        target: "https://luckydraw.pub/?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        {/* Icons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/images/apple-icon-180.webp" />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="msapplication-TileColor" content="#f59e0b" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for analytics */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Critical CSS for above-the-fold content */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            html, body { margin: 0; padding: 0; font-family: Inter, system-ui, sans-serif; }
            .loading-screen { 
              position: fixed; 
              inset: 0; 
              background: linear-gradient(135deg, #fbbf24, #f59e0b, #dc2626);
              display: flex; 
              align-items: center; 
              justify-content: center; 
              z-index: 9999;
            }
          `,
          }}
        />

        {/* 语言跳转链接已移除，因为URL结构已改变 */}

        <style>
          {`
            html, body {
              margin: 0;
              padding: 0;
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
      <body className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white min-h-screen w-full">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=id=G-REE8EMMCB4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <PerformanceMonitor />
        {children}
      </body>
    </html>
  );
}
