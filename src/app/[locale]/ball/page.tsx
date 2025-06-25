"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useLotteryStore } from "@/utils/lotteryStore";
import { LotteryState } from "@/types/types";
import ControlPanel from "@/components/ball/ControlPanel";
import RightToolbar from "@/components/ball/RightToolbar";
import DataManager from "@/components/ball/DataManager";
import WinnerAnimation from "@/components/ball/WinnerAnimation";
import SettingsModal from "@/components/ball/SettingsModal";
import WinnerResultsModal from "@/components/ball/WinnerResultsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKeyboard } from "@fortawesome/free-solid-svg-icons";

// 动态导入3D场景组件以避免SSR问题
const SphereScene = dynamic(() => import("@/components/3d/SphereScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
        <div className="text-lg">加载3D场景中...</div>
        <div className="text-sm text-white/70 mt-2">正在初始化Three.js引擎</div>
      </div>
    </div>
  ),
});

// Shortcut display component
function ShortcutDisplay() {
  const t = useTranslations("Ball");
  return (
    <div className="fixed bottom-6 left-6 z-50 bg-red-600/40 text-yellow-100 p-3 rounded-lg shadow-xl backdrop-blur-sm text-xs border border-yellow-300/30">
      <div className="flex items-center space-x-2 mb-1">
        <FontAwesomeIcon icon={faKeyboard} className="text-yellow-300" />
        <span className="font-semibold text-yellow-200">
          {t("shortcutsTitle")}
        </span>
      </div>
      <ul className="space-y-0.5">
        <li>
          <kbd className="px-1.5 py-0.5 bg-yellow-400/30 rounded text-xs text-yellow-100 font-mono">
            Space
          </kbd>
          : {t("spaceKeyDesc")}
        </li>
        <li>
          <kbd className="px-1.5 py-0.5 bg-yellow-400/30 rounded text-xs text-yellow-100 font-mono">
            Ctrl/Cmd+R
          </kbd>
          : {t("rKeyDesc")}
        </li>
        <li>
          <kbd className="px-1.5 py-0.5 bg-yellow-400/30 rounded text-xs text-yellow-100 font-mono">
            Esc
          </kbd>
          : {t("escKeyDesc")}
        </li>
      </ul>
    </div>
  );
}

export default function BallLotteryPage() {
  const t = useTranslations("Ball");
  const [isDataManagerOpen, setIsDataManagerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const {
    participants,
    winners,
    loadFromStorage,
    resetLottery,
    state,
    settings,
    loadSettings,
  } = useLotteryStore();

  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true);
    loadFromStorage();
    loadSettings();
  }, []); // 移除依赖项，只在组件挂载时执行一次

  // 处理全屏切换
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error("Error attempting to enable fullscreen:", err);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
        })
        .catch((err) => {
          console.error("Error attempting to exit fullscreen:", err);
        });
    }
  };

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // 处理导入数据
  const handleImport = () => {
    setIsDataManagerOpen(true);
  };

  const handleReset = useCallback(() => {
    if (winners.length > 0 || participants.length > 0) {
      const confirmed = confirm(t("confirmResetMessage"));
      if (confirmed) {
        resetLottery();
      }
    }
  }, [winners, participants, resetLottery, t]);

  // Keyboard shortcut for Reset (Ctrl/Cmd + R)
  useEffect(() => {
    const handleGlobalKeyPress = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.code === "KeyR") {
        event.preventDefault();
        handleReset();
      }
      // Esc for fullscreen is handled by RightToolbar now or can be global here too
      if (event.code === "Escape" && isFullscreen) {
        event.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyPress);
    return () => window.removeEventListener("keydown", handleGlobalKeyPress);
  }, [handleReset, isFullscreen]); // Added isFullscreen dependency

  // WebGL支持检测
  const checkWebGLSupport = () => {
    if (typeof window === "undefined") return true;

    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      return !!gl;
    } catch {
      return false;
    }
  };

  const webGLSupported = checkWebGLSupport();

  if (!isClient) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg">{t("initializingScene")}</div>
        </div>
      </div>
    );
  }

  if (!webGLSupported) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-black text-white p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">{t("webglNotSupported")}</h1>
          <p className="text-gray-300 mb-6">{t("browserUpgrade")}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {t("reload")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
      relative w-full h-screen overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500
      ${isFullscreen ? "cursor-none" : ""}
    `}
    >
      {/* 页面标题和描述 - 仅在非全屏模式显示 */}
      {!isFullscreen && (
        <div className="absolute top-4 left-4 z-30 text-yellow-200">
          <h1 className="text-2xl font-bold mb-2 text-yellow-100 drop-shadow-md">
            {settings.pageTitle || t("title")}
          </h1>
          <p className="text-sm text-yellow-200 max-w-md drop-shadow-sm">
            {t("description")}
          </p>
        </div>
      )}

      {/* 右上角状态信息 - 仅在非全屏模式显示 */}
      {!isFullscreen && (
        <div className="absolute top-4 right-4 z-30 text-yellow-100 text-right">
          <div className="bg-red-600/30 backdrop-blur-sm rounded-lg p-3 text-sm border border-yellow-300/20">
            <div className="space-y-1">
              <div className="text-yellow-200 font-medium">
                {t("totalParticipants")}: {participants.length}
              </div>
              <div className="text-green-300 font-medium">
                {t("totalWinners")}: {winners.length}
              </div>
              <div className="text-orange-300 font-medium">
                {t("remainingPool")}: {participants.length - winners.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D球体场景 */}
      <div className="absolute inset-0">
        <SphereScene />
      </div>

      {/* 控制面板 */}
      <ControlPanel />

      <RightToolbar
        onImport={handleImport}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        onReset={handleReset}
        onHelp={() =>
          alert(t("helpFeatureComingSoon") || "Help feature coming soon!")
        }
        onSettings={() => setIsSettingsOpen(true)}
        onShowResults={() => setIsResultsOpen(true)}
      />

      <ShortcutDisplay />

      {/* 数据管理器 */}
      <DataManager
        isOpen={isDataManagerOpen}
        onClose={() => setIsDataManagerOpen(false)}
      />

      {/* 设置弹窗 */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* 中奖结果弹窗 */}
      <WinnerResultsModal
        isOpen={isResultsOpen}
        onClose={() => setIsResultsOpen(false)}
      />

      {/* 中奖动画 */}
      <WinnerAnimation />

      {/* 加载提示 */}
      {participants.length === 0 && state === LotteryState.IDLE && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-white text-center">
            <div className="text-4xl mb-4">🎲</div>
            <h2 className="text-xl font-semibold mb-4">
              {settings.pageTitle || t("title")}
            </h2>
            <p className="text-gray-300 mb-6">{t("welcomeMessage")}</p>
            <button
              onClick={handleImport}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              {t("manageParticipants")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
