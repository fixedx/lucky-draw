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
} from "@fortawesome/free-solid-svg-icons";
import { useLotteryStore } from "@/utils/lotteryStore";
import { useTranslations } from "next-intl";

interface RightToolbarProps {
  onImport: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onReset: () => void; // Renamed from handleReset for clarity
  // Placeholder functions for new buttons
  onHelp: () => void;
  onSettings: () => void;
}

const iconButtonClasses =
  "w-14 h-14 rounded-full text-white flex items-center justify-center transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50";
const iconSize = "lg"; // fa-lg is 1.33em, fa-xl is 1.6em. Let's use lg.

export default function RightToolbar({
  onImport,
  onToggleFullscreen,
  isFullscreen,
  onReset,
  onHelp,
  onSettings,
}: RightToolbarProps) {
  const t = useTranslations("Ball"); // Or a more general namespace if needed
  const { winners } = useLotteryStore(); // To disable reset if no winners, etc.

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
        className={`${iconButtonClasses} bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700`}
        aria-label={t("help") || "Help"}
        title={t("help") || "Help"}
      >
        <FontAwesomeIcon icon={faQuestionCircle} size={iconSize} />
      </motion.button>

      {/* Fullscreen Button */}
      <motion.button
        variants={itemVariants}
        onClick={onToggleFullscreen}
        className={`${iconButtonClasses} bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700`}
        aria-label={
          isFullscreen
            ? t("exitFullscreen") || "Exit Fullscreen"
            : t("fullscreenMode") || "Fullscreen"
        }
        title={
          isFullscreen
            ? t("exitFullscreen") || "Exit Fullscreen"
            : t("fullscreenMode") || "Fullscreen"
        }
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
        className={`${iconButtonClasses} bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700`}
        aria-label={t("manageParticipants") || "Manage Participants"}
        title={t("manageParticipants") || "Manage Participants"}
      >
        <FontAwesomeIcon icon={faUsers} size={iconSize} />
      </motion.button>

      {/* Reset Button */}
      <motion.button
        variants={itemVariants}
        onClick={onReset}
        disabled={winners.length === 0} // Example: disable if no winners to reset
        className={`${iconButtonClasses} bg-gradient-to-br from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 
                      ${
                        winners.length === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
        aria-label={t("resetLottery") || "Reset Lottery"}
        title={t("resetLottery") || "Reset Lottery"}
      >
        <FontAwesomeIcon icon={faRotateRight} size={iconSize} />
      </motion.button>

      {/* Settings Button */}
      <motion.button
        variants={itemVariants}
        onClick={onSettings}
        className={`${iconButtonClasses} bg-gradient-to-br from-gray-500 to-blue-gray-600 hover:from-gray-600 hover:to-blue-gray-700`}
        aria-label={t("settings") || "Settings"}
        title={t("settings") || "Settings"}
      >
        <FontAwesomeIcon icon={faCog} size={iconSize} />
      </motion.button>
    </motion.div>
  );
}
