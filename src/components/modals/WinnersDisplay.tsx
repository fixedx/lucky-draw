"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDraw } from "../../context/DrawContext";
import { motion, AnimatePresence } from "framer-motion";

export default function WinnersDisplay() {
  const t = useTranslations("LuckyDraw");
  const { winners, status, setStatus, participants, prizeTitle } = useDraw();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 当状态变为completed时立即设置为可见
  useEffect(() => {
    if (status === "completed" && winners.length > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [status, winners.length]);

  // 添加参与者总数和获奖者信息
  const winnerInfo = useMemo(() => {
    return {
      totalParticipants: participants.length,
      winnerCount: winners.length,
    };
  }, [participants.length, winners.length]);

  // 根据获奖者数量决定卡片尺寸
  const getWinnerSize = useMemo(() => {
    if (winners.length <= 3)
      return { width: 400, height: 180, fontSize: 40, numberSize: 40 };
    if (winners.length <= 8)
      return { width: 300, height: 140, fontSize: 32, numberSize: 32 };
    if (winners.length <= 20)
      return { width: 250, height: 100, fontSize: 24, numberSize: 24 };
    return { width: 200, height: 80, fontSize: 18, numberSize: 18 };
  }, [winners.length]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="winners-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-[#020818]/70 backdrop-blur-sm tech-interface"
        >
          {/* 半透明背景遮罩，点击关闭 */}
          <div
            className="absolute inset-0"
            onClick={() => {
              setIsVisible(false);
              // 稍微延迟改变状态，让动画完成
              setTimeout(() => setStatus("idle"), 300);
            }}
          />

          {/* 弹窗容器 */}
          <motion.div
            key="modal-container"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`max-w-[90%] min-w-[500px] max-h-[90vh] bg-[#061433]/95 rounded-lg border border-[#4b8bff]/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-sm relative z-10 overflow-hidden tech-modal`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 背景装饰效果 */}
            <div className="absolute inset-0 tech-grid opacity-30"></div>
            <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#4b8bff]/70 to-transparent"></div>
            <div className="absolute bottom-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-[#4b8bff]/50 to-transparent"></div>

            {/* 扫描线效果 */}
            <div className="tech-scan-line"></div>

            {/* 关闭按钮 */}
            <button
              onClick={() => {
                setIsVisible(false);
                // 稍微延迟改变状态，让动画完成
                setTimeout(() => setStatus("idle"), 300);
              }}
              className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-[#091238]/80 border border-[#4b8bff]/30 text-[#4b8bff] hover:bg-[#0c1a4a] hover:text-white hover:border-[#4b8bff] transition-all"
              title={t("close")}
            >
              <FontAwesomeIcon icon={faTimes} size="sm" />
            </button>

            {/* 标题区域 */}
            <div className="tech-header relative pt-5 pb-3 flex flex-col items-center justify-center border-b border-[#4b8bff]/20">
              <div className="tech-title-container">
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight text-center">
                  <span className="inline-block text-[#65bdff] tech-title-glow">
                    {prizeTitle || t("winners")}
                  </span>
                  <div className="flex items-center justify-center mt-2 text-lg">
                    <FontAwesomeIcon
                      icon={faTrophy}
                      className="text-[#ffdc50] mr-2"
                    />
                    <span className="tech-counter">{winners.length}</span>
                    <span className="mx-2 text-[#4b8bff] opacity-60">/</span>
                    <span className="text-[#4b8bff]">
                      {winnerInfo.totalParticipants}
                    </span>
                  </div>
                </h2>
              </div>
            </div>

            {/* 获奖者展示区域 - 使用原生滚动 */}
            <div
              ref={containerRef}
              className="tech-content p-5 overflow-y-auto overflow-x-hidden"
              style={{
                maxHeight: "calc(80vh - 100px)",
                overflowY: "auto", // 确保使用原生滚动
                WebkitOverflowScrolling: "touch", // 在iOS上提供惯性滚动体验
              }}
            >
              <div className="flex flex-wrap justify-center gap-4">
                {winners.map((winner, index) => (
                  <motion.div
                    key={`winner-${winner.name}-${index}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="tech-winner-item relative"
                    style={{
                      width: `${getWinnerSize.width}px`,
                      height: `${getWinnerSize.height}px`,
                    }}
                  >
                    {/* 边框发光效果 */}
                    <div className="tech-winner-border-glow"></div>

                    {/* 内部发光边框 */}
                    <div className="absolute inset-0 border border-[#4b8bff]/50 tech-winner-border"></div>

                    {/* 顶部发光边框 */}
                    <div className="absolute top-0 left-[15%] right-[15%] h-[2px] bg-[#4b8bff]/90"></div>

                    {/* 底部发光边框 */}
                    <div className="absolute bottom-0 left-[25%] right-[25%] h-[1px] bg-[#4b8bff]/50"></div>

                    {/* 角落装饰 */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#4b8bff]"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#4b8bff]"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#4b8bff]"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#4b8bff]"></div>

                    {/* 中心内容 */}
                    <div className="tech-winner-content relative z-10 p-2 h-full flex flex-col items-center justify-center">
                      {/* 编号 */}
                      <div
                        className="tech-winner-number mb-2 flex items-center justify-center"
                        style={{ fontSize: `${getWinnerSize.numberSize}px` }}
                      >
                        <span className="tech-winner-number-text">
                          {index + 1}
                        </span>
                      </div>

                      {/* 获奖者名称 */}
                      <div
                        className="tech-winner-name text-center px-1 overflow-hidden text-ellipsis"
                        style={{
                          fontSize: `${getWinnerSize.fontSize}px`,
                          maxWidth: `${getWinnerSize.width - 10}px`,
                        }}
                      >
                        {winner.name}
                      </div>

                      {/* 内部光效装饰 */}
                      <div className="tech-winner-inner-light"></div>
                    </div>

                    {/* 悬停时的扫描线效果 */}
                    <div className="tech-winner-scan"></div>
                  </motion.div>
                ))}
              </div>

              {/* 底部空间，确保最后一行完全可见 */}
              <div className="h-4"></div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 技术风格CSS */}
      <style jsx>{`
        .tech-interface {
          perspective: 1000px;
        }

        .tech-grid {
          background-size: 30px 30px;
          background-image: linear-gradient(
              to right,
              rgba(75, 139, 255, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(75, 139, 255, 0.05) 1px,
              transparent 1px
            );
        }

        .tech-modal {
          box-shadow: 0 0 30px rgba(75, 139, 255, 0.2),
            0 0 60px rgba(0, 21, 64, 0.6);
        }

        .tech-scan-line {
          position: absolute;
          left: 0;
          top: 0;
          height: 2px;
          width: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(75, 139, 255, 0.5),
            transparent
          );
          animation: scanLine 4s linear infinite;
          z-index: 1;
        }

        @keyframes scanLine {
          0% {
            top: 0%;
          }
          100% {
            top: 100%;
          }
        }

        .tech-title-glow {
          text-shadow: 0 0 10px rgba(101, 189, 255, 0.7);
        }

        .tech-winner-border-glow {
          position: absolute;
          inset: -1px;
          border-radius: 5px;
          background: transparent;
          box-shadow: 0 0 15px rgba(75, 139, 255, 0.5);
          opacity: 0.7;
        }

        .tech-winner-border {
          box-shadow: inset 0 0 8px rgba(75, 139, 255, 0.2);
        }

        .tech-winner-number-text {
          color: #65bdff;
          font-weight: bold;
          text-shadow: 0 0 5px rgba(101, 189, 255, 0.7);
        }

        .tech-winner-name {
          color: white;
          font-weight: 500;
          white-space: nowrap;
        }

        .tech-winner-inner-light {
          position: absolute;
          width: 90%;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(75, 139, 255, 0.5),
            transparent
          );
          bottom: 10%;
          left: 5%;
        }

        .tech-winner-item {
          background: linear-gradient(
            to bottom,
            rgba(9, 18, 56, 0.95),
            rgba(4, 8, 24, 0.95)
          );
          border-radius: 4px;
          overflow: hidden;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }

        .tech-winner-item:hover {
          transform: translateY(-3px) scale(1.02);
          z-index: 10;
        }

        .tech-winner-scan {
          position: absolute;
          top: 0;
          height: 100%;
          width: 3px;
          left: -10%;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(75, 139, 255, 0.7),
            transparent
          );
          filter: blur(1px);
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
        }

        .tech-winner-item:hover .tech-winner-scan {
          animation: scanEffect 1.5s ease-in-out infinite;
          opacity: 1;
        }

        @keyframes scanEffect {
          from {
            left: -10%;
          }
          to {
            left: 110%;
          }
        }

        /* 滚动条样式 - 保持原有样式但确保使用原生滚动 */
        .tech-content::-webkit-scrollbar {
          width: 8px;
        }

        .tech-content::-webkit-scrollbar-track {
          background: rgba(9, 18, 56, 0.6);
        }

        .tech-content::-webkit-scrollbar-thumb {
          background: rgba(75, 139, 255, 0.3);
          border-radius: 10px;
        }

        .tech-content::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 139, 255, 0.5);
        }
      `}</style>
    </AnimatePresence>
  );
}
