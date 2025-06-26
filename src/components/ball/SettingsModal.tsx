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
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const t = useTranslations("Ball");
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
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  // 保存设置并关闭弹窗
  const handleSave = () => {
    setSettings(localSettings);
    onClose();
  };

  // 重置为默认设置
  const handleReset = () => {
    const defaultSettings: LotterySettings = {
      pageTitle: t("defaultPageTitle"),
      prizeType: t("defaultPrizeType"),
      winnerCount: 1,
      removeWinnersFromPool: true,
    };
    setLocalSettings(defaultSettings);
  };

  // 更新本地设置
  const updateLocalSetting = <K extends keyof LotterySettings>(
    key: K,
    value: LotterySettings[K]
  ) => {
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 弹窗内容 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-md mx-4 border border-white/20 shadow-2xl"
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

              {/* 中奖人数 */}
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
                  <span className="text-white text-sm">{t("peopleUnit")}</span>
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
                      {t("peopleUnit")}
                    </button>
                  ))}
                </div>
              </div>

              {/* 是否移除中奖者 */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.removeWinnersFromPool}
                    onChange={(e) =>
                      updateLocalSetting(
                        "removeWinnersFromPool",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div className="flex items-center text-white">
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    <span>{t("removeWinnersFromPool")}</span>
                  </div>
                </label>
                <p className="text-white/70 text-xs mt-1 ml-7">
                  {t("removeWinnersNote")}
                </p>
              </div>
            </div>

            {/* 按钮组 */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-white rounded-lg transition-colors text-sm"
              >
                {t("resetDefault")}
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-white rounded-lg transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  {t("save")}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
