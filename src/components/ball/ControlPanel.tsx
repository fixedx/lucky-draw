"use client";

import React, { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faStop,
  faRotateRight,
  faUpload,
  faDownload,
  faExpand,
  faCompress,
} from "@fortawesome/free-solid-svg-icons";
import { useLotteryStore } from "@/utils/lotteryStore";
import { LotteryState } from "@/types/types";
import { useTranslations } from "next-intl";

interface ControlPanelProps {
  onImport: () => void;
  onExport: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export default function ControlPanel({
  onImport,
  onExport,
  onToggleFullscreen,
  isFullscreen,
}: ControlPanelProps) {
  const t = useTranslations("Ball");
  const {
    state,
    participants,
    winners,
    isSpinning,
    startDrawing,
    stopDrawing,
    resetLottery,
  } = useLotteryStore();

  // 键盘快捷键
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case "Space":
          event.preventDefault();
          if (
            state === LotteryState.IDLE ||
            state === LotteryState.WINNER_SELECTED
          ) {
            if (getAvailableParticipants().length > 0) {
              startDrawing();
            }
          } else if (state === LotteryState.DRAWING) {
            stopDrawing();
          }
          break;
        case "KeyR":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleReset();
          }
          break;
        case "Escape":
          if (isFullscreen) {
            onToggleFullscreen();
          }
          break;
      }
    },
    [state, isFullscreen, startDrawing, stopDrawing, onToggleFullscreen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const getAvailableParticipants = () => {
    return participants.filter((p) => !winners.some((w) => w.name === p.name));
  };

  const handleDrawToggle = () => {
    const availableParticipants = getAvailableParticipants();

    if (availableParticipants.length === 0) {
      alert("没有可抽奖的参与者了！");
      return;
    }

    if (state === LotteryState.DRAWING) {
      stopDrawing();
    } else {
      startDrawing();
    }
  };

  const handleReset = () => {
    if (winners.length > 0) {
      const confirmed = confirm("确定要重置抽奖吗？这将清除所有中奖记录。");
      if (confirmed) {
        resetLottery();
      }
    } else {
      resetLottery();
    }
  };

  const getButtonText = () => {
    switch (state) {
      case LotteryState.DRAWING:
        return t("stopDrawing");
      case LotteryState.ANIMATING:
        return t("ballSpinning");
      default:
        return t("startDrawing");
    }
  };

  const getButtonIcon = () => {
    switch (state) {
      case LotteryState.DRAWING:
        return faStop;
      case LotteryState.ANIMATING:
        return faStop;
      default:
        return faPlay;
    }
  };

  const isDrawButtonDisabled = () => {
    return (
      state === LotteryState.ANIMATING ||
      getAvailableParticipants().length === 0
    );
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20">
        <div className="flex items-center space-x-4">
          {/* 导入按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onImport}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            disabled={isSpinning}
          >
            <FontAwesomeIcon icon={faUpload} size="sm" />
            <span>{t("importData")}</span>
          </motion.button>

          {/* 主要抽奖按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDrawToggle}
            disabled={isDrawButtonDisabled()}
            className={`
              px-8 py-3 rounded-xl text-white font-semibold text-lg transition-all duration-300
              flex items-center space-x-3 min-w-[180px] justify-center
              ${
                state === LotteryState.DRAWING
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : "bg-green-500 hover:bg-green-600"
              }
              ${isDrawButtonDisabled() ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <FontAwesomeIcon
              icon={getButtonIcon()}
              size="sm"
              className={state === LotteryState.DRAWING ? "animate-pulse" : ""}
            />
            <span>{getButtonText()}</span>
          </motion.button>

          {/* 重置按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            disabled={isSpinning}
          >
            <FontAwesomeIcon icon={faRotateRight} size="sm" />
            <span>{t("resetSphere")}</span>
          </motion.button>

          {/* 导出按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExport}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            disabled={winners.length === 0}
          >
            <FontAwesomeIcon icon={faDownload} size="sm" />
            <span>{t("exportData")}</span>
          </motion.button>

          {/* 全屏切换 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleFullscreen}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <FontAwesomeIcon
              icon={isFullscreen ? faCompress : faExpand}
              size="sm"
            />
            <span>
              {isFullscreen ? t("exitFullscreen") : t("fullscreenMode")}
            </span>
          </motion.button>
        </div>
      </div>

      {/* 状态信息栏 */}
      <div className="mt-3 bg-black/20 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
        <div className="flex justify-between items-center space-x-6">
          <div className="flex items-center space-x-4">
            <span className="text-blue-300">
              {t("totalParticipants")}: {participants.length}
            </span>
            <span className="text-green-300">
              {t("totalWinners")}: {winners.length}
            </span>
            <span className="text-yellow-300">
              {t("remainingPool")}: {getAvailableParticipants().length}
            </span>
          </div>

          <div className="text-gray-300 text-xs">
            <div>{t("shortcutsTitle")}:</div>
            <div className="flex space-x-3">
              <span>
                {t("spaceKey")}: {t("spaceKeyDesc")}
              </span>
              <span>
                {t("rKey")}: {t("rKeyDesc")}
              </span>
              <span>
                {t("escKey")}: {t("escKeyDesc")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
