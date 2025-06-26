"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

interface SEOProps {
  participantCount?: number;
  winnerCount?: number;
  isDrawing?: boolean;
  prizeTypes?: string[];
}

export default function DynamicSEO({
  participantCount = 0,
  winnerCount = 0,
  isDrawing = false,
  prizeTypes = [],
}: SEOProps) {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    // 移除旧的结构化数据
    const existingScript = document.querySelector('script[data-seo="dynamic"]');
    if (existingScript) {
      existingScript.remove();
    }

    // 创建动态结构化数据
    const generateEventData = () => {
      if (!pathname.includes("/ball") || participantCount === 0) return null;

      return {
        "@context": "https://schema.org",
        "@type": "Event",
        name: "Lucky Draw Event",
        description: `Interactive lucky draw event with ${participantCount} participants`,
        startDate: new Date().toISOString(),
        eventStatus: isDrawing
          ? "https://schema.org/EventScheduled"
          : "https://schema.org/EventPostponed",
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        location: {
          "@type": "VirtualLocation",
          url: `https://luckydraw.pub${pathname}`,
          name: "Lucky Draw Virtual Event",
        },
        organizer: {
          "@type": "Organization",
          name: "Lucky Draw System",
          url: "https://luckydraw.pub",
        },
        audience: {
          "@type": "Audience",
          audienceType: "Event Participants",
          name: `${participantCount} Participants`,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          category: "Free Event",
        },
        isAccessibleForFree: true,
        maximumAttendeeCapacity: 10000,
        remainingAttendeeCapacity: Math.max(0, 10000 - participantCount),
        workPerformed:
          prizeTypes.length > 0
            ? {
                "@type": "CreativeWork",
                name: "Prize Distribution",
                description: `Drawing for ${prizeTypes.join(", ")} prizes`,
              }
            : undefined,
      };
    };

    const generateGameData = () => {
      if (!pathname.includes("/ball")) return null;

      return {
        "@context": "https://schema.org",
        "@type": "Game",
        name: "3D Lucky Draw Game",
        description:
          "Interactive 3D sphere lottery game with realistic physics",
        gameItem: {
          "@type": "Thing",
          name: "Virtual Lottery Balls",
          description: "3D animated spheres representing participants",
        },
        numberOfPlayers: participantCount,
        gameLocation: {
          "@type": "VirtualLocation",
          url: `https://luckydraw.pub${pathname}`,
        },
        playMode: ["SinglePlayer", "MultiPlayer"],
        accessibilityFeature: [
          "fullKeyboardControl",
          "fullMouseControl",
          "fullTouchControl",
        ],
        applicationCategory: "Game",
        operatingSystem: "Web Browser",
        isAccessibleForFree: true,
        audience: {
          "@type": "Audience",
          audienceType: "General Public",
          suggestedMinAge: 0,
        },
      };
    };

    const generateBreadcrumbData = () => {
      const pathSegments = pathname.split("/").filter(Boolean);
      if (pathSegments.length < 2) return null;

      const breadcrumbList = [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://luckydraw.pub",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Lucky Draw System",
          item: `https://luckydraw.pub/${locale}`,
        },
      ];

      if (pathname.includes("/ball")) {
        breadcrumbList.push({
          "@type": "ListItem",
          position: 3,
          name: "3D Ball Lucky Draw",
          item: `https://luckydraw.pub${pathname}`,
        });
      }

      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbList,
      };
    };

    // 创建组合的结构化数据
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        generateEventData(),
        generateGameData(),
        generateBreadcrumbData(),
        // 实时统计数据
        {
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Lucky Draw Statistics",
          description:
            "Real-time statistics for the current lucky draw session",
          creator: {
            "@type": "Organization",
            name: "Lucky Draw System",
          },
          distribution: {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: `https://luckydraw.pub/api/stats${pathname}`,
          },
          temporalCoverage: new Date().toISOString().split("T")[0],
          spatialCoverage: "Global",
          variableMeasured: [
            {
              "@type": "PropertyValue",
              name: "Participant Count",
              value: participantCount,
              unitText: "people",
            },
            {
              "@type": "PropertyValue",
              name: "Winner Count",
              value: winnerCount,
              unitText: "people",
            },
            {
              "@type": "PropertyValue",
              name: "Drawing Status",
              value: isDrawing ? "Active" : "Idle",
            },
          ],
        },
      ].filter(Boolean),
    };

    // 添加新的结构化数据
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo", "dynamic");
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // 更新页面标题以包含实时数据
    if (participantCount > 0 || winnerCount > 0) {
      const titleSuffix = ` (${participantCount} 参与者${
        winnerCount > 0 ? `, ${winnerCount} 中奖者` : ""
      })`;
      const currentTitle = document.title;
      const baseTitle = currentTitle.split(" (")[0];
      document.title = baseTitle + titleSuffix;
    }
  }, [pathname, locale, participantCount, winnerCount, isDrawing, prizeTypes]);

  // 添加性能监控
  useEffect(() => {
    if (typeof window !== "undefined" && "performance" in window) {
      // 发送核心 Web Vitals 数据
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // 这里可以发送到分析服务
          console.log(`${entry.name}: ${entry.value}`);
        });
      });

      try {
        observer.observe({
          entryTypes: [
            "largest-contentful-paint",
            "first-input",
            "cumulative-layout-shift",
          ],
        });
      } catch (e) {
        // 忽略不支持的浏览器
      }

      return () => observer.disconnect();
    }
  }, []);

  return null;
}
