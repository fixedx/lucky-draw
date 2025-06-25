"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faTrophy,
  faUsers,
  faMedal,
  faClock,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { useLotteryStore } from "@/utils/lotteryStore";
import { useTranslations } from "next-intl";

interface WinnerResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WinnerResultsModal({
  isOpen,
  onClose,
}: WinnerResultsModalProps) {
  const t = useTranslations("Ball");
  const { currentRoundWinners, settings, clearCurrentRound } =
    useLotteryStore();

  // 格式化时间
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // 清空当前轮次记录
  const handleClearRound = () => {
    clearCurrentRound();
    onClose();
  };

  // 导出中奖名单
  const handleExportWinners = () => {
    if (currentRoundWinners.length === 0) {
      alert("没有中奖记录可以导出");
      return;
    }

    // 创建导出内容
    const timestamp = new Date().toLocaleString("zh-CN");
    const exportContent = [
      `# ${settings.prizeType} 中奖名单`,
      `导出时间：${timestamp}`,
      `中奖人数：${currentRoundWinners.length} 人`,
      "",
      "序号\t姓名\t奖项\t中奖时间",
      ...currentRoundWinners.map(
        (winner, index) =>
          `${index + 1}\t${winner.name}\t${winner.prizeType}\t${formatTime(
            winner.roundTime
          )}`
      ),
    ].join("\n");

    // 创建并下载文件
    const blob = new Blob([exportContent], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${settings.prizeType}_中奖名单_${new Date()
      .toLocaleDateString("zh-CN")
      .replace(/\//g, "-")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-lg mx-4 border border-white/20 shadow-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 标题栏 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon
                  icon={faTrophy}
                  className="text-yellow-400 text-xl"
                />
                <h2 className="text-xl font-bold text-white">中奖结果</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* 奖项信息 */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 mb-6 border border-yellow-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-yellow-300 flex items-center">
                    <FontAwesomeIcon icon={faMedal} className="mr-2" />
                    {settings.prizeType}
                  </h3>
                  <p className="text-white/70 text-sm mt-1">
                    本轮中奖人数：{currentRoundWinners.length} 人
                  </p>
                </div>
                {currentRoundWinners.length > 0 && (
                  <div className="text-right text-white/70 text-sm">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faClock} className="mr-1" />
                      {formatTime(currentRoundWinners[0].roundTime)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 中奖名单 */}
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {currentRoundWinners.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🎲</div>
                  <p className="text-white/70">暂无中奖记录</p>
                  <p className="text-white/50 text-sm mt-2">
                    开始抽奖后，中奖结果将显示在这里
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {currentRoundWinners.map((winner, index) => (
                    <motion.div
                      key={`${winner.id}-${winner.roundTime}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {winner.name}
                          </p>
                          <p className="text-white/60 text-xs">
                            {winner.prizeType}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-yellow-400">
                          <FontAwesomeIcon
                            icon={faTrophy}
                            className="mr-1 text-sm"
                          />
                          <span className="text-sm font-medium">获奖</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* 统计信息 */}
            {currentRoundWinners.length > 0 && (
              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">
                      {currentRoundWinners.length}
                    </div>
                    <div className="text-white/70 text-sm">获奖人数</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {settings.prizeType}
                    </div>
                    <div className="text-white/70 text-sm">奖项等级</div>
                  </div>
                </div>
              </div>
            )}

            {/* 按钮组 */}
            <div className="flex justify-between mt-6">
              {currentRoundWinners.length > 0 && (
                <button
                  onClick={handleClearRound}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors text-sm border border-red-500/30"
                >
                  清空本轮记录
                </button>
              )}

              <div className="flex space-x-3 ml-auto">
                {currentRoundWinners.length > 0 && (
                  <button
                    onClick={handleExportWinners}
                    className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors text-sm border border-green-500/30 flex items-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                    <span>导出名单</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
