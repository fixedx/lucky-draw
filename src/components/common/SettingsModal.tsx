"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCog,
  faTrophy,
  faUsers,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useLotteryStore, type LotterySettings } from "@/utils/lotteryStore";
import { useTranslations } from "next-intl";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  module?: "ball" | "grid" | "wheel";
}

export default function SettingsModal({
  isOpen,
  onClose,
  module = "ball",
}: SettingsModalProps) {
  const t = useTranslations("common");
  const { settings, setSettings, loadSettings } = useLotteryStore();

  // 常见奖项类型的国际化键值
  const commonPrizeKeys = [
    "firstPrize",
    "secondPrize",
    "thirdPrize",
    "luckyPrize",
    "specialPrize",
    "excellentPrize",
    "participationPrize",
    "commemorativePrize",
  ];

  // 本地状态用于表单
  const [localSettings, setLocalSettings] = useState<LotterySettings>(settings);

  // 当弹窗打开时，加载最新设置并同步到本地状态
  useEffect(() => {
    if (isOpen) {
      const updatedSettings = { ...settings };
      // 转盘模式强制中奖人数为1
      if (module === "wheel") {
        updatedSettings.winnerCount = 1;
      }
      setLocalSettings(updatedSettings);
    }
  }, [isOpen, settings, module]);

  // 保存设置并关闭弹窗
  const handleSave = () => {
    const finalSettings = { ...localSettings };
    // 转盘模式确保中奖人数为1
    if (module === "wheel") {
      finalSettings.winnerCount = 1;
    }
    setSettings(finalSettings);
    onClose();
  };

  // 重置为默认设置
  const handleReset = () => {
    const defaultSettings: LotterySettings = {
      pageTitle: t("defaultPageTitle"),
      prizeType: t("defaultPrizeType"),
      winnerCount: module === "wheel" ? 1 : 3, // 转盘模式默认1人，其他模式默认3人
      removeWinnersFromPool: true,
    };
    setLocalSettings(defaultSettings);
  };

  // 更新本地设置
  const updateLocalSetting = <K extends keyof LotterySettings>(
    key: K,
    value: LotterySettings[K]
  ) => {
    // 转盘模式下禁止修改中奖人数
    if (module === "wheel" && key === "winnerCount") {
      return;
    }
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 弹窗内容 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-md mx-4 border border-white/20 shadow-2xl modal-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 标题栏 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCog} className="text-white text-xl" />
                <h2 className="text-xl font-bold text-white">
                  {t("lotterySettings")}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* 设置表单 */}
            <div className="space-y-6">
              {/* 页面标题 */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <FontAwesomeIcon icon={faTrophy} className="mr-2" />
                  {t("pageTitle")}
                </label>
                <input
                  type="text"
                  value={localSettings.pageTitle}
                  onChange={(e) =>
                    updateLocalSetting("pageTitle", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder={t("enterPageTitle")}
                />
              </div>

              {/* 抽奖名称 */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <FontAwesomeIcon icon={faTrophy} className="mr-2" />
                  {t("lotteryName")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={localSettings.prizeType}
                    onChange={(e) =>
                      updateLocalSetting("prizeType", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder={t("enterLotteryName")}
                    list="prize-types"
                  />
                  <datalist id="prize-types">
                    {commonPrizeKeys.map((key) => (
                      <option key={key} value={t(key)} />
                    ))}
                  </datalist>
                </div>
                {/* 快捷选择按钮 */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {commonPrizeKeys.slice(0, 4).map((key) => (
                    <button
                      key={key}
                      onClick={() => updateLocalSetting("prizeType", t(key))}
                      className={`px-3 py-1 rounded-md text-xs transition-colors ${
                        localSettings.prizeType === t(key)
                          ? "bg-blue-500 text-white"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {t(key)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 中奖人数 - 转盘模式下隐藏 */}
              {module !== "wheel" && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <FontAwesomeIcon icon={faUsers} className="mr-2" />
                    {t("winnerCount")}
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={localSettings.winnerCount}
                      onChange={(e) =>
                        updateLocalSetting(
                          "winnerCount",
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                    <span className="text-white text-sm">
                      {t("peopleUnit")}
                    </span>
                  </div>
                  {/* 快捷选择按钮 */}
                  <div className="flex gap-2 mt-2">
                    {[1, 3, 5, 10].map((count) => (
                      <button
                        key={count}
                        onClick={() => updateLocalSetting("winnerCount", count)}
                        className={`px-3 py-1 rounded-md text-xs transition-colors ${
                          localSettings.winnerCount === count
                            ? "bg-blue-500 text-white"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 转盘模式下显示说明 */}
              {module === "wheel" && (
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-blue-200 text-sm">
                    <FontAwesomeIcon icon={faUsers} />
                    <span className="font-medium">{t("wheelModeNotice")}</span>
                  </div>
                  <p className="text-blue-100 text-xs mt-1 opacity-90">
                    {t("wheelModeDescription")}
                  </p>
                </div>
              )}

              {/* 是否移除中奖者 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faTrash} className="text-white" />
                  <span className="text-white text-sm">
                    {t("removeWinnersFromPool")}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.removeWinnersFromPool}
                    onChange={(e) =>
                      updateLocalSetting(
                        "removeWinnersFromPool",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* 按钮组 */}
            <div className="flex space-x-3 mt-8">
              <button
                onClick={handleReset}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors border border-white/20"
              >
                {t("resetDefault")}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors border border-white/20"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg transition-all shadow-lg"
              >
                {t("save")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
