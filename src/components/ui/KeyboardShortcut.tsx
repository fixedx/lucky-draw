"use client";

import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKeyboard } from "@fortawesome/free-solid-svg-icons";

export default function KeyboardShortcut() {
  const t = useTranslations("LuckyDraw");

  return (
    <div className="fixed left-5 top-5 bg-gradient-to-b from-[#0f1c3f]/80 to-[#081231]/80 px-4 py-2 rounded-lg shadow-lg border border-blue-900/30 backdrop-blur-sm z-10">
      <div className="flex items-center">
        <FontAwesomeIcon icon={faKeyboard} className="mr-2 text-blue-400" />
        <span className="text-sm">{t("spacebarShortcut")}</span>
      </div>
    </div>
  );
}
