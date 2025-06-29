"use client";

import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useLotteryStore } from "@/utils/lotteryStore";
import WinnerAnimation from "@/components/common/WinnerAnimation";
import { LotteryState } from "@/types/types";

export interface SpinWheelRef {
  spin: () => boolean;
}

interface SpinWheelProps {
  onWinnerSelected?: (winner: string) => void;
  onStartSpin?: () => void;
  onStopSpin?: () => void;
}

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
  "#F1948A",
  "#85929E",
  "#AED6F1",
  "#A9DFBF",
  "#FAD7A0",
  "#D2B4DE",
  "#FFB6C1",
  "#98FB98",
  "#87CEEB",
  "#DDA0DD",
  "#F0E68C",
  "#FF7F50",
  "#9370DB",
  "#3CB371",
  "#FF69B4",
  "#CD853F",
  "#FFA500",
  "#40E0D0",
  "#EE82EE",
  "#90EE90",
  "#FFB347",
  "#87CEFA",
  "#DEB887",
  "#F0B27A",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
  "#F1948A",
  "#AED6F1",
  "#FAD7A0",
  "#D2B4DE",
  "#FFB6C1",
  "#98FB98",
  "#87CEEB",
  "#DDA0DD",
];

const SpinWheel = forwardRef<SpinWheelRef, SpinWheelProps>(
  ({ onWinnerSelected, onStartSpin, onStopSpin }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);

    const { participants, winners, selectWinner, settings, state } =
      useLotteryStore();

    // 可用参与者 - 根据设置决定是否需要过滤
    const availableParticipants = settings.removeWinnersFromPool
      ? participants.filter((p) => !winners.some((w) => w.name === p.name)) // 如果设置了移除中奖者，则过滤掉中奖者
      : participants; // 否则显示所有参与者，不过滤中奖者

    // 监听store状态变化，当中奖选择完成时重置按钮状态
    useEffect(() => {
      if (state === LotteryState.WINNER_SELECTED) {
        // 延迟一下再重置按钮状态，确保弹窗已经显示
        const timer = setTimeout(() => {
          onStopSpin?.();
        }, 100);

        return () => clearTimeout(timer);
      }
    }, [state, onStopSpin]);

    // 绘制转盘
    const drawWheel = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 增大转盘尺寸，充分利用空间
      const size = 800; // 从600增加到800
      const center = size / 2;
      const radius = 350; // 从260增加到350
      const outerRadius = 370; // 外圈半径，但不绘制装饰圆点

      // 设置canvas和高DPI支持
      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = size + "px";
      canvas.style.height = size + "px";
      ctx.scale(dpr, dpr);

      // 高质量抗锯齿设置
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // 清空
      ctx.clearRect(0, 0, size, size);

      if (availableParticipants.length === 0) {
        // 空转盘
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#ddd";
        ctx.fill();
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#666";
        ctx.font = "32px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("请添加参与者", center, center);
        return;
      }

      // 绘制外圈装饰（简化版，不带圆点）
      ctx.beginPath();
      ctx.arc(center, center, outerRadius, 0, 2 * Math.PI);
      const outerGradient = ctx.createRadialGradient(
        center,
        center,
        radius,
        center,
        center,
        outerRadius
      );
      outerGradient.addColorStop(0, "#FF4444");
      outerGradient.addColorStop(1, "#CC0000");
      ctx.fillStyle = outerGradient;
      ctx.fill();

      const anglePerSection = (2 * Math.PI) / availableParticipants.length;

      // 绘制扇形
      availableParticipants.forEach((participant, index) => {
        const startAngle = index * anglePerSection + rotation;
        const endAngle = (index + 1) * anglePerSection + rotation;

        // 扇形
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();

        // 创建渐变效果
        const gradient = ctx.createRadialGradient(
          center,
          center,
          0,
          center,
          center,
          radius
        );
        const baseColor = COLORS[index % COLORS.length];
        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(1, baseColor + "99"); // 透明度

        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3; // 增加线宽
        ctx.stroke();

        // 修复文字居中问题：确保文字在扇形正中央
        const midAngle = index * anglePerSection + anglePerSection / 2;

        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(midAngle + rotation); // 旋转到扇形方向

        // 完全统一的文字样式
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // 加强阴影效果，确保文字清晰可见
        ctx.shadowColor = "#000000";
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        let name = participant.name;

        // 纵向绘制文字：沿着径向（从圆心向外）排列
        const chars = name.split("");

        // 计算可用的径向空间
        const innerRadius = 70; // 内圈半径 + 一些间距
        const outerRadius = radius - 20; // 外边缘 - 一些间距
        const availableSpace = outerRadius - innerRadius;

        // 动态计算字符间距
        const maxCharSpacing = 20; // 理想字符间距
        const requiredSpace = (chars.length - 1) * maxCharSpacing;

        let actualChars = chars;
        let charSpacing = maxCharSpacing;

        // 如果空间不够，才考虑截断
        if (requiredSpace > availableSpace) {
          // 先尝试压缩间距
          charSpacing = Math.max(12, availableSpace / (chars.length - 1));

          // 如果压缩间距还不够，才截断文字
          if (charSpacing < 12) {
            const maxChars = Math.floor(availableSpace / 12) + 1;
            if (maxChars < name.length) {
              name = name.substring(0, Math.max(1, maxChars - 3)) + "...";
              actualChars = name.split("");
              charSpacing = Math.min(
                maxCharSpacing,
                availableSpace / (actualChars.length - 1)
              );
            }
          }
        }

        const totalWidth = (actualChars.length - 1) * charSpacing;

        // 计算起始位置，让整个文字组在可用径向空间中居中
        const centerRadius = (innerRadius + outerRadius) / 2;
        const startX = centerRadius - totalWidth / 2;

        actualChars.forEach((char, charIndex) => {
          const x = startX + charIndex * charSpacing;
          // 沿着径向（X轴）排列字符，Y坐标为0（扇形中心线）
          ctx.fillText(char, x, 0);
        });

        ctx.restore();
      });

      // 绘制内圈
      ctx.beginPath();
      ctx.arc(center, center, 55, 0, 2 * Math.PI);
      const innerGradient = ctx.createRadialGradient(
        center,
        center,
        0,
        center,
        center,
        55
      );
      innerGradient.addColorStop(0, "#FF6666");
      innerGradient.addColorStop(1, "#FF0000");
      ctx.fillStyle = innerGradient;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 5;
      ctx.stroke();

      // 重新设计指针：像真正的指针一样
      ctx.save();
      ctx.translate(center, center);

      // 绘制指针主体 - 缩短的向上箭头
      ctx.beginPath();
      ctx.moveTo(0, -radius * 0.6); // 指针尖端（缩短到转盘半径的60%）
      ctx.lineTo(-8, -20); // 左边
      ctx.lineTo(-3, -20); // 左内边
      ctx.lineTo(-3, 10); // 左下内边
      ctx.lineTo(3, 10); // 右下内边
      ctx.lineTo(3, -20); // 右内边
      ctx.lineTo(8, -20); // 右边
      ctx.closePath();

      // 指针填充和边框
      ctx.fillStyle = "#FFD700";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 指针中心装饰圆
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "#FFD700";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    };

    // 转动函数（由外部调用）
    const spin = () => {
      if (isSpinning || availableParticipants.length === 0) {
        return false;
      }

      setIsSpinning(true);
      onStartSpin?.();

      // 随机转动逻辑：不预设中奖者，让转盘随机转动
      const minSpins = 5; // 最少转动圈数
      const maxSpins = 10; // 最多转动圈数
      const randomSpins = minSpins + Math.random() * (maxSpins - minSpins);
      const randomAngle = Math.random() * 2 * Math.PI; // 随机停止角度

      const finalAngle = rotation + randomSpins * 2 * Math.PI + randomAngle;

      // 转动动画 - 慢→快→慢
      const duration = 4000; // 4秒
      const startTime = Date.now();
      const startRotation = rotation;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 慢→快→慢的缓动效果
        let eased;
        if (progress < 0.3) {
          // 前30%：慢速启动
          eased = (0.5 * progress * progress) / 0.09; // 二次方缓入
        } else if (progress < 0.7) {
          // 中间40%：匀速快速
          const midProgress = (progress - 0.3) / 0.4;
          eased = 0.05 + 0.8 * midProgress; // 快速匀速段
        } else {
          // 后30%：慢速结束
          const endProgress = (progress - 0.7) / 0.3;
          eased = 0.85 + 0.15 * (1 - Math.pow(1 - endProgress, 3)); // 三次方缓出
        }

        const currentRotation =
          startRotation + (finalAngle - startRotation) * eased;
        setRotation(currentRotation);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsSpinning(false);

          console.log("转盘调试 - 设置信息：", {
            removeWinnersFromPool: settings.removeWinnersFromPool,
            participantsCount: participants.length,
            winnersCount: winners.length,
            availableParticipantsCount: availableParticipants.length,
          });

          // 转动结束后，根据指针实际指向确定中奖者
          const anglePerSection = (2 * Math.PI) / availableParticipants.length;

          // 指针固定指向12点钟方向（-Math.PI/2）
          const pointerAngle = -Math.PI / 2;

          // 将所有角度标准化到 [0, 2π) 范围内
          const normalizedFinalAngle =
            ((finalAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
          const normalizedPointerAngle =
            ((pointerAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

          // 调试：打印所有扇形的角度范围
          console.log("所有扇形角度范围：");
          for (let i = 0; i < availableParticipants.length; i++) {
            const sectorStart =
              (i * anglePerSection + normalizedFinalAngle) % (2 * Math.PI);
            const sectorEnd =
              ((i + 1) * anglePerSection + normalizedFinalAngle) %
              (2 * Math.PI);
            console.log(
              `扇形 ${i}: [${sectorStart.toFixed(3)}, ${sectorEnd.toFixed(
                3
              )}] - ${availableParticipants[i].name}`
            );
          }
          console.log(`指针角度: ${normalizedPointerAngle.toFixed(3)}`);

          // 计算每个扇形在标准化角度下的起始和结束角度
          let winnerIndex = -1;

          for (let i = 0; i < availableParticipants.length; i++) {
            const sectorStart =
              (i * anglePerSection + normalizedFinalAngle) % (2 * Math.PI);
            const sectorEnd =
              ((i + 1) * anglePerSection + normalizedFinalAngle) %
              (2 * Math.PI);

            // 处理跨越0度的情况
            let isInSector = false;
            if (sectorStart < sectorEnd) {
              // 正常情况：扇形不跨越0度
              isInSector =
                normalizedPointerAngle >= sectorStart &&
                normalizedPointerAngle < sectorEnd;
            } else {
              // 特殊情况：扇形跨越0度
              isInSector =
                normalizedPointerAngle >= sectorStart ||
                normalizedPointerAngle < sectorEnd;
            }

            if (isInSector) {
              winnerIndex = i;

              // 调试输出匹配的扇形
              console.log(`找到匹配扇形 ${i}:`, {
                sectorStart: sectorStart.toFixed(3),
                sectorEnd: sectorEnd.toFixed(3),
                normalizedPointerAngle: normalizedPointerAngle.toFixed(3),
                participant: availableParticipants[i].name,
              });
              break;
            }
          }

          if (winnerIndex === -1) {
            console.error("未找到匹配的扇形！");
            winnerIndex = 0; // 默认选择第一个
          }

          const selectedWinner = availableParticipants[winnerIndex];

          // 调试输出
          console.log("调试信息：", {
            finalAngle: finalAngle.toFixed(3),
            normalizedFinalAngle: normalizedFinalAngle.toFixed(3),
            pointerAngle: pointerAngle.toFixed(3),
            normalizedPointerAngle: normalizedPointerAngle.toFixed(3),
            anglePerSection: anglePerSection.toFixed(3),
            winnerIndex,
            selectedWinner: selectedWinner.name,
            totalParticipants: availableParticipants.length,
          });

          selectWinner(selectedWinner);
          onWinnerSelected?.(selectedWinner.name);
          // 不在这里调用onStopSpin，等useEffect监听状态变化后调用
        }
      };

      requestAnimationFrame(animate);
      return true;
    };

    // 暴露spin方法给父组件
    useImperativeHandle(ref, () => ({
      spin,
    }));

    // 绘制效果
    useEffect(() => {
      drawWheel();
    }, [rotation, availableParticipants.length]);

    return (
      <div className="flex flex-col items-center justify-center h-full">
        {/* 转盘 */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            className={`
              rounded-full transition-all duration-200
              ${isSpinning ? "animate-pulse" : ""}
              ${
                availableParticipants.length === 0
                  ? "opacity-50"
                  : "opacity-100"
              }
            `}
          />
        </div>

        {/* 使用公共的中奖动画组件 */}
        <WinnerAnimation />
      </div>
    );
  }
);

SpinWheel.displayName = "SpinWheel";

export default SpinWheel;
