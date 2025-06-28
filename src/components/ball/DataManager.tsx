"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faFileAlt,
  faTimes,
  faCheck,
  faSpinner,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { useLotteryStore } from "@/utils/lotteryStore";
import {
  importFromTextFile,
  exportParticipantsToTxt,
  exportWinnersToTxt,
} from "@/utils/storageUtils";
import {
  PRESET_PARTICIPANT_LISTS,
  generateParticipantList,
} from "@/utils/nameGenerator";
import { useTranslations } from "next-intl";

interface DataManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DataManager({ isOpen, onClose }: DataManagerProps) {
  const t = useTranslations("Ball");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const {
    participants,
    winners,
    setParticipants,
    addParticipant,
    removeParticipant,
    generateSampleData,
  } = useLotteryStore();

  // 处理文件拖拽
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileImport(files[0]);
    }
  };

  // 处理文件导入
  const handleFileImport = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".txt")) {
      alert(t("textFileSupport"));
      return;
    }

    setIsProcessing(true);

    try {
      const names = await importFromTextFile(file);

      if (names.length === 0) {
        alert(t("noValidParticipants"));
        return;
      }

      setParticipants(names);
      alert(t("importSuccessMessage", { count: names.length }));
    } catch (error) {
      console.error("Import error:", error);
      alert(t("importFailed"));
    } finally {
      setIsProcessing(false);
    }
  };

  // 触发文件选择
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // 添加参与者
  const handleAddParticipant = () => {
    const name = newParticipantName.trim();
    if (!name) {
      alert(t("participantNameEmpty"));
      return;
    }

    if (participants.some((p) => p.name === name)) {
      alert(t("participantExists"));
      return;
    }

    addParticipant(name);
    setNewParticipantName("");
  };

  // 开始编辑
  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  // 保存编辑
  const saveEdit = () => {
    const name = editingName.trim();
    if (!name) {
      alert(t("participantNameEmpty"));
      return;
    }

    if (participants.some((p) => p.name === name && p.id !== editingId)) {
      alert(t("participantExists"));
      return;
    }

    // 更新参与者名单
    const updatedParticipants = participants.map((p) =>
      p.id === editingId ? { ...p, name } : p
    );

    const names = updatedParticipants.map((p) => p.name);
    setParticipants(names);

    setEditingId(null);
    setEditingName("");
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  // 导出参与者名单
  const handleExportParticipants = () => {
    const names = participants.map((p) => p.name);
    exportParticipantsToTxt(names);
  };

  // 导出中奖名单
  const handleExportWinners = () => {
    if (winners.length === 0) {
      alert(t("noWinners"));
      return;
    }

    const names = winners.map((w) => w.name);
    exportWinnersToTxt(names);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-orange-500/95 via-yellow-500/95 to-red-500/95 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-yellow-300/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 标题栏 */}
            <div className="flex items-center justify-between p-6 border-b border-yellow-300/30 bg-gradient-to-r from-orange-600/50 to-red-600/50 text-white">
              <h2 className="text-2xl font-bold">{t("importData")}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* 文件导入区域 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  {t("importParticipantList")}
                </h3>
                <div
                  className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                    ${
                      dragActive
                        ? "border-yellow-400 bg-yellow-400/20"
                        : "border-white/30 hover:border-white/50 bg-white/10"
                    }
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileImport(file);
                    }}
                    className="hidden"
                  />

                  {isProcessing ? (
                    <div className="flex flex-col items-center space-y-3">
                      <FontAwesomeIcon
                        icon={faSpinner}
                        size="3x"
                        className="text-yellow-400 animate-spin"
                      />
                      <span className="text-white/80">
                        {t("fileProcessing")}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-3">
                      <FontAwesomeIcon
                        icon={faFileAlt}
                        size="3x"
                        className="text-white/60"
                      />
                      <div>
                        <p className="text-lg font-medium text-white">
                          {t("dragDropFile")}
                        </p>
                        <p className="text-sm text-white/70 mt-1">
                          {t("supportedFiles")}
                        </p>
                      </div>
                      <button
                        onClick={triggerFileSelect}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg"
                      >
                        <FontAwesomeIcon icon={faUpload} className="mr-2" />
                        {t("selectFile")}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 手动添加参与者 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  {t("manualAddParticipants")}
                </h3>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newParticipantName}
                    onChange={(e) => setNewParticipantName(e.target.value)}
                    placeholder={t("inputParticipantName")}
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddParticipant();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddParticipant}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg"
                  >
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    {t("addButton")}
                  </button>
                  <button
                    onClick={generateSampleData}
                    className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg"
                  >
                    {t("generateSample")}
                  </button>
                </div>
              </div>

              {/* 参与者列表 */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {t("participantList")} ({participants.length}{" "}
                    {t("peopleUnit")})
                  </h3>
                  <div className="space-x-2">
                    <button
                      onClick={handleExportParticipants}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm shadow-lg"
                      disabled={participants.length === 0}
                    >
                      {t("exportParticipants")}
                    </button>
                    <button
                      onClick={handleExportWinners}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm shadow-lg"
                      disabled={winners.length === 0}
                    >
                      {t("exportWinners")} ({winners.length})
                    </button>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm">
                  {participants.length === 0 ? (
                    <div className="p-8 text-center text-white/70">
                      {t("noParticipantsMessage")}
                    </div>
                  ) : (
                    <div className="divide-y divide-white/10">
                      {participants.map((participant, index) => (
                        <div
                          key={participant.id}
                          className={`p-3 flex items-center justify-between hover:bg-white/10 transition-colors ${
                            winners.some((w) => w.name === participant.name)
                              ? "bg-green-500/20"
                              : "bg-white/5"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-white/60 w-8">
                              {index + 1}.
                            </span>
                            {editingId === participant.id ? (
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="px-2 py-1 bg-white/10 border border-white/20 rounded text-sm text-white"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") saveEdit();
                                  if (e.key === "Escape") cancelEdit();
                                }}
                                autoFocus
                              />
                            ) : (
                              <span
                                className={`font-medium ${
                                  winners.some(
                                    (w) => w.name === participant.name
                                  )
                                    ? "text-green-300"
                                    : "text-white"
                                }`}
                              >
                                {participant.name}
                                {winners.some(
                                  (w) => w.name === participant.name
                                ) && (
                                  <span className="ml-2 text-xs bg-green-500/30 text-green-200 px-2 py-1 rounded border border-green-400/30">
                                    {t("hasWon")}
                                  </span>
                                )}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            {editingId === participant.id ? (
                              <>
                                <button
                                  onClick={saveEdit}
                                  className="text-green-400 hover:text-green-300 p-1"
                                >
                                  <FontAwesomeIcon icon={faCheck} size="sm" />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="text-white/60 hover:text-white p-1"
                                >
                                  <FontAwesomeIcon icon={faTimes} size="sm" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    startEditing(
                                      participant.id,
                                      participant.name
                                    )
                                  }
                                  className="text-blue-400 hover:text-blue-300 p-1"
                                >
                                  <FontAwesomeIcon icon={faEdit} size="sm" />
                                </button>
                                <button
                                  onClick={() =>
                                    removeParticipant(participant.id)
                                  }
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <FontAwesomeIcon icon={faTrash} size="sm" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="flex justify-end space-x-3 p-6 border-t border-white/20 bg-gradient-to-r from-orange-600/30 to-red-600/30">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg transition-all duration-200 shadow-lg"
              >
                {t("close")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
