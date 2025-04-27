"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import { Participant } from "../types/types";
import {
  generateRandomParticipants,
  selectRandomWinners,
} from "../utils/nameGenerator";
import {
  getParticipantsFromStorage,
  saveParticipantsToStorage,
  saveOriginalParticipantsToStorage,
  getOriginalParticipantsFromStorage,
  saveWinnersToStorage,
  resetAllDrawStorage,
} from "../utils/storageUtils";

// 默认参与者数量
const DEFAULT_PARTICIPANT_COUNT = 100;

interface DrawContextType {
  winners: Participant[];
  setWinners: React.Dispatch<React.SetStateAction<Participant[]>>;
  isDrawing: boolean;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  status: "idle" | "processing" | "completed";
  setStatus: React.Dispatch<
    React.SetStateAction<"idle" | "processing" | "completed">
  >;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  winnerCount: number;
  setWinnerCount: React.Dispatch<React.SetStateAction<number>>;
  drawSpeed: number;
  setDrawSpeed: React.Dispatch<React.SetStateAction<number>>;
  autoDrawDuration: number;
  setAutoDrawDuration: React.Dispatch<React.SetStateAction<number>>;
  enableSound: boolean;
  setEnableSound: React.Dispatch<React.SetStateAction<boolean>>;
  participantCount: number;
  setParticipantCount: React.Dispatch<React.SetStateAction<number>>;
  startDraw: () => void;
  completeDrawing: () => void;
  participants: Participant[];
  setCustomParticipants: (participants: Participant[]) => void;
  resetToRandomParticipants: () => void;
  isCustomParticipants: boolean;
  prizeTitle: string;
  setPrizeTitle: React.Dispatch<React.SetStateAction<string>>;
  allWinners: Participant[];
  resetDrawHistory: () => void;
}

const DrawContext = createContext<DrawContextType | undefined>(undefined);

export const DrawProvider: React.FC<{
  children: ReactNode;
  initialParticipants?: Participant[];
  onComplete?: (selectedWinners: Participant[]) => void;
}> = ({ children, initialParticipants, onComplete }) => {
  const [winners, setWinners] = useState<Participant[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "completed">(
    "idle"
  );
  const [error, setError] = useState<string>("");
  const [winnerCount, setWinnerCount] = useState(1);
  const [drawSpeed, setDrawSpeed] = useState(5);
  const [autoDrawDuration, setAutoDrawDuration] = useState(3);
  const [enableSound, setEnableSound] = useState(true);
  const [participantCount, setParticipantCount] = useState(
    DEFAULT_PARTICIPANT_COUNT
  );
  const [prizeTitle, setPrizeTitle] = useState<string>("The first prize");
  const [allWinners, setAllWinners] = useState<Participant[]>([]);

  // 用于存储用户上传的自定义参与者名单
  const [customParticipants, setCustomParticipants] = useState<
    Participant[] | null
  >(null);

  // 是否使用自定义名单标志
  const isCustomParticipants = customParticipants !== null;

  // 检查并从localStorage加载参与者名单和所有中奖者
  useEffect(() => {
    // 只在客户端运行时执行本地存储操作
    if (typeof window !== "undefined") {
      const storedParticipants = getParticipantsFromStorage();
      if (storedParticipants && storedParticipants.length > 0) {
        setCustomParticipants(storedParticipants);

        // 保存一份原始参与者名单用于重置
        if (storedParticipants.length > 0) {
          saveOriginalParticipantsToStorage(storedParticipants);
        }
      }
    }
  }, []);

  // 设置自定义参与者并保存到localStorage
  const handleSetCustomParticipants = useCallback(
    (participants: Participant[]) => {
      if (participants.length > 0) {
        setCustomParticipants(participants);
        saveParticipantsToStorage(participants);

        // 保存原始名单（如果尚未保存）
        saveOriginalParticipantsToStorage(participants);
      }
    },
    []
  );

  // 重置为随机生成的参与者名单
  const resetToRandomParticipants = useCallback(() => {
    setCustomParticipants(null);
  }, []);

  // 生成随机参与者名单
  const participants = useMemo(() => {
    // 优先使用自定义上传的名单
    if (customParticipants) {
      return customParticipants;
    }

    // 其次使用外部提供的初始参与者列表
    if (initialParticipants && initialParticipants.length > 0) {
      return initialParticipants;
    }

    // 最后，生成指定数量的随机参与者
    return generateRandomParticipants(participantCount);
  }, [customParticipants, initialParticipants, participantCount]);

  // 开始抽奖过程
  const startDraw = useCallback(() => {
    if (participants.length === 0) {
      setError("没有参与者");
      return;
    }

    if (participants.length < winnerCount) {
      setError("参与者数量少于获奖人数");
      return;
    }

    setIsDrawing(true);
    setStatus("processing");
    setError("");
    setWinners([]);

    // 添加声音效果
    if (enableSound) {
      const audio = new Audio("/lucky-draw-sound.mp3");
      audio.volume = 0.5;
      audio.play().catch((e) => console.log("音频播放失败:", e));
    }
  }, [participants, winnerCount, enableSound]);

  // 完成抽奖
  const completeDrawing = useCallback(() => {
    // 立即设置为完成状态，减少显示的延迟
    setStatus("completed");

    // 从参与者名单中随机选择获奖者
    const selectedWinners = selectRandomWinners(participants, winnerCount);

    setWinners(selectedWinners);
    setIsDrawing(false);

    // 更新全局中奖者列表
    setAllWinners((prevWinners) => {
      const newWinners = [...prevWinners];

      // 添加新的中奖者（避免重复）
      selectedWinners.forEach((winner) => {
        if (!newWinners.some((w) => w.name === winner.name)) {
          newWinners.push(winner);
        }
      });

      return newWinners;
    });

    // 从参与者名单中移除中奖者
    if (customParticipants) {
      const updatedParticipants = customParticipants.filter(
        (participant) =>
          !selectedWinners.some((winner) => winner.name === participant.name)
      );

      setCustomParticipants(updatedParticipants);
      saveParticipantsToStorage(updatedParticipants);
    }

    // 保存中奖名单到本地存储
    saveWinnersToStorage(selectedWinners);

    // 触发外部完成回调
    onComplete?.(selectedWinners);

    // 添加声音效果
    if (enableSound) {
      try {
        const audio = new Audio("/win-sound.mp3");
        audio.volume = 0.5;
        audio.play().catch((e) => console.log("完成音频播放失败:", e));
      } catch (e) {
        console.error("音频播放错误:", e);
      }
    }
  }, [
    participants,
    winnerCount,
    customParticipants,
    onComplete,
    enableSound,
    setCustomParticipants,
  ]);

  // 重置抽奖历史
  const resetDrawHistory = useCallback(() => {
    // 重置所有存储
    resetAllDrawStorage();

    // 重置状态
    setStatus("idle");
    setWinners([]);
    setAllWinners([]);

    // 恢复原始参与者名单
    const originalParticipants = getOriginalParticipantsFromStorage();
    if (originalParticipants && originalParticipants.length > 0) {
      setCustomParticipants(originalParticipants);
    }
  }, []);

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();

        // 如果赢家展示模态框正在显示，则不响应键盘事件
        if (status === "completed") return;

        // 根据当前抽奖状态切换抽奖状态
        if (isDrawing) {
          completeDrawing();
        } else {
          // 只有在有足够参与者时才开始抽奖
          if (participants.length >= winnerCount) {
            startDraw();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isDrawing,
    participants.length,
    winnerCount,
    status,
    completeDrawing,
    startDraw,
  ]);

  return (
    <DrawContext.Provider
      value={{
        winners,
        setWinners,
        isDrawing,
        setIsDrawing,
        status,
        setStatus,
        error,
        setError,
        winnerCount,
        setWinnerCount,
        drawSpeed,
        setDrawSpeed,
        autoDrawDuration,
        setAutoDrawDuration,
        enableSound,
        setEnableSound,
        participantCount,
        setParticipantCount,
        startDraw,
        completeDrawing,
        participants,
        setCustomParticipants: handleSetCustomParticipants,
        resetToRandomParticipants,
        isCustomParticipants,
        prizeTitle,
        setPrizeTitle,
        allWinners,
        resetDrawHistory,
      }}
    >
      {children}
    </DrawContext.Provider>
  );
};

export const useDraw = () => {
  const context = useContext(DrawContext);
  if (context === undefined) {
    throw new Error("useDraw must be used within a DrawProvider");
  }
  return context;
};
