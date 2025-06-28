"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

interface LanguageSwitcherProps {
  className?: string;
  variant?: "light" | "dark";
}

export default function LanguageSwitcher({
  className = "",
  variant = "dark",
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${langCode}`);
    router.push(newPathname);
    setIsOpen(false);
  };

  // 根据变体选择样式
  const buttonStyles =
    variant === "light"
      ? "bg-gray-800/80 hover:bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-lg px-3 py-2 text-white transition-all duration-200 shadow-lg"
      : "bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white transition-all duration-200 shadow-lg";

  const dropdownStyles =
    variant === "light"
      ? "bg-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-2xl z-50 min-w-48 overflow-hidden"
      : "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl z-50 min-w-48 overflow-hidden";

  const itemStyles =
    variant === "light" ? "hover:bg-gray-700/50" : "hover:bg-white/10";

  const activeStyles =
    variant === "light"
      ? "bg-blue-500/30 text-blue-200"
      : "bg-yellow-500/20 text-yellow-200";

  const textColor = "text-white"; // 两种变体都使用白色文字，因为背景都是深色半透明

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 ${buttonStyles}`}
      >
        <FontAwesomeIcon icon={faGlobe} className="text-yellow-300" />
        <span className="text-sm font-medium">{currentLanguage.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">
          {currentLanguage.name}
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-xs transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* 下拉菜单 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`absolute top-full mt-2 right-0 ${dropdownStyles}`}
            >
              <div className="py-2">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full px-4 py-2 text-left flex items-center space-x-3 ${itemStyles} transition-colors ${
                      locale === language.code ? activeStyles : textColor
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-sm font-medium">{language.name}</span>
                    {locale === language.code && (
                      <div
                        className={`ml-auto w-2 h-2 ${
                          variant === "light" ? "bg-blue-400" : "bg-yellow-400"
                        } rounded-full`}
                      ></div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
