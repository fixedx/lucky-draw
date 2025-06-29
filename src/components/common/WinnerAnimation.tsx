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
      "#F59E0B", // 琥珀色
      "#EA580C", // 橙色
      "#DC2626", // 红色
      "#F97316", // 橙色
      "#FBBF24", // 黄色
      "#F59E0B", // 琥珀色
      "#EF4444", // 红色
      "#FCD34D", // 暖黄色
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: typeof window !== "undefined" ? window.innerWidth / 2 : 500,
        y: typeof window !== "undefined" ? window.innerHeight / 2 : 300,
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
        x:
          typeof window !== "undefined"
            ? Math.random() * window.innerWidth
            : Math.random() * 1000,
        y:
          typeof window !== "undefined"
            ? Math.random() * window.innerHeight * 0.5 +
              window.innerHeight * 0.1
            : Math.random() * 300 + 100,
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
          <div className="w-4 h-4 bg-orange-400 rounded-full animate-ping" />
        </motion.div>
      ))}
    </div>
  );
}

function WinnerCard({
  winners,
  prizeType,
  onClose,
  t,
}: {
  winners: Array<{ name: string; prizeType: string }>;
  prizeType: string;
  onClose: () => void;
  t: (key: string, values?: any) => string;
}) {
  const getLayoutConfig = (count: number) => {
    if (count === 1) {
      return {
        maxWidth: "max-w-md",
        useFlex: false, // 单人用特殊布局
      };
    }

    // 多人用flex布局，自动换行
    return {
      maxWidth: "max-w-[90vw]", // 使用更宽的容器
      useFlex: true,
    };
  };

  const layoutConfig = getLayoutConfig(winners.length);

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
      className={`bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-6 rounded-3xl shadow-2xl text-center ${layoutConfig.maxWidth} mx-auto max-h-[85vh] overflow-hidden flex flex-col`}
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

      {/* 奖项信息 */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-xl text-white/90 mb-4 font-semibold"
      >
        {prizeType} • {t("winnersCount", { count: winners.length })}
      </motion.div>

      {/* 获奖者名单 */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5, type: "spring" }}
        className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-4 flex-1 overflow-y-auto min-h-0 custom-scrollbar"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="text-lg text-white/80 mb-4">{t("winner")}</div>

        {winners.length === 1 ? (
          // 单个获奖者 - 大字显示
          <div className="text-4xl font-bold text-white drop-shadow-lg break-words">
            {winners[0].name}
          </div>
        ) : (
          // 多个获奖者 - flex布局自动换行
          <div className="flex flex-wrap gap-3 justify-center">
            {winners.map((winner, index) => (
              <motion.div
                key={`${winner.name}-${index}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.8 + index * 0.02,
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300,
                }}
                className="bg-white/10 rounded-lg p-3 text-center hover:bg-white/20 transition-colors border border-white/10 w-24 flex-shrink-0"
              >
                {/* 编号 */}
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xs mx-auto mb-2">
                  {index + 1}
                </div>
                {/* 名字 */}
                <div className="text-white font-medium text-sm leading-tight break-words px-1">
                  {winner.name}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* 底部固定区域 */}
      <div className="flex-shrink-0">
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
          {t("confirmText")}
        </motion.button>
      </div>
    </motion.div>
  );
}

function FloatingEmoji() {
  const emojis = ["🎉", "🎊", "🥳", "🎈", "🌟", "💫", "🎁", "🏆"];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  const randomDelay = Math.random() * 2;
  const randomDuration = Math.random() * 3 + 2;
  const randomX =
    typeof window !== "undefined"
      ? Math.random() * window.innerWidth
      : Math.random() * 1000;

  return (
    <motion.div
      initial={{
        y: typeof window !== "undefined" ? window.innerHeight + 50 : 650,
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
  const { state, currentWinner, currentRoundWinners, settings } =
    useLotteryStore();

  const t = useTranslations("common");

  const isWinnerSelected = state === LotteryState.WINNER_SELECTED;
  const hasWinners = currentRoundWinners.length > 0;

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
      {isWinnerSelected && hasWinners && (
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
            <WinnerCard
              winners={currentRoundWinners}
              prizeType={settings.prizeType}
              onClose={handleClose}
              t={t}
            />
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
                "rgba(249, 115, 22, 0)", // 橘黄色
                "rgba(251, 191, 36, 0.3)", // 金黄色
                "rgba(249, 115, 22, 0)", // 橘黄色
                "rgba(245, 158, 11, 0.2)", // 琥珀色
                "rgba(249, 115, 22, 0)", // 橘黄色
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
