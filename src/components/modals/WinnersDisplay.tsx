"use client";

import React, { useMemo, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDraw } from "../../context/DrawContext";

export default function WinnersDisplay() {
  const t = useTranslations("LuckyDraw");
  const { winners, status, setStatus, participants, prizeTitle } = useDraw();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // 防抖滚动处理
  const handleScroll = () => {
    if (!isScrolling) {
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 200);
    }
  };

  // 添加参与者总数和获奖者信息
  const winnerInfo = useMemo(() => {
    return {
      totalParticipants: participants.length,
      winnerCount: winners.length,
    };
  }, [participants.length, winners.length]);

  // 根据获奖者数量决定显示尺寸
  const getWinnerSize = useMemo(() => {
    if (winners.length <= 3)
      return {
        width: 260,
        height: 120,
        fontSize: 18,
        numberSize: 28,
      };
    if (winners.length <= 6)
      return {
        width: 230,
        height: 110,
        fontSize: 17,
        numberSize: 25,
      };
    if (winners.length <= 10)
      return {
        width: 200,
        height: 100,
        fontSize: 16,
        numberSize: 22,
      };
    if (winners.length <= 20)
      return {
        width: 180,
        height: 90,
        fontSize: 15,
        numberSize: 20,
      };
    if (winners.length <= 35)
      return {
        width: 160,
        height: 80,
        fontSize: 14,
        numberSize: 18,
      };
    return {
      width: 140,
      height: 70,
      fontSize: 13,
      numberSize: 16,
    };
  }, [winners.length]);

  if (status !== "completed" || winners.length === 0) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#020818]/98 tech-interface">
      {/* 网格背景 */}
      <div className="absolute inset-0 tech-grid"></div>

      {/* 主圆形光效背景 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="tech-main-circle"></div>

        {/* 外部装饰光环 */}
        <div className="tech-outer-ring"></div>
        <div className="tech-outer-ring-glow"></div>

        {/* 环形装饰 */}
        <div className="tech-arc-container">
          {/* 左侧环形装饰 */}
          <div className="tech-arc tech-arc-left-1"></div>
          <div className="tech-arc tech-arc-left-2"></div>
          <div className="tech-arc tech-arc-left-3"></div>
          <div className="tech-arc tech-arc-left-4"></div>

          {/* 右侧环形装饰 */}
          <div className="tech-arc tech-arc-right-1"></div>
          <div className="tech-arc tech-arc-right-2"></div>
          <div className="tech-arc tech-arc-right-3"></div>
          <div className="tech-arc tech-arc-right-4"></div>

          {/* 虚线圆弧 */}
          <div className="tech-dashed-arc tech-dashed-arc-1"></div>
          <div className="tech-dashed-arc tech-dashed-arc-2"></div>
        </div>
      </div>

      {/* 光点效果 */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={`light-dot-${i}`}
            className="tech-light-dot"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>

      {/* 内容区域容器 */}
      <div className="tech-container relative w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[1200px] max-h-[92vh] mx-auto overflow-hidden flex flex-col">
        {/* 关闭按钮 */}
        <button
          onClick={() => setStatus("idle")}
          className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-[#091238]/80 border border-[#4b8bff]/30 text-[#4b8bff] hover:bg-[#0c1a4a] hover:text-white hover:border-[#4b8bff] transition-all"
          title={t("close")}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* 中心标题区域 */}
        <div className="tech-header relative py-8 flex flex-col items-center justify-center">
          <div className="tech-title-container">
            {/* 标题背景装饰 */}
            <div className="tech-title-decoration"></div>

            {/* 标题内容 */}
            <div className="tech-title relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight text-center">
                <span className="block text-[#65bdff] mb-3 tech-title-glow">
                  {prizeTitle || t("winners")}
                </span>
                <div className="flex items-center justify-center mt-2">
                  <div className="tech-counter-container">
                    <FontAwesomeIcon
                      icon={faTrophy}
                      className="text-[#ffdc50] mr-3"
                    />
                    <span className="tech-counter">{winners.length}</span>
                    <span className="mx-2 text-[#4b8bff] opacity-60">/</span>
                    <span className="text-[#4b8bff]">
                      {winnerInfo.totalParticipants}
                    </span>
                  </div>
                </div>
              </h2>
            </div>
          </div>
        </div>

        {/* 主要内容分割线 */}
        <div className="tech-divider">
          <div className="tech-divider-inner"></div>
        </div>

        {/* 获奖者展示区域 */}
        <div
          ref={containerRef}
          className="tech-content relative z-10 p-5 lg:p-8 overflow-y-auto flex-1"
          onScroll={handleScroll}
        >
          <div className="flex flex-wrap justify-center">
            {winners.map((winner, index) => (
              <div
                key={`winner-${index}`}
                className="tech-winner-item relative m-3"
                style={{
                  width: `${getWinnerSize.width}px`,
                  height: `${getWinnerSize.height}px`,
                  animationDelay: `${Math.min(index, 20) * 0.08}s`,
                }}
              >
                {/* 边框发光效果 */}
                <div className="tech-winner-border-glow"></div>

                {/* 内部发光边框 */}
                <div className="absolute inset-0 border border-[#4b8bff]/80 tech-winner-border rounded-md"></div>

                {/* 顶部发光边框 */}
                <div className="absolute top-0 left-[15%] right-[15%] h-[2px] bg-[#4b8bff]/90"></div>

                {/* 底部发光边框 */}
                <div className="absolute bottom-0 left-[25%] right-[25%] h-[1px] bg-[#4b8bff]/50"></div>

                {/* 角落装饰 */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#4b8bff]/90"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#4b8bff]/90"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#4b8bff]/90"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#4b8bff]/90"></div>

                {/* 中心内容 */}
                <div className="tech-winner-content relative z-10 p-3 h-full flex flex-col items-center justify-center">
                  {/* 编号 */}
                  <div
                    className="tech-winner-number mb-3 flex items-center justify-center"
                    style={{ fontSize: `${getWinnerSize.numberSize}px` }}
                  >
                    <span className="tech-winner-number-text">{index + 1}</span>
                  </div>

                  {/* 获奖者名称 */}
                  <div
                    className="tech-winner-name text-center"
                    style={{ fontSize: `${getWinnerSize.fontSize}px` }}
                  >
                    {winner.name}
                  </div>

                  {/* 内部光效装饰 */}
                  <div className="tech-winner-inner-light"></div>
                </div>

                {/* 悬停时的扫描线效果 */}
                <div className="tech-winner-scan"></div>
              </div>
            ))}
          </div>

          {/* 底部边距，确保最后一排完全显示 */}
          <div className="h-6"></div>
        </div>
      </div>

      {/* 技术风格CSS */}
      <style jsx>{`
        .tech-interface {
          perspective: 1500px;
        }

        .tech-grid {
          background-size: 30px 30px;
          background-image: linear-gradient(
              to right,
              rgba(59, 130, 246, 0.07) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(59, 130, 246, 0.07) 1px,
              transparent 1px
            );
          background-position: center center;
        }

        .tech-main-circle {
          width: 800px;
          height: 800px;
          background: radial-gradient(
            circle,
            rgba(37, 99, 235, 0.15) 0%,
            rgba(37, 99, 235, 0.1) 40%,
            rgba(37, 99, 235, 0.05) 60%,
            transparent 80%
          );
          border-radius: 50%;
          animation: pulse-subtle 8s infinite ease-in-out;
        }

        .tech-outer-ring {
          position: absolute;
          width: 1000px;
          height: 1000px;
          border: 8px solid rgba(59, 130, 246, 0.1);
          border-radius: 50%;
          animation: rotate 60s infinite linear;
        }

        .tech-outer-ring-glow {
          position: absolute;
          width: 1000px;
          height: 1000px;
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          filter: blur(3px);
          animation: rotate-reverse 80s infinite linear,
            pulse-glow 4s infinite alternate;
        }

        .tech-arc-container {
          position: absolute;
          width: 1200px;
          height: 1200px;
        }

        .tech-arc {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: center;
          border-style: solid;
          border-color: #4b8bff;
        }

        .tech-arc-left-1 {
          width: 1100px;
          height: 1100px;
          transform: translate(-50%, -50%) rotate(-85deg);
          border-radius: 50%;
          border-width: 0;
          border-left-width: 12px;
          clip-path: polygon(0 0, 50% 0, 50% 50%, 0 50%);
          opacity: 0.2;
          border-color: #3dc2ff;
        }

        .tech-arc-left-2 {
          width: 900px;
          height: 900px;
          transform: translate(-50%, -50%) rotate(-70deg);
          border-radius: 50%;
          border-width: 0;
          border-left-width: 8px;
          clip-path: polygon(0 0, 50% 0, 50% 50%, 0 50%);
          opacity: 0.3;
          border-color: #52a8ff;
        }

        .tech-arc-left-3 {
          width: 850px;
          height: 850px;
          transform: translate(-50%, -50%) rotate(-75deg);
          border-radius: 50%;
          border-width: 0;
          border-left-width: 3px;
          clip-path: polygon(0 0, 50% 0, 50% 50%, 0 50%);
          opacity: 0.5;
          border-color: #65bdff;
        }

        .tech-arc-left-4 {
          width: 700px;
          height: 700px;
          transform: translate(-50%, -50%) rotate(-65deg);
          border-radius: 50%;
          border-width: 0;
          border-left-width: 6px;
          clip-path: polygon(0 0, 50% 0, 50% 50%, 0 50%);
          opacity: 0.4;
          border-color: #70c7ff;
        }

        .tech-arc-right-1 {
          width: 1100px;
          height: 1100px;
          transform: translate(-50%, -50%) rotate(85deg);
          border-radius: 50%;
          border-width: 0;
          border-right-width: 12px;
          clip-path: polygon(50% 0, 100% 0, 100% 50%, 50% 50%);
          opacity: 0.2;
          border-color: #3dc2ff;
        }

        .tech-arc-right-2 {
          width: 900px;
          height: 900px;
          transform: translate(-50%, -50%) rotate(70deg);
          border-radius: 50%;
          border-width: 0;
          border-right-width: 8px;
          clip-path: polygon(50% 0, 100% 0, 100% 50%, 50% 50%);
          opacity: 0.3;
          border-color: #52a8ff;
        }

        .tech-arc-right-3 {
          width: 850px;
          height: 850px;
          transform: translate(-50%, -50%) rotate(75deg);
          border-radius: 50%;
          border-width: 0;
          border-right-width: 3px;
          clip-path: polygon(50% 0, 100% 0, 100% 50%, 50% 50%);
          opacity: 0.5;
          border-color: #65bdff;
        }

        .tech-arc-right-4 {
          width: 700px;
          height: 700px;
          transform: translate(-50%, -50%) rotate(65deg);
          border-radius: 50%;
          border-width: 0;
          border-right-width: 6px;
          clip-path: polygon(50% 0, 100% 0, 100% 50%, 50% 50%);
          opacity: 0.4;
          border-color: #70c7ff;
        }

        .tech-dashed-arc-1 {
          width: 1000px;
          height: 1000px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 2px dashed rgba(75, 139, 255, 0.3);
          border-radius: 50%;
          animation: rotate 120s infinite linear;
        }

        .tech-dashed-arc-2 {
          width: 800px;
          height: 800px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 1px dashed rgba(75, 139, 255, 0.2);
          border-radius: 50%;
          animation: rotate-reverse 180s infinite linear;
        }

        .tech-light-dot {
          position: absolute;
          width: 3px;
          height: 3px;
          background-color: rgba(101, 189, 255, 0.8);
          border-radius: 50%;
          filter: blur(1px);
          animation: pulse-light infinite ease-in-out;
        }

        .tech-container {
          background: rgba(5, 12, 36, 0.4);
          box-shadow: 0 0 100px rgba(59, 130, 246, 0.3);
          transform-style: preserve-3d;
          backdrop-filter: blur(1px);
          border-radius: 12px;
          overflow: hidden;
        }

        .tech-title-container {
          position: relative;
          padding: 1.5rem;
          z-index: 10;
        }

        .tech-title-decoration {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 100%;
          background: radial-gradient(
            ellipse at center,
            rgba(75, 139, 255, 0.15) 0%,
            transparent 70%
          );
          filter: blur(5px);
          z-index: -1;
        }

        .tech-title-glow {
          text-shadow: 0 0 15px rgba(101, 189, 255, 0.7);
          position: relative;
        }

        .tech-title-glow::after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 25%;
          right: 25%;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(75, 139, 255, 0.8),
            transparent
          );
        }

        .tech-counter-container {
          display: flex;
          align-items: center;
          background-color: rgba(9, 18, 56, 0.8);
          border: 1px solid rgba(75, 139, 255, 0.3);
          border-radius: 9999px;
          padding: 0.5rem 1.25rem;
          box-shadow: 0 0 15px rgba(75, 139, 255, 0.2);
        }

        .tech-counter {
          color: white;
          font-weight: bold;
          font-size: 1.5rem;
          text-shadow: 0 0 10px rgba(101, 189, 255, 0.8);
        }

        .tech-divider {
          position: relative;
          height: 1px;
          margin: 0 auto;
          width: 80%;
          overflow: hidden;
          background: rgba(75, 139, 255, 0.2);
          margin-bottom: 1.5rem;
        }

        .tech-divider-inner {
          position: absolute;
          top: 0;
          height: 100%;
          width: 30%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(101, 189, 255, 0.8),
            transparent
          );
          animation: slide 3s infinite ease-in-out;
        }

        .tech-content {
          scrollbar-width: thin;
          scrollbar-color: rgba(75, 139, 255, 0.5) rgba(5, 12, 36, 0.3);
          padding-bottom: 1rem;
        }

        .tech-content::-webkit-scrollbar {
          width: 4px;
        }

        .tech-content::-webkit-scrollbar-track {
          background: rgba(5, 12, 36, 0.3);
        }

        .tech-content::-webkit-scrollbar-thumb {
          background: rgba(75, 139, 255, 0.5);
          border-radius: 4px;
        }

        .tech-scan-line {
          top: 0;
          background: linear-gradient(
            to right,
            transparent,
            rgba(101, 189, 255, 0.8),
            transparent
          );
          animation: scan 3s infinite ease-in-out;
          opacity: 0.7;
        }

        .tech-winner-item {
          background-color: rgba(5, 12, 36, 0.7);
          border-radius: 6px;
          box-shadow: 0 0 20px rgba(75, 139, 255, 0.15);
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
          overflow: hidden;
          transition: all 0.3s ease;
          transform: perspective(800px) rotateY(0deg);
          position: relative;
        }

        .tech-winner-item:hover {
          transform: perspective(800px) rotateY(5deg) translateY(-5px);
          box-shadow: 0 8px 30px rgba(75, 139, 255, 0.3);
          z-index: 5;
        }

        .tech-winner-border-glow {
          position: absolute;
          inset: -3px;
          border-radius: 8px;
          background: transparent;
          box-shadow: 0 0 15px rgba(75, 139, 255, 0.4);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .tech-winner-item:hover .tech-winner-border-glow {
          opacity: 1;
        }

        .tech-winner-border {
          box-shadow: inset 0 0 10px rgba(75, 139, 255, 0.3);
        }

        .tech-winner-content {
          background: linear-gradient(
            135deg,
            rgba(9, 18, 56, 0.9) 0%,
            rgba(5, 12, 36, 0.95) 100%
          );
          position: relative;
          overflow: hidden;
        }

        .tech-winner-number {
          position: relative;
        }

        .tech-winner-number-text {
          color: #7dcfff;
          font-weight: 700;
          text-shadow: 0 0 8px rgba(101, 189, 255, 0.6);
          position: relative;
          z-index: 1;
        }

        .tech-winner-number::before {
          content: "";
          position: absolute;
          width: 45px;
          height: 45px;
          background: radial-gradient(
            circle,
            rgba(75, 139, 255, 0.15) 30%,
            transparent 70%
          );
          border-radius: 50%;
          z-index: 0;
        }

        .tech-winner-name {
          color: white;
          font-weight: 500;
          max-width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: relative;
          z-index: 1;
        }

        .tech-winner-inner-light {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            ellipse at center,
            rgba(75, 139, 255, 0.05) 0%,
            transparent 70%
          );
          animation: pulse-subtle 4s infinite alternate ease-in-out;
          z-index: 0;
        }

        .tech-winner-scan {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(101, 189, 255, 0.2),
            transparent
          );
          transform: skewX(-20deg);
          transition: all 0.5s ease;
          opacity: 0;
        }

        .tech-winner-item:hover .tech-winner-scan {
          left: 100%;
          opacity: 1;
          transition: all 1s ease;
        }

        @keyframes pulse-subtle {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes pulse-light {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotate-reverse {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes scan {
          0%,
          100% {
            top: 0;
            opacity: 0;
          }
          50% {
            top: 100%;
            opacity: 0.7;
          }
        }

        @keyframes slide {
          0%,
          100% {
            left: -30%;
          }
          50% {
            left: 100%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: perspective(800px) rotateY(10deg) translateY(30px);
          }
          to {
            opacity: 1;
            transform: perspective(800px) rotateY(0deg) translateY(0);
          }
        }

        @media (max-width: 640px) {
          .tech-main-circle {
            width: 400px;
            height: 400px;
          }

          .tech-outer-ring,
          .tech-outer-ring-glow {
            width: 500px;
            height: 500px;
          }

          .tech-arc-container {
            width: 600px;
            height: 600px;
          }

          .tech-counter-container {
            padding: 0.3rem 0.8rem;
          }

          .tech-counter {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
