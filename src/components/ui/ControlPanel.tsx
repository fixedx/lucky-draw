"use client";

import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { useDraw } from "../../context/DrawContext";
import { useParticipants } from "../../context/ParticipantContext";

export default function ControlPanel() {
  const t = useTranslations("LuckyDraw");
  const { isDrawing, winnerCount, startDraw, completeDrawing } = useDraw();
  const { participants } = useParticipants();

  return (
    <div className="fixed left-1/2 bottom-5 transform -translate-x-1/2 flex gap-4 z-10">
      <button
        onClick={startDraw}
        disabled={isDrawing || participants.length < winnerCount}
        className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
          isDrawing || participants.length < winnerCount
            ? "bg-gray-700/60 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white shadow-lg hover:shadow-indigo-500/30"
        }`}
      >
        {isDrawing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
            {t("drawing")}
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faPlay} className="mr-2" />
            {t("startDraw")}
          </>
        )}
      </button>
      <button
        onClick={completeDrawing}
        disabled={!isDrawing}
        className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
          !isDrawing
            ? "bg-gray-700/60 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-red-500/30"
        }`}
      >
        <FontAwesomeIcon icon={faStop} className="mr-2" />
        {t("stopDraw")}
      </button>
    </div>
  );
}
