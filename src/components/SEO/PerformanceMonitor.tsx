"use client";

import { useEffect } from "react";

interface WebVitalMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  entries: PerformanceEntry[];
}

export default function PerformanceMonitor() {
  useEffect(() => {
    // 动态导入web-vitals库
    const loadWebVitals = async () => {
      try {
        const { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } = await import(
          "web-vitals"
        );

        // 发送metrics到分析服务的函数
        const sendToAnalytics = (metric: WebVitalMetric) => {
          // 这里可以发送到Google Analytics、其他分析服务或自己的API
          console.log("Web Vital:", metric);

          // 如果有Google Analytics
          if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", metric.name, {
              event_category: "Web Vitals",
              event_label: metric.rating,
              value: Math.round(metric.value),
              custom_map: {
                metric_name: metric.name,
                metric_value: metric.value,
                metric_rating: metric.rating,
              },
            });
          }

          // 发送到自定义API（可选）
          if (process.env.NODE_ENV === "production") {
            fetch("/api/analytics", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: "web-vital",
                metric,
                url: window.location.href,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
              }),
            }).catch((err) => console.warn("Failed to send analytics:", err));
          }
        };

        // 注册所有重要的Web Vitals
        onCLS(sendToAnalytics);
        onFID(sendToAnalytics);
        onFCP(sendToAnalytics);
        onLCP(sendToAnalytics);
        onTTFB(sendToAnalytics);
        onINP(sendToAnalytics);
      } catch (error) {
        // 如果web-vitals包不可用，使用原生Performance API
        console.warn("web-vitals not available, using native Performance API");
        measureNativeMetrics();
      }
    };

    // 使用原生Performance API的回退方案
    const measureNativeMetrics = () => {
      if (typeof window === "undefined" || !("performance" in window)) return;

      // 测量页面加载时间
      window.addEventListener("load", () => {
        const navigation = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;

        if (navigation) {
          const metrics = {
            domContentLoaded:
              navigation.domContentLoadedEventEnd -
              navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            firstByte: navigation.responseStart - navigation.requestStart,
            domInteractive:
              navigation.domInteractive - navigation.navigationStart,
            domComplete: navigation.domComplete - navigation.navigationStart,
          };

          console.log("Page Load Metrics:", metrics);

          // 发送到分析服务
          if (process.env.NODE_ENV === "production") {
            fetch("/api/analytics", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: "page-load",
                metrics,
                url: window.location.href,
                timestamp: new Date().toISOString(),
              }),
            }).catch((err) => console.warn("Failed to send analytics:", err));
          }
        }
      });

      // 观察Long Task
      if ("PerformanceObserver" in window) {
        try {
          const longTaskObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              console.warn("Long Task detected:", {
                duration: entry.duration,
                startTime: entry.startTime,
              });

              // 发送长任务警告
              if (
                entry.duration > 50 &&
                process.env.NODE_ENV === "production"
              ) {
                fetch("/api/analytics", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    type: "long-task",
                    duration: entry.duration,
                    startTime: entry.startTime,
                    url: window.location.href,
                    timestamp: new Date().toISOString(),
                  }),
                }).catch((err) =>
                  console.warn("Failed to send analytics:", err)
                );
              }
            });
          });

          longTaskObserver.observe({ entryTypes: ["longtask"] });
        } catch (e) {
          console.warn("Long Task observer not supported");
        }

        // 观察资源加载性能
        try {
          const resourceObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              if (entry.duration > 1000) {
                // 资源加载超过1秒
                console.warn("Slow resource:", {
                  name: entry.name,
                  duration: entry.duration,
                  size: (entry as any).transferSize,
                });
              }
            });
          });

          resourceObserver.observe({ entryTypes: ["resource"] });
        } catch (e) {
          console.warn("Resource observer not supported");
        }
      }
    };

    // 监控3D渲染性能
    const monitor3DPerformance = () => {
      let frameCount = 0;
      let lastTime = performance.now();

      const measureFPS = () => {
        frameCount++;
        const currentTime = performance.now();

        if (currentTime - lastTime >= 1000) {
          // 每秒测量一次
          const fps = frameCount;
          frameCount = 0;
          lastTime = currentTime;

          // 如果FPS过低，记录警告
          if (fps < 30) {
            console.warn("Low FPS detected:", fps);

            if (process.env.NODE_ENV === "production") {
              fetch("/api/analytics", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  type: "low-fps",
                  fps,
                  url: window.location.href,
                  timestamp: new Date().toISOString(),
                }),
              }).catch((err) => console.warn("Failed to send analytics:", err));
            }
          }
        }

        requestAnimationFrame(measureFPS);
      };

      // 只在球体页面监控FPS
      if (window.location.pathname.includes("/ball")) {
        requestAnimationFrame(measureFPS);
      }
    };

    // 监控内存使用情况
    const monitorMemory = () => {
      if ("performance" in window && "memory" in (performance as any)) {
        const memory = (performance as any).memory;

        setInterval(() => {
          const memoryInfo = {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit,
            usagePercentage:
              (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
          };

          // 如果内存使用超过80%，发出警告
          if (memoryInfo.usagePercentage > 80) {
            console.warn("High memory usage:", memoryInfo);

            if (process.env.NODE_ENV === "production") {
              fetch("/api/analytics", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  type: "high-memory",
                  memoryInfo,
                  url: window.location.href,
                  timestamp: new Date().toISOString(),
                }),
              }).catch((err) => console.warn("Failed to send analytics:", err));
            }
          }
        }, 10000); // 每10秒检查一次
      }
    };

    // 初始化所有监控
    loadWebVitals();
    monitor3DPerformance();
    monitorMemory();
  }, []);

  return null;
}
