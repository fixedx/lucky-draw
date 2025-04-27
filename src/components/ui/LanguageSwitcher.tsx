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

  // 获取当前语言的显示信息
  const getLocaleDisplay = () => {
    switch (locale) {
      case "zh":
        return { flag: "🇨🇳", name: "中文" };
      case "fr":
        return { flag: "🇫🇷", name: "Français" };
      case "de":
        return { flag: "🇩🇪", name: "Deutsch" };
      case "es":
        return { flag: "🇪🇸", name: "Español" };
      case "ko":
        return { flag: "🇰🇷", name: "한국어" };
      case "ja":
        return { flag: "🇯🇵", name: "日本語" };
      case "pt":
        return { flag: "🇵🇹", name: "Português" };
      case "ru":
        return { flag: "🇷🇺", name: "Русский" };
      default:
        return { flag: "🇺🇸", name: "English" };
    }
  };

  const currentLocale = getLocaleDisplay();

  return (
    <div className="absolute right-4 top-4 z-50" ref={langMenuRef}>
      <button
        className="px-3 py-2 text-white bg-indigo-600/80 hover:bg-indigo-600 rounded-md flex items-center gap-2 text-sm transition-colors shadow-lg backdrop-blur-sm"
        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
        aria-expanded={isLangMenuOpen}
        aria-haspopup="true"
      >
        {currentLocale.flag}
        <span className="font-medium">{currentLocale.name}</span>
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
        <div className="absolute right-0 mt-2 w-44 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 transition-opacity max-h-[400px] overflow-y-auto custom-scrollbar">
          <div className="py-1 cursor-pointer">
            <button
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                locale === "en"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
              onClick={() => handleLanguageChange("en")}
            >
              <span className="text-base">🇺🇸</span>
              <span>English</span>
            </button>
            <button
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                locale === "zh"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
              onClick={() => handleLanguageChange("zh")}
            >
              <span className="text-base">🇨🇳</span>
              <span>中文</span>
            </button>

            <button
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                locale === "fr"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
              onClick={() => handleLanguageChange("fr")}
            >
              <span className="text-base">🇫🇷</span>
              <span>Français</span>
            </button>
            <button
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                locale === "de"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
              onClick={() => handleLanguageChange("de")}
            >
              <span className="text-base">🇩🇪</span>
              <span>Deutsch</span>
            </button>
            <button
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                locale === "es"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
              onClick={() => handleLanguageChange("es")}
            >
              <span className="text-base">🇪🇸</span>
              <span>Español</span>
            </button>
            <button
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                locale === "pt"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
              onClick={() => handleLanguageChange("pt")}
            >
              <span className="text-base">🇵🇹</span>
              <span>Português</span>
            </button>
            <button
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                locale === "ru"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
              onClick={() => handleLanguageChange("ru")}
            >
              <span className="text-base">🇷🇺</span>
              <span>Русский</span>
            </button>
            <button
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                locale === "ko"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
              onClick={() => handleLanguageChange("ko")}
            >
              <span className="text-base">🇰🇷</span>
              <span>한국어</span>
            </button>
            <button
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                locale === "ja"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
              onClick={() => handleLanguageChange("ja")}
            >
              <span className="text-base">🇯🇵</span>
              <span>日本語</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
