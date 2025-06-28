"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useLotteryStore } from "@/utils/lotteryStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faDownload,
  faTrash,
  faTimes,
  faFileExcel,
  faSpinner,
  faCheck,
  faExclamationTriangle,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

interface ExcelRow {
  name?: string;
  id?: string;
  avatar?: string;
  [key: string]: any;
}

interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
}

interface GridDataManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GridDataManager({
  isOpen,
  onClose,
}: GridDataManagerProps) {
  const t = useTranslations("GridDataManager");
  const {
    participants,
    winners,
    setParticipants,
    addParticipant,
    removeParticipant,
    generateSampleData,
  } = useLotteryStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  // 处理Excel文件解析
  const parseExcelFile = useCallback(
    (file: File): Promise<ExcelRow[]> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });

            // 读取第一个工作表
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // 转换为JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
            }) as any[][];

            if (jsonData.length < 2) {
              reject(new Error(t("excelNoData")));
              return;
            }

            const headers = jsonData[0] as string[];
            const rows = jsonData.slice(1);

            // 寻找可能的列名映射
            const columnMapping = {
              name: -1,
              id: -1,
              avatar: -1,
            };

            headers.forEach((header, index) => {
              const headerLower = header?.toString().toLowerCase() || "";

              // 姓名列匹配
              if (
                headerLower.includes("name") ||
                headerLower.includes("姓名") ||
                headerLower.includes("名字") ||
                headerLower.includes("参与者")
              ) {
                columnMapping.name = index;
              }

              // ID列匹配
              if (
                headerLower.includes("id") ||
                headerLower.includes("编号") ||
                headerLower.includes("工号") ||
                headerLower.includes("number")
              ) {
                columnMapping.id = index;
              }

              // 头像列匹配
              if (
                headerLower.includes("avatar") ||
                headerLower.includes("头像") ||
                headerLower.includes("photo") ||
                headerLower.includes("图片") ||
                headerLower.includes("image") ||
                headerLower.includes("pic")
              ) {
                columnMapping.avatar = index;
              }
            });

            // 如果没有找到姓名列，尝试第一列
            if (columnMapping.name === -1 && headers.length > 0) {
              columnMapping.name = 0;
            }

            const parsedRows: ExcelRow[] = rows
              .map((row) => {
                const result: ExcelRow = {};

                if (columnMapping.name >= 0) {
                  result.name = row[columnMapping.name]?.toString().trim();
                }

                if (columnMapping.id >= 0) {
                  result.id = row[columnMapping.id]?.toString().trim();
                }

                if (columnMapping.avatar >= 0) {
                  result.avatar = row[columnMapping.avatar]?.toString().trim();
                }

                return result;
              })
              .filter((row) => row.name && row.name.length > 0);

            resolve(parsedRows);
          } catch (error) {
            reject(new Error(t("excelParseError")));
          }
        };

        reader.onerror = () => reject(new Error(t("fileReadError")));
        reader.readAsArrayBuffer(file);
      });
    },
    [t]
  );

  // 处理文件导入
  const handleFileImport = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setImportResult(null);

      try {
        const rows = await parseExcelFile(file);

        if (rows.length === 0) {
          setImportResult({
            success: false,
            imported: 0,
            skipped: 0,
            errors: [t("noValidData")],
          });
          return;
        }

        // 构建新的参与者列表
        const newParticipants: string[] = [];
        const errors: string[] = [];
        let skipped = 0;

        // 存储头像信息到localStorage
        const avatarData: { [key: string]: string } = {};
        const existingAvatarData = JSON.parse(
          localStorage.getItem("participant_avatars") || "{}"
        );

        rows.forEach((row, index) => {
          if (!row.name) {
            skipped++;
            errors.push(t("rowMissingName", { row: index + 2 }));
            return;
          }

          // 检查是否已存在
          if (newParticipants.includes(row.name)) {
            skipped++;
            errors.push(t("duplicateName", { name: row.name }));
            return;
          }

          newParticipants.push(row.name);

          // 保存头像信息
          if (row.avatar) {
            avatarData[row.name] = row.avatar;
          }
        });

        // 保存头像数据到localStorage
        localStorage.setItem(
          "participant_avatars",
          JSON.stringify({
            ...existingAvatarData,
            ...avatarData,
          })
        );

        // 更新参与者列表
        setParticipants(newParticipants);

        setImportResult({
          success: true,
          imported: newParticipants.length,
          skipped,
          errors: errors.slice(0, 10), // 只显示前10个错误
        });
      } catch (error) {
        setImportResult({
          success: false,
          imported: 0,
          skipped: 0,
          errors: [error instanceof Error ? error.message : t("unknownError")],
        });
      } finally {
        setIsLoading(false);
      }
    },
    [parseExcelFile, setParticipants, t]
  );

  // 文件选择处理
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileImport(file);
      }
    },
    [handleFileImport]
  );

  // 拖拽处理
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragOver(false);

      const file = event.dataTransfer.files[0];
      if (
        file &&
        (file.type.includes("excel") ||
          file.type.includes("spreadsheet") ||
          file.name.endsWith(".xlsx") ||
          file.name.endsWith(".xls"))
      ) {
        handleFileImport(file);
      }
    },
    [handleFileImport]
  );

  // 导出示例Excel
  const exportSampleExcel = useCallback(() => {
    const sampleData = [
      {
        Name: t("sampleDataName1"),
        ID: "001",
        Avatar: "https://example.com/avatar1.jpg",
      },
      {
        Name: t("sampleDataName2"),
        ID: "002",
        Avatar: "https://example.com/avatar2.jpg",
      },
      { Name: t("sampleDataName3"), ID: "003", Avatar: "" },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      t("participantListSheet")
    );

    XLSX.writeFile(workbook, t("participantImportTemplate"));
  }, [t]);

  // 清空所有数据
  const handleClearAll = useCallback(() => {
    if (confirm(t("confirmClearAll"))) {
      setParticipants([]);
      localStorage.removeItem("participant_avatars");
      setImportResult(null);
    }
  }, [setParticipants, t]);

  // 添加参与者
  const handleAddParticipant = () => {
    const name = newParticipantName.trim();
    if (!name) {
      alert(t("participantNameRequired"));
      return;
    }

    if (participants.some((p) => p.name === name)) {
      alert(t("participantAlreadyExists"));
      return;
    }

    addParticipant(name);
    setNewParticipantName("");
  };

  // 开始编辑
  const startEditing = (index: number, name: string) => {
    setEditingIndex(index);
    setEditingName(name);
  };

  // 保存编辑
  const saveEdit = () => {
    const name = editingName.trim();
    if (!name) {
      alert(t("participantNameRequired"));
      return;
    }

    if (participants.some((p, i) => p.name === name && i !== editingIndex)) {
      alert(t("participantAlreadyExists"));
      return;
    }

    // 更新参与者名单
    const newNames = participants.map((p, i) =>
      i === editingIndex ? name : p.name
    );
    setParticipants(newNames);

    setEditingIndex(null);
    setEditingName("");
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingName("");
  };

  // 删除参与者
  const handleRemoveParticipant = (name: string) => {
    removeParticipant(name);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          className="bg-gradient-to-br from-purple-500/95 via-pink-500/95 to-indigo-500/95 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-purple-300/30"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 标题栏 */}
          <div className="flex items-center justify-between p-6 border-b border-purple-300/30 bg-gradient-to-r from-purple-600/50 to-indigo-600/50 text-white">
            <h2 className="text-2xl font-bold">{t("title")}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* 文件上传区域 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-white">
                {t("excelDataImport")}
              </h3>
              <div
                className={`
                  relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                  ${
                    dragOver
                      ? "border-purple-400 bg-purple-400/20"
                      : "border-white/30 hover:border-white/50 bg-white/10"
                  }
                  ${isLoading ? "opacity-50 pointer-events-none" : ""}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center space-y-3">
                    <FontAwesomeIcon
                      icon={faSpinner}
                      size="3x"
                      className="text-purple-400 animate-spin"
                    />
                    <span className="text-white/80">{t("processing")}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <FontAwesomeIcon
                      icon={faFileExcel}
                      size="3x"
                      className="text-white/60"
                    />
                    <div>
                      <p className="text-lg font-medium text-white">
                        {t("dragDropFile")}
                      </p>
                      <p className="text-sm text-white/70 mt-1">
                        {t("supportedFormats")}
                      </p>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg"
                    >
                      <FontAwesomeIcon icon={faUpload} className="mr-2" />
                      {t("selectFile")}
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* 手动添加参与者 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-white">
                {t("manualAddParticipant")}
              </h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newParticipantName}
                  onChange={(e) => setNewParticipantName(e.target.value)}
                  placeholder={t("inputParticipantNamePlaceholder")}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
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
                  {t("add")}
                </button>
                <button
                  onClick={generateSampleData}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg"
                >
                  {t("generateSampleData")}
                </button>
              </div>
            </div>

            {/* 参与者列表 */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {t("currentParticipants")} ({participants.length}
                  {t("peopleUnit")})
                </h3>
                <div className="space-x-2">
                  <button
                    onClick={exportSampleExcel}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm shadow-lg"
                  >
                    <FontAwesomeIcon icon={faDownload} className="mr-1" />
                    {t("downloadTemplate")}
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm shadow-lg"
                    disabled={participants.length === 0}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                    {t("clearAll")}
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
                          {editingIndex === index ? (
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
                                winners.some((w) => w.name === participant.name)
                                  ? "text-green-300"
                                  : "text-white"
                              }`}
                            >
                              {participant.name}
                              {winners.some(
                                (w) => w.name === participant.name
                              ) && (
                                <span className="ml-2 text-xs bg-green-500/30 text-green-200 px-2 py-1 rounded border border-green-400/30">
                                  {t("won")}
                                </span>
                              )}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {editingIndex === index ? (
                            <>
                              <button
                                onClick={saveEdit}
                                className="text-green-400 hover:text-green-300 p-1"
                              >
                                <FontAwesomeIcon icon={faCheck} size="sm" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <FontAwesomeIcon icon={faTimes} size="sm" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  startEditing(index, participant.name)
                                }
                                className="text-blue-400 hover:text-blue-300 p-1"
                              >
                                <FontAwesomeIcon icon={faEdit} size="sm" />
                              </button>
                              <button
                                onClick={() =>
                                  handleRemoveParticipant(participant.name)
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

            {/* 导入结果显示 */}
            {importResult && (
              <div className="mb-6">
                <div
                  className={`
                    border rounded-lg p-4 backdrop-blur-sm
                    ${
                      importResult.success
                        ? "border-green-300/30 bg-green-500/20"
                        : "border-red-300/30 bg-red-500/20"
                    }
                  `}
                >
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon
                      icon={
                        importResult.success ? faCheck : faExclamationTriangle
                      }
                      className={`w-5 h-5 mr-2 ${
                        importResult.success ? "text-green-400" : "text-red-400"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        importResult.success ? "text-green-300" : "text-red-300"
                      }`}
                    >
                      {importResult.success
                        ? t("importSuccess")
                        : t("importFailed")}
                    </span>
                  </div>

                  <div className="text-sm space-y-1">
                    <p
                      className={
                        importResult.success ? "text-green-200" : "text-red-200"
                      }
                    >
                      {t("importStats", {
                        imported: importResult.imported,
                        skipped: importResult.skipped,
                      })}
                    </p>

                    {importResult.errors.length > 0 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-red-300 hover:text-red-200">
                          {t("viewErrors")} ({importResult.errors.length})
                        </summary>
                        <ul className="mt-2 space-y-1 text-red-300">
                          {importResult.errors.map((error, index) => (
                            <li key={index} className="text-xs">
                              • {error}
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
