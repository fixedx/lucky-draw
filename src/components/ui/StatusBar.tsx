"use client";

import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useDraw } from "../../context/DrawContext";
import { useParticipants } from "../../context/ParticipantContext";

export default function StatusBar() {
  const t = useTranslations("LuckyDraw");
  const { status, error } = useDraw();
  const { participants } = useParticipants();

  return (
    <>
      <div className="fixed left-5 bottom-5 bg-gradient-to-b from-[#0f1c3f]/80 to-[#081231]/80 px-4 py-2 rounded-lg shadow-lg border border-blue-900/30 backdrop-blur-sm z-10">
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              status === "idle"
                ? "bg-blue-500"
                : status === "processing"
                ? "bg-yellow-500 animate-pulse"
                : "bg-green-500"
            }`}
          ></div>
          <span className="text-sm text-white">
            {status === "idle"
              ? t("readyToStart")
              : status === "processing"
              ? t("drawInProgress")
              : t("drawCompleted")}
          </span>
          <span className="text-sm text-gray-300 ml-3">
            {participants.length} {t("participantsLoaded")}
          </span>
        </div>
      </div>

      {error && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-900/80 text-white px-4 py-2 rounded-lg shadow-lg border border-red-700 z-20 animate-fadeIn backdrop-blur-sm">
          <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />
          {error}
        </div>
      )}
    </>
  );
}
