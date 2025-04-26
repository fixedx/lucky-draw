"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // 语言切换处理函数
  const handleLanguageChange = (newLocale: string) => {
    const currentPath = pathname.split("/").slice(2).join("/");
    // 使用window.location.href实现跳转
    window.location.href = `/${newLocale}/${currentPath}`;
    setIsLangMenuOpen(false);
  };

  // 点击外部关闭语言下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setIsLangMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="absolute right-4 top-4 z-50" ref={langMenuRef}>
      <button
        className="px-3 py-2 text-white bg-indigo-600/80 hover:bg-indigo-600 rounded-md flex items-center gap-2 text-sm transition-colors shadow-lg backdrop-blur-sm"
        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
        aria-expanded={isLangMenuOpen}
        aria-haspopup="true"
      >
        {locale === "zh" ? "🇨🇳" : "🇺🇸"}
        <span className="font-medium">
          {locale === "zh" ? "中文" : "English"}
        </span>
        <svg
          className={`w-4 h-4 opacity-70 transition-transform ${
            isLangMenuOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isLangMenuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md shadow-lg overflow-hidden z-10 transition-opacity">
          <div className="py-1">
            <button
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                locale === "zh"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleLanguageChange("zh")}
            >
              <span className="text-base">🇨🇳</span>
              <span>中文</span>
            </button>
            <button
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                locale === "en"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleLanguageChange("en")}
            >
              <span className="text-base">🇺🇸</span>
              <span>English</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
