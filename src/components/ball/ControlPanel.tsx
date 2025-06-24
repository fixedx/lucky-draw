"use client";

import React, { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { useLotteryStore } from "@/utils/lotteryStore";
import { LotteryState } from "@/types/types";
import { useTranslations } from "next-intl";

// Props are removed as this component will now only handle the draw toggle button
// and its state comes directly from the Zustand store.
export default function ControlPanel() {
  const t = useTranslations("Ball");
  const { state, participants, winners, startDrawing, stopDrawing } =
    useLotteryStore();

  const getAvailableParticipants = useCallback(() => {
    return participants.filter((p) => !winners.some((w) => w.id === p.id));
  }, [participants, winners]);

  // Keyboard shortcut for Space to start/stop drawing
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
            startDrawing();
          }
        } else if (state === LotteryState.DRAWING) {
          stopDrawing();
        }
      }
    },
    [state, startDrawing, stopDrawing, getAvailableParticipants]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const handleDrawToggle = () => {
    const availableCount = getAvailableParticipants().length;

    if (state === LotteryState.IDLE || state === LotteryState.WINNER_SELECTED) {
      if (availableCount === 0) {
        alert(t("noParticipantsAlert"));
        return;
      }
      startDrawing();
    } else if (state === LotteryState.DRAWING) {
      stopDrawing();
    }
  };

  const getButtonText = () => {
    switch (state) {
      case LotteryState.DRAWING:
        return t("stopDrawing");
      case LotteryState.ANIMATING:
      case LotteryState.WINNER_SELECTED: // Consider what to show during/after winner animation
        return t("drawingInProgress"); // Or a specific text for winner selected phase
      default:
        return t("startDrawing");
    }
  };

  const getButtonIcon = () => {
    switch (state) {
      case LotteryState.DRAWING:
        return faStop;
      default:
        return faPlay;
    }
  };

  const isDrawButtonDisabled = () => {
    const availableCount = getAvailableParticipants().length;
    return (
      state === LotteryState.ANIMATING ||
      (state !== LotteryState.DRAWING && availableCount === 0)
    );
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      {/* Main Draw Toggle Button */}
      <motion.button
        key={state} // Add key to re-trigger animation on state change if desired
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDrawToggle}
        disabled={isDrawButtonDisabled()}
        className={`
          px-8 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 ease-in-out
          flex items-center justify-center space-x-3 min-w-[220px] shadow-xl 
          focus:outline-none focus:ring-4
          ${
            state === LotteryState.DRAWING
              ? "bg-red-500 hover:bg-red-600 focus:ring-red-400/50"
              : state === LotteryState.ANIMATING ||
                state === LotteryState.WINNER_SELECTED
              ? "bg-gray-500 cursor-not-allowed focus:ring-gray-400/50"
              : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-400/50"
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
