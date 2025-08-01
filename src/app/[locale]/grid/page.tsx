"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLotteryStore } from "@/utils/lotteryStore";
import { useLotteryUtils } from "@/utils/lotteryUtils";
import { LotteryState } from "@/types/types";
import GridLayout from "@/components/grid/GridLayout";
import ControlPanel from "@/components/common/ControlPanel";
import RightToolbar from "@/components/common/RightToolbar";
import DataManager from "@/components/common/DataManager";
import WinnerAnimation from "@/components/common/WinnerAnimation";
import SettingsModal from "@/components/common/SettingsModal";
import WinnerResultsModal from "@/components/common/WinnerResultsModal";
import HelpModal from "@/components/common/HelpModal";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import DynamicSEO from "@/components/SEO/DynamicSEO";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKeyboard, faHome } from "@fortawesome/free-solid-svg-icons";

// 快捷键显示组件
function ShortcutDisplay() {
  const t = useTranslations("Grid");
  return (
    <div className="fixed bottom-6 left-6 z-50 bg-purple-600/40 text-white p-3 rounded-lg shadow-xl backdrop-blur-sm text-xs border border-purple-300/30">
      <div className="flex items-center space-x-2 mb-1">
        <FontAwesomeIcon icon={faKeyboard} className="text-purple-300" />
        <span className="font-semibold text-purple-200">
          {t("shortcutsTitle")}
        </span>
      </div>
      <ul className="space-y-0.5">
        <li>
          <kbd className="px-1.5 py-0.5 bg-purple-400/30 rounded text-xs text-white font-mono">
            Space
          </kbd>
          : {t("spaceKeyDesc")}
        </li>
        <li>
          <kbd className="px-1.5 py-0.5 bg-purple-400/30 rounded text-xs text-white font-mono">
            Ctrl/Cmd+R
          </kbd>
          : {t("rKeyDesc")}
        </li>
        <li>
          <kbd className="px-1.5 py-0.5 bg-purple-400/30 rounded text-xs text-white font-mono">
            Esc
          </kbd>
          : {t("escKeyDesc")}
        </li>
      </ul>
    </div>
  );
}

export default function GridLotteryPage() {
  const t = useTranslations("Grid");
  const { locale } = useParams();
  const [isDataManagerOpen, setIsDataManagerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const {
    participants,
    winners,
    state,
    settings,
    resetLottery,
    loadFromStorage,
    loadSettings,
    loadHistoryWinners,
  } = useLotteryStore();

  const lotteryUtils = useLotteryUtils();

  // 确保客户端执行并完整恢复数据
  useEffect(() => {
    setIsClient(true);
    // 按顺序加载所有数据以确保完整恢复
    const initializeData = async () => {
      // 1. 先加载设置
      loadSettings();
      // 2. 然后加载参与者和中奖者数据
      loadFromStorage();
      // 3. 最后加载历史中奖记录
      loadHistoryWinners();
    };

    // 监听自动生成参与者事件
    const handleAutoGenerated = (event: CustomEvent) => {
      const { count } = event.detail;
      // 显示通知消息
      if (typeof window !== "undefined") {
        setTimeout(() => {
          alert(t("autoGeneratedParticipants", { count }));
        }, 500); // 延迟500ms以确保页面加载完成
      }
    };

    window.addEventListener(
      "autoGeneratedParticipants",
      handleAutoGenerated as EventListener
    );

    initializeData();

    return () => {
      window.removeEventListener(
        "autoGeneratedParticipants",
        handleAutoGenerated as EventListener
      );
    };
  }, [loadSettings, loadFromStorage, loadHistoryWinners, t]);

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

  // 处理数据导入
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

  // 键盘快捷键处理
  useEffect(() => {
    const handleGlobalKeyPress = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.code === "KeyR") {
        event.preventDefault();
        // handleReset();
      }
      // Esc键退出全屏
      if (event.code === "Escape" && isFullscreen) {
        event.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyPress);
    return () => window.removeEventListener("keydown", handleGlobalKeyPress);
  }, [handleReset, isFullscreen]);

  // Grid模块专用的开始抽奖逻辑
  const handleStartDrawing = () => {
    // 检查是否可以开始抽奖
    if (!lotteryUtils.canStartDrawing()) {
      return;
    }

    // 调用通用的开始抽奖逻辑，Grid的闪烁动画由GridLayout组件内部处理
    lotteryUtils.startDrawing(() => {
      console.log("🎯 网格开始闪烁动画");
      // GridLayout组件会监听state变化自动开始闪烁动画
    });
  };

  // Grid模块专用的停止抽奖逻辑
  const handleStopDrawing = () => {
    // 调用通用的停止抽奖逻辑
    lotteryUtils.stopDrawing(() => {
      console.log("⏹️ 网格停止闪烁动画");
      // GridLayout组件会监听state变化自动停止闪烁动画
    });
  };

  if (!isClient) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-indigo-500 text-white">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg">{t("initializingScene")}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
      relative w-full h-screen overflow-hidden bg-gradient-to-br from-purple-400 via-pink-500 to-indigo-500 grid-scrollbar-theme
      ${isFullscreen ? "cursor-none" : ""}
    `}
    >
      {/* Dynamic SEO Component */}
      <DynamicSEO
        participantCount={participants.length}
        winnerCount={winners.length}
        isDrawing={state !== LotteryState.IDLE}
        prizeTypes={[settings.prizeType]}
      />

      {/* 页面标题和描述 - 仅在非全屏模式显示 */}
      {!isFullscreen && (
        <div className="absolute top-4 left-4 z-30 text-white">
          <h1 className="text-2xl font-bold mb-2 text-white drop-shadow-md">
            {settings.pageTitle || t("title")}
          </h1>
          <p className="text-sm text-white/80 max-w-md drop-shadow-sm">
            {t("description")}
          </p>
        </div>
      )}

      {/* 右上角状态信息和语言切换器 - 仅在非全屏模式显示 */}
      {!isFullscreen && (
        <div className="absolute top-4 right-4 z-30 text-white text-right space-y-3">
          {/* 首页按钮和语言切换器 */}
          <div className="flex items-center justify-end space-x-3">
            <Link href={`/${locale}`}>
              <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white transition-all duration-200 shadow-lg text-sm">
                <FontAwesomeIcon icon={faHome} className="text-purple-300" />
                <span className="hidden sm:inline">{t("returnToHome")}</span>
              </button>
            </Link>
            <LanguageSwitcher />
          </div>

          {/* 状态信息 */}
          <div className="bg-purple-600/30 backdrop-blur-sm rounded-lg p-3 text-sm border border-purple-300/20">
            <div className="space-y-1">
              <div className="text-purple-100 font-medium">
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

      {/* 网格布局 */}
      <div className="absolute inset-0">
        <GridLayout />
      </div>

      {/* 控制面板 */}
      <ControlPanel
        module="grid"
        onStartDrawing={handleStartDrawing}
        onStopDrawing={handleStopDrawing}
      />

      <RightToolbar
        onImport={handleImport}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        onReset={handleReset}
        onHelp={() => setIsHelpOpen(true)}
        onSettings={() => setIsSettingsOpen(true)}
        onShowResults={() => setIsResultsOpen(true)}
      />

      <ShortcutDisplay />

      {/* 数据管理器 */}
      <DataManager
        isOpen={isDataManagerOpen}
        onClose={() => setIsDataManagerOpen(false)}
        module="grid"
      />

      {/* 设置模态框 */}
      <SettingsModal
        module="grid"
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* 中奖结果模态框 */}
      <WinnerResultsModal
        module="grid"
        isOpen={isResultsOpen}
        onClose={() => setIsResultsOpen(false)}
      />

      {/* 帮助模态框 */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        module="grid"
      />

      {/* 中奖动画 */}
      <WinnerAnimation module="grid" />

      {/* 欢迎/加载提示 */}
      {participants.length === 0 && state === LotteryState.IDLE && (
        <div className="absolute inset-0 flex items-center justify-center bg-purple-900/70 backdrop-blur-sm z-10">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-8 text-white text-center border border-purple-400/30 shadow-2xl">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-xl font-semibold mb-4 text-white drop-shadow-lg">
              {settings.pageTitle || t("title")}
            </h2>
            <p className="text-white/90 mb-6">{t("welcomeMessage")}</p>
            <button
              onClick={handleImport}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t("manageParticipants")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
