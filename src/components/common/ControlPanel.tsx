"use client";

import React, { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { useLotteryStore } from "@/utils/lotteryStore";
import { LotteryState } from "@/types/types";
import { useTranslations } from "next-intl";

interface ControlPanelProps {
  onStartDrawing: () => void;
  onStopDrawing: () => void;
  module: "ball" | "wheel" | "grid";
  className?: string;
}

export default function ControlPanel({
  onStartDrawing,
  onStopDrawing,
  module,
  className = "",
}: ControlPanelProps) {
  const t = useTranslations("common");
  const { state, participants, winners, settings } = useLotteryStore();

  // 计算可用参与者
  const getAvailableParticipants = useCallback(() => {
    if (settings.removeWinnersFromPool) {
      // 如果设置了移除中奖者，participants已经不包含中奖者
      return participants;
    } else {
      // 否则需要手动过滤
      return participants.filter(
        (p) => !winners.some((w) => w.name === p.name)
      );
    }
  }, [participants, winners, settings.removeWinnersFromPool]);

  // 键盘快捷键处理（空格键）
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        const availableCount = getAvailableParticipants().length;

        if (
          state === LotteryState.IDLE ||
          state === LotteryState.WINNER_SELECTED
        ) {
          if (availableCount > 0) {
            onStartDrawing();
          }
        } else if (state === LotteryState.DRAWING) {
          onStopDrawing();
        }
      }
    },
    [state, onStartDrawing, onStopDrawing, getAvailableParticipants]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // 处理抽奖按钮点击
  const handleDrawToggle = () => {
    const availableCount = getAvailableParticipants().length;

    if (state === LotteryState.IDLE || state === LotteryState.WINNER_SELECTED) {
      if (availableCount === 0) {
        alert(t("noParticipantsAlert"));
        return;
      }
      onStartDrawing();
    } else if (state === LotteryState.DRAWING) {
      onStopDrawing();
    }
  };

  // 获取按钮文字
  const getButtonText = () => {
    switch (state) {
      case LotteryState.DRAWING:
        return t("stopDrawing");
      case LotteryState.ANIMATING:
      case LotteryState.WINNER_SELECTED:
        return t("drawingInProgress");
      default:
        return t("startDrawing");
    }
  };

  // 获取按钮图标
  const getButtonIcon = () => {
    switch (state) {
      case LotteryState.DRAWING:
        return faStop;
      default:
        return faPlay;
    }
  };

  // 判断按钮是否禁用
  const isDrawButtonDisabled = () => {
    const availableCount = getAvailableParticipants().length;
    return (
      state === LotteryState.ANIMATING ||
      (state !== LotteryState.DRAWING && availableCount === 0)
    );
  };

  return (
    <div
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
    >
      {/* 主抽奖按钮 */}
      <motion.button
        key={state}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDrawToggle}
        disabled={isDrawButtonDisabled()}
        className={`
          px-8 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 ease-in-out
          flex items-center justify-center space-x-3 min-w-[220px] shadow-xl 
          focus:outline-none focus:ring-4 backdrop-blur-sm
          ${
            state === LotteryState.DRAWING
              ? "bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 focus:ring-red-400/50"
              : state === LotteryState.ANIMATING ||
                state === LotteryState.WINNER_SELECTED
              ? "bg-gray-500 cursor-not-allowed focus:ring-gray-400/50"
              : "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 focus:ring-yellow-400/50"
          }
          ${
            isDrawButtonDisabled() &&
            !(
              state === LotteryState.ANIMATING ||
              state === LotteryState.WINNER_SELECTED
            )
              ? "opacity-60 cursor-not-allowed"
              : ""
          }
        `}
      >
        <FontAwesomeIcon
          icon={getButtonIcon()}
          size="lg"
          className={`${
            state === LotteryState.DRAWING ? "animate-ping-slow" : ""
          }`}
        />
        <span className="tracking-wide">{getButtonText()}</span>
      </motion.button>
    </div>
  );
}
