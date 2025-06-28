"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useLotteryStore } from "@/utils/lotteryStore";
import { LotteryState, Participant } from "@/types/types";

// 闪烁阶段枚举
enum FlashingPhase {
  INITIAL = "initial", // 初始慢速闪烁 (0.6-0.8秒/次)
  ACCELERATING = "accelerating", // 加速阶段 (0.3秒到0.05秒)
  STOPPED = "stopped", // 停止闪烁
}

// 生成随机颜色作为头像背景
function generateAvatarColor(name: string): string {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-lime-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-fuchsia-500",
    "bg-rose-500",
    "bg-sky-500",
    "bg-amber-500",
    "bg-gray-500",
  ];

  // 根据姓名生成一致的颜色
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// 获取姓名首字母
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// 参与者卡片组件
interface ParticipantCardProps {
  participant: Participant;
  isFlashing: boolean;
  isWinner: boolean;
  onClick?: () => void;
}

function ParticipantCard({
  participant,
  isFlashing,
  isWinner,
  onClick,
}: ParticipantCardProps) {
  const avatarColor = generateAvatarColor(participant.name);

  // 从localStorage获取头像数据
  const getAvatarUrl = (name: string): string | undefined => {
    try {
      const avatarData = JSON.parse(
        localStorage.getItem("participant_avatars") || "{}"
      );
      return avatarData[name] || undefined;
    } catch {
      return undefined;
    }
  };

  const avatarUrl = getAvatarUrl(participant.name);
  const colorClass = generateAvatarColor(participant.name);
  const initials = getInitials(participant.name);

  return (
    <div
      className={`
        relative p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer transform
        ${
          isFlashing
            ? "border-orange-400 bg-gradient-to-br from-orange-200 via-yellow-200 to-orange-300 shadow-2xl scale-110 animate-bounce z-20"
            : "border-purple-200/40 bg-white/30 hover:border-purple-500 hover:bg-white/60 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] hover:z-10 backdrop-blur-sm"
        }
        ${isWinner ? "ring-4 ring-green-500 ring-offset-2 bg-green-50" : ""}
      `}
      style={{
        transform: isFlashing ? "scale(1.1) rotateZ(1deg)" : "scale(1)",
        boxShadow: isFlashing
          ? "0 25px 50px -12px rgba(255, 165, 0, 0.5), 0 0 0 4px rgba(255, 165, 0, 0.3)"
          : undefined,
      }}
      onClick={onClick}
    >
      {/* 闪烁时的动态光环效果 */}
      {isFlashing && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 opacity-20 animate-pulse"></div>
      )}

      {/* 头像区域 */}
      <div className="flex flex-col items-center space-y-2 relative z-10">
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={participant.name}
              className={`
                w-12 h-12 rounded-full object-cover border-2 transition-all duration-300
                ${
                  isFlashing
                    ? "border-orange-400 shadow-lg scale-110"
                    : "border-purple-200/50 hover:border-purple-500 hover:shadow-md"
                }
              `}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
          ) : null}

          <div
            className={`
              w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-300
              ${colorClass}
              ${avatarUrl ? "hidden" : "flex"}
              ${
                isFlashing
                  ? "scale-110 shadow-lg animate-pulse"
                  : "hover:shadow-md"
              }
            `}
          >
            {initials}
          </div>
        </div>

        {/* 姓名 */}
        <span
          className={`
            text-sm font-medium text-center leading-tight transition-all duration-300
            ${
              isFlashing
                ? "text-orange-800 font-bold scale-105"
                : "text-gray-700 hover:text-purple-700 hover:font-semibold"
            }
          `}
        >
          {participant.name}
        </span>
      </div>

      {/* 增强的闪烁效果指示器 */}
      {isFlashing && (
        <>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
          {/* 四角光点效果 */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-orange-300 rounded-full corner-light"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-300 rounded-full corner-light animation-delay-150"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-300 rounded-full corner-light animation-delay-300"></div>
        </>
      )}

      {/* 中奖指示器 */}
      {isWinner && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
          <span className="text-white text-sm">🏆</span>
        </div>
      )}
    </div>
  );
}

export default function GridLayout() {
  const t = useTranslations("Grid");
  const { participants, winners, state, startDrawing, stopDrawing } =
    useLotteryStore();

  const [flashingParticipants, setFlashingParticipants] = useState<Set<string>>(
    new Set()
  );
  const [flashingPhase, setFlashingPhase] = useState<FlashingPhase>(
    FlashingPhase.INITIAL
  );
  const [flashInterval, setFlashInterval] = useState<number>(700); // 初始间隔0.7秒

  // 使用useRef保存最新的状态值，避免闭包问题
  const stateRef = useRef(state);
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  // 更新状态引用
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // 现在store已经真正删除了中奖者，直接使用participants即可
  const availableParticipants = participants;

  // 检查是否超过100人限制
  const hasExceededLimit = participants.length > 100;

  // 计算网格列数
  const getGridColumns = (count: number): string => {
    if (count <= 10)
      return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";
    if (count <= 50)
      return "grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10";
    if (count <= 100)
      return "grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12";
    return "grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15";
  };

  // 清除所有定时器和间隔器
  const clearAllTimers = useCallback(() => {
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current.clear();
    timeoutsRef.current.clear();
  }, []);

  // 随机选择参与者进行闪烁
  const selectRandomParticipant = useCallback(() => {
    if (participants.length === 0) return;

    const randomIndex = Math.floor(Math.random() * participants.length);
    const selectedParticipant = participants[randomIndex];

    setFlashingParticipants(new Set([selectedParticipant.id]));

    // 短暂闪烁后清除
    const timeoutId = setTimeout(() => {
      setFlashingParticipants(new Set());
    }, 300);

    timeoutsRef.current.add(timeoutId);
  }, [participants]);

  // 处理抽奖状态变化
  useEffect(() => {
    // 清除之前的所有定时器
    clearAllTimers();

    if (state === LotteryState.DRAWING) {
      // 开始抽奖：匀速闪烁
      setFlashingPhase(FlashingPhase.INITIAL);

      // 固定闪烁间隔 - 匀速
      const fixedInterval = 200; // 200ms固定间隔
      setFlashInterval(fixedInterval);

      const intervalId = setInterval(selectRandomParticipant, fixedInterval);
      intervalsRef.current.add(intervalId);
    } else {
      // 停止闪烁
      setFlashingPhase(FlashingPhase.STOPPED);
      setFlashingParticipants(new Set());
      clearAllTimers();
    }

    return () => {
      clearAllTimers();
    };
  }, [state, selectRandomParticipant, clearAllTimers]);

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (state === LotteryState.IDLE) {
          startDrawing();
        } else if (state === LotteryState.DRAWING) {
          stopDrawing();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [state, startDrawing, stopDrawing]);

  if (participants.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-xl">{t("noParticipants")}</p>
        </div>
      </div>
    );
  }

  // 移除这个检查，因为现在已中奖者已经从participants中删除

  return (
    <div className="h-full p-6 overflow-y-auto">
      {/* 100人限制警告 */}
      {hasExceededLimit && (
        <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                网格模式限制最多100个参与者，当前有{participants.length}
                个参与者。建议删除多余参与者或使用球体模式。
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className={`
        grid gap-2 auto-rows-max
        ${getGridColumns(participants.length)}
      `}
      >
        {participants.map((participant) => {
          const isFlashing = flashingParticipants.has(participant.id);

          return (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              isFlashing={isFlashing}
              isWinner={false} // 参与者都不是中奖者，因为中奖者已被删除
            />
          );
        })}
      </div>

      {/* 状态指示器 */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40">
        {state === LotteryState.DRAWING && (
          <div className="bg-yellow-500 text-white px-6 py-3 rounded-full shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span className="font-medium">{t("drawingInitial")}</span>
            </div>
          </div>
        )}

        {state === LotteryState.WINNER_SELECTED && (
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🎉</span>
              <span className="font-medium">{t("drawingComplete")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
