"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faUserGroup,
  faFileUpload,
  faRandom,
  faUserPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useParticipants } from "../../context/ParticipantContext";

interface ParticipantModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export default function ParticipantModal({
  showModal,
  setShowModal,
}: ParticipantModalProps) {
  const t = useTranslations("LuckyDraw");

  const {
    participants,
    participantName,
    setParticipantName,
    nameError,
    addParticipant,
    handleFileUpload,
    handleClearLocalStorage,
    isCustomParticipants,
  } = useParticipants();

  // 参与者输入组件
  const ParticipantInput = useMemo(
    () => (
      <>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addParticipant()}
            placeholder={t("enterName")}
            className="flex-1 px-3 py-2 bg-[#1a2544] border border-blue-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addParticipant}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            title={t("addParticipant")}
          >
            <FontAwesomeIcon icon={faUserPlus} />
          </button>
        </div>

        {nameError && <p className="text-red-400 text-sm">{nameError}</p>}
      </>
    ),
    [participantName, nameError, t, addParticipant, setParticipantName]
  );

  // 名单管理组件
  const ParticipantManagement = useMemo(
    () => (
      <div className="space-y-4 mb-6">
        {/* 优化上传按钮，使其更加明显 */}
        <div className="mb-4">
          <button
            onClick={() =>
              document.getElementById("participant-file-upload")?.click()
            }
            className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-lg transition-colors shadow-lg transform hover:scale-[1.02] border border-indigo-700/50"
          >
            <FontAwesomeIcon
              icon={faFileUpload}
              className="text-xl mr-3 animate-pulse"
            />
            <span className="text-lg font-semibold">
              {t("uploadParticipants")}
            </span>
          </button>
          <input
            id="participant-file-upload"
            type="file"
            accept=".xlsx,.xls,.csv,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <p className="text-xs text-center mt-2 text-blue-300">
            {t("supportedFileFormats")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            className="flex items-center justify-center py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            onClick={handleClearLocalStorage}
          >
            <FontAwesomeIcon icon={faRandom} className="mr-2" />
            {t("generateRandom")}
          </button>

          <button
            onClick={handleClearLocalStorage}
            className="flex items-center justify-center py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            disabled={!isCustomParticipants}
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            {t("clearList")}
          </button>
        </div>

        <div className="border border-blue-900/30 rounded-lg p-3 bg-[#0a142e]/50 mt-2">
          <div className="text-xs text-gray-400 mb-1">
            {t("currentListStatus")}：
          </div>
          <div className="text-sm text-blue-300">
            {isCustomParticipants ? (
              <span>
                {t("usingCustomList")} ({participants.length}
                {t("peopleUnit")})
                {localStorage.getItem("lucky-draw-participants")
                  ? ` [${t("savedToLocal")}]`
                  : ""}
              </span>
            ) : (
              <span>
                {t("usingRandomList")} ({participants.length}
                {t("peopleUnit")}) [{t("savedToLocal")}]
              </span>
            )}
          </div>
        </div>
      </div>
    ),
    [
      t,
      handleFileUpload,
      handleClearLocalStorage,
      participants.length,
      isCustomParticipants,
    ]
  );

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-b from-[#111a35] to-[#0a1228] p-6 rounded-xl w-full max-w-md shadow-xl border border-blue-900/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FontAwesomeIcon
              icon={faUserGroup}
              className="mr-2 text-blue-400"
            />
            {t("participants")}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 参与者管理 */}
          <div className="space-y-3">
            {ParticipantInput}
            {ParticipantManagement}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setShowModal(false)}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-colors"
            >
              {t("close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
