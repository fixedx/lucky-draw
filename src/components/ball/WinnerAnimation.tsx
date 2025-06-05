"use client";

import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLotteryStore } from "@/utils/lotteryStore";
import { LotteryState } from "@/types/types";
import { useTranslations } from "next-intl";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

function ConfettiParticle({ particle }: { particle: Particle }) {
  return (
    <motion.div
      initial={{
        x: particle.x,
        y: particle.y,
        scale: 1,
        opacity: 1,
      }}
      animate={{
        x: particle.x + particle.vx * 100,
        y: particle.y + particle.vy * 100,
        scale: 0,
        opacity: 0,
      }}
      transition={{
        duration: particle.life,
        ease: "easeOut",
      }}
      className="absolute w-2 h-2 rounded-full"
      style={{
        backgroundColor: particle.color,
        width: particle.size,
        height: particle.size,
      }}
    />
  );
}

function ConfettiExplosion() {
  const particles = useMemo(() => {
    const particleCount = 50;
    const particles: Particle[] = [];

    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        life: Math.random() * 2 + 1,
      });
    }

    return particles;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <ConfettiParticle key={particle.id} particle={particle} />
      ))}
    </div>
  );
}

function FireworksEffect() {
  const fireworks = useMemo(() => {
    const fireworkCount = 3;
    const fireworks = [];

    for (let i = 0; i < fireworkCount; i++) {
      fireworks.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 0.5 + window.innerHeight * 0.1,
        delay: i * 0.5,
      });
    }

    return fireworks;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {fireworks.map((firework) => (
        <motion.div
          key={firework.id}
          className="absolute"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{
            duration: 1.5,
            delay: firework.delay,
            ease: "easeOut",
          }}
          style={{
            left: firework.x,
            top: firework.y,
          }}
        >
          <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
        </motion.div>
      ))}
    </div>
  );
}

function WinnerCard({
  winner,
  onClose,
}: {
  winner: string;
  onClose: () => void;
}) {
  const t = useTranslations("Ball");

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      exit={{ scale: 0, rotate: 180, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.8,
      }}
      className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-8 rounded-3xl shadow-2xl text-center max-w-md mx-auto"
    >
      {/* 奖杯图标 */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-6xl mb-4"
      >
        🏆
      </motion.div>

      {/* 恭喜文字 */}
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-3xl font-bold text-white mb-2 drop-shadow-lg"
      >
        {t("congratulations")}
      </motion.h2>

      {/* 获奖者名字 */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5, type: "spring" }}
        className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6"
      >
        <div className="text-lg text-white/80 mb-2">{t("winner")}</div>
        <div className="text-4xl font-bold text-white drop-shadow-lg break-words">
          {winner}
        </div>
      </motion.div>

      {/* 装饰星星 */}
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="text-2xl mb-4"
      >
        ✨ ⭐ ✨ ⭐ ✨
      </motion.div>

      {/* 关闭按钮 */}
      <motion.button
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className="bg-white text-orange-500 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
      >
        确认
      </motion.button>
    </motion.div>
  );
}

function FloatingEmoji() {
  const emojis = ["🎉", "🎊", "🥳", "🎈", "🌟", "💫", "🎁", "🏆"];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  const randomDelay = Math.random() * 2;
  const randomDuration = Math.random() * 3 + 2;
  const randomX = Math.random() * window.innerWidth;

  return (
    <motion.div
      initial={{
        y: window.innerHeight + 50,
        x: randomX,
        opacity: 0,
        scale: 0,
        rotate: 0,
      }}
      animate={{
        y: -100,
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
        rotate: 360,
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        ease: "easeOut",
      }}
      className="fixed text-4xl pointer-events-none z-30"
    >
      {randomEmoji}
    </motion.div>
  );
}

export default function WinnerAnimation() {
  const { state, currentWinner } = useLotteryStore();
  const t = useTranslations("Ball");

  const isWinnerSelected = state === LotteryState.WINNER_SELECTED;
  const winnerName = currentWinner?.name;

  const handleClose = () => {
    // 只重置状态回到空闲状态，保留中奖记录
    const store = useLotteryStore.getState();
    useLotteryStore.setState({
      state: LotteryState.IDLE,
      currentWinner: undefined,
      isSpinning: false,
    });
  };

  // 生成浮动表情符号
  const floatingEmojis = useMemo(() => {
    if (!isWinnerSelected) return [];

    const emojiCount = 15;
    return Array.from({ length: emojiCount }, (_, i) => (
      <FloatingEmoji key={i} />
    ));
  }, [isWinnerSelected]);

  return (
    <AnimatePresence>
      {isWinnerSelected && winnerName && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* 主容器 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <WinnerCard winner={winnerName} onClose={handleClose} />
          </motion.div>

          {/* 粒子效果 */}
          <ConfettiExplosion />

          {/* 烟花效果 */}
          <FireworksEffect />

          {/* 浮动表情符号 */}
          {floatingEmojis}

          {/* 背景闪烁效果 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.3, 0, 0.2, 0],
              backgroundColor: [
                "rgba(255, 215, 0, 0)",
                "rgba(255, 215, 0, 0.3)",
                "rgba(255, 215, 0, 0)",
                "rgba(255, 69, 0, 0.2)",
                "rgba(255, 215, 0, 0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: 3,
              ease: "easeInOut",
            }}
            className="fixed inset-0 pointer-events-none z-30"
          />
        </>
      )}
    </AnimatePresence>
  );
}
