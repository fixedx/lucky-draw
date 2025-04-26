"use client";

import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { useCallback } from "react";

interface ConfigButtonProps {
  onClick: () => void;
}

export default function ConfigButton({ onClick }: ConfigButtonProps) {
  const t = useTranslations("LuckyDraw");

  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <button
      onClick={handleClick}
      className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all z-50"
      title={t("settings")}
    >
      <FontAwesomeIcon icon={faCog} size="lg" />
    </button>
  );
}
