"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";

interface FullScreenButtonProps {
  isFullScreen: boolean;
  toggleFullScreen: () => void;
}

export default function FullScreenButton({
  isFullScreen,
  toggleFullScreen,
}: FullScreenButtonProps) {
  const t = useTranslations("LuckyDraw");

  const handleClick = useCallback(() => {
    toggleFullScreen();
  }, [toggleFullScreen]);

  return (
    <button
      onClick={handleClick}
      className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-3 rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all z-50"
      title={isFullScreen ? t("exitFullScreen") : t("fullScreenMode")}
    >
      <FontAwesomeIcon icon={isFullScreen ? faCompress : faExpand} size="lg" />
    </button>
  );
}
