"use client";

import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faExpand,
  faCompress,
  faUsers,
  faRotateRight,
  faCog,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { useLotteryStore } from "@/utils/lotteryStore";
import { useTranslations } from "next-intl";

interface RightToolbarProps {
  onImport: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onReset: () => void;
  onHelp: () => void;
  onSettings: () => void;
  onShowResults: () => void;
}

const iconButtonClasses =
  "w-14 h-14 rounded-full text-white flex items-center justify-center transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50";
const iconSize = "lg" as const;

export default function RightToolbar({
  onImport,
  onToggleFullscreen,
  isFullscreen,
  onReset,
  onHelp,
  onSettings,
  onShowResults,
}: RightToolbarProps) {
  const t = useTranslations("common");
  const { winners, historyWinners } = useLotteryStore();

  const toolbarVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        type: "spring",
        stiffness: 120,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="fixed bottom-10 right-6 z-50 flex flex-col space-y-3"
      variants={toolbarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Help Button */}
      <motion.button
        variants={itemVariants}
        onClick={onHelp}
        className={`${iconButtonClasses} bg-gradient-to-br from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700`}
        aria-label={t("help")}
        title={t("help")}
      >
        <FontAwesomeIcon icon={faQuestionCircle} size={iconSize} />
      </motion.button>

      {/* Fullscreen Button */}
      <motion.button
        variants={itemVariants}
        onClick={onToggleFullscreen}
        className={`${iconButtonClasses} bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700`}
        aria-label={isFullscreen ? t("exitFullscreen") : t("fullscreenMode")}
        title={isFullscreen ? t("exitFullscreen") : t("fullscreenMode")}
      >
        <FontAwesomeIcon
          icon={isFullscreen ? faCompress : faExpand}
          size={iconSize}
        />
      </motion.button>

      {/* Data/Participants Button */}
      <motion.button
        variants={itemVariants}
        onClick={onImport}
        className={`${iconButtonClasses} bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700`}
        aria-label={t("manageParticipants")}
        title={t("manageParticipants")}
      >
        <FontAwesomeIcon icon={faUsers} size={iconSize} />
      </motion.button>

      {/* Reset Button */}
      <motion.button
        variants={itemVariants}
        onClick={onReset}
        disabled={winners.length === 0}
        className={`${iconButtonClasses} bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 
                      ${
                        winners.length === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
        aria-label={t("resetLottery")}
        title={t("resetLottery")}
      >
        <FontAwesomeIcon icon={faRotateRight} size={iconSize} />
      </motion.button>

      {/* Results Button */}
      <motion.button
        variants={itemVariants}
        onClick={onShowResults}
        className={`${iconButtonClasses} bg-gradient-to-br from-yellow-600 to-amber-700 hover:from-yellow-700 hover:to-amber-800 relative`}
        aria-label={t("viewWinnerResults")}
        title={t("viewWinnerResults")}
      >
        <FontAwesomeIcon icon={faTrophy} size={iconSize} />
        {historyWinners.length > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center border border-yellow-300">
            <span className="text-yellow-100 text-xs font-bold">
              {historyWinners.length}
            </span>
          </div>
        )}
      </motion.button>

      {/* Settings Button */}
      <motion.button
        variants={itemVariants}
        onClick={onSettings}
        className={`${iconButtonClasses} bg-gradient-to-br from-amber-600 to-yellow-700 hover:from-amber-700 hover:to-yellow-800`}
        aria-label={t("settings")}
        title={t("settings")}
      >
        <FontAwesomeIcon icon={faCog} size={iconSize} />
      </motion.button>
    </motion.div>
  );
}
