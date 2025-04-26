"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { Participant } from "../types/types";
import { read, utils } from "xlsx";
import {
  saveParticipantsToStorage,
  getParticipantsFromStorage,
  clearParticipantsFromStorage,
} from "../utils/storageUtils";
import { generateRandomEnglishNames } from "../utils/nameGenerator";

// 简化的翻译函数类型
type TranslateFn = {
  (key: string, args?: object): string;
  rich?(key: string, args?: object): React.ReactNode;
};

interface ParticipantContextType {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  participantName: string;
  setParticipantName: React.Dispatch<React.SetStateAction<string>>;
  nameError: string;
  setNameError: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  addParticipant: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearLocalStorage: () => void;
  isCustomParticipants: boolean;
}

const ParticipantContext = createContext<ParticipantContextType | undefined>(
  undefined
);

export const ParticipantProvider: React.FC<{
  children: ReactNode;
  t: TranslateFn;
  onParticipantsChange?: (participants: Participant[]) => void;
}> = ({ children, t, onParticipantsChange }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantName, setParticipantName] = useState("");
  const [nameError, setNameError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [inputText, setInputText] = useState("");
  const [isCustomParticipants, setIsCustomParticipants] = useState(false);

  // 生成随机英文名单并保存到本地存储
  const generateAndSaveRandomNames = useCallback(() => {
    const count = 1000 + Math.floor(Math.random() * 1000); // 95-105个名字
    const randomNames = generateRandomEnglishNames(count);
    const newParticipants = randomNames.map((name) => ({ name }));
    setParticipants(newParticipants);
    setInputText(randomNames.join("\n"));
    setNameError("");
    setIsCustomParticipants(false);

    // 保存到本地存储
    saveParticipantsToStorage(newParticipants);
    return newParticipants;
  }, []);

  // 添加单个参与者
  const addParticipant = () => {
    if (!participantName.trim()) {
      setNameError(t("nameRequired"));
      return;
    }

    // 检查重复名称
    if (participants.some((p) => p.name === participantName.trim())) {
      setNameError(t("nameExists"));
      return;
    }

    const newParticipants = [...participants, { name: participantName.trim() }];
    setParticipants(newParticipants);
    setParticipantName("");
    setNameError("");
    setIsCustomParticipants(true);

    // 自动保存到本地存储
    saveParticipantsToStorage(newParticipants);
  };

  // 处理Excel导入
  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json<{ [key: string]: string }>(
        firstSheet
      );

      // 尝试找到包含名字的列
      let nameKey = "";
      if (jsonData.length > 0) {
        const firstRow = jsonData[0];
        const keys = Object.keys(firstRow);
        // 尝试找到名字、姓名、name等关键列
        nameKey = keys.find((k) => /name|名字|姓名/i.test(k)) || keys[0];
      }

      if (!nameKey) {
        setNameError(t("invalidFile"));
        return;
      }

      const names = jsonData
        .map((row) => String(row[nameKey]).trim())
        .filter((name) => name.length > 0);

      if (names.length === 0) {
        setNameError(t("noParticipants"));
        return;
      }

      const newParticipants = names.map((name) => ({ name }));
      setParticipants(newParticipants);
      setInputText(names.join("\n"));
      setNameError("");
      setIsCustomParticipants(true);

      // 保存到本地存储
      saveParticipantsToStorage(newParticipants);

      // 清空文件输入
      e.target.value = "";

      // 显示导入成功消息
      alert(t("importSuccess", { count: names.length }));
    } catch (err) {
      console.error("Excel import error:", err);
      setNameError(t("importError"));
    }
  };

  // 处理TXT导入
  const handleTxtImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const names = text
        .split(/\r?\n/)
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

      if (names.length === 0) {
        setNameError(t("noParticipants"));
        return;
      }

      const newParticipants = names.map((name) => ({ name }));
      setParticipants(newParticipants);
      setInputText(names.join("\n"));
      setNameError("");
      setIsCustomParticipants(true);

      // 保存到本地存储
      saveParticipantsToStorage(newParticipants);

      // 清空文件输入
      e.target.value = "";

      // 显示导入成功消息
      alert(t("importSuccess", { count: names.length }));
    } catch (err) {
      console.error("TXT import error:", err);
      setNameError(t("importError"));
    }
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension === "xlsx" || extension === "xls" || extension === "csv") {
      handleExcelImport(e);
    } else if (extension === "txt") {
      handleTxtImport(e);
    } else {
      setNameError(t("unsupportedFile"));
    }
  };

  // 清除本地存储并生成新的随机英文名单
  const handleClearLocalStorage = () => {
    clearParticipantsFromStorage();
    generateAndSaveRandomNames(); // 生成新随机名单并保存
    alert(t("clearSuccess"));
  };

  // 初始化：首先检查本地存储中的参与者，如果没有则生成随机英文名单并保存
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedParticipants = getParticipantsFromStorage();
      if (storedParticipants && storedParticipants.length > 0) {
        // 使用本地存储的参与者名单
        setParticipants(storedParticipants);
        setInputText(storedParticipants.map((p) => p.name).join("\n"));
        setIsCustomParticipants(true);
      } else {
        // 没有存储的参与者，生成随机英文名单并保存
        generateAndSaveRandomNames();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 通知参与者变化
  useEffect(() => {
    if (onParticipantsChange) {
      onParticipantsChange(participants);
    }
  }, [participants, onParticipantsChange]);

  return (
    <ParticipantContext.Provider
      value={{
        participants,
        setParticipants,
        participantName,
        setParticipantName,
        nameError,
        setNameError,
        searchTerm,
        setSearchTerm,
        inputText,
        setInputText,
        addParticipant,
        handleFileUpload,
        handleClearLocalStorage,
        isCustomParticipants,
      }}
    >
      {children}
    </ParticipantContext.Provider>
  );
};

export const useParticipants = () => {
  const context = useContext(ParticipantContext);
  if (context === undefined) {
    throw new Error(
      "useParticipants must be used within a ParticipantProvider"
    );
  }
  return context;
};
