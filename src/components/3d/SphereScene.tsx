"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { useLotteryStore } from "@/utils/lotteryStore";
import { LotteryState, type Participant } from "@/types/types";

interface ParticipantTextProps {
  participant: Participant;
  position: THREE.Vector3;
  isHighlighted: boolean;
  isSelected: boolean;
  colorIndex: number;
}

// 预定义的鲜艳颜色，模仿图片中的效果
const PARTICIPANT_COLORS = [
  "#FF4444", // 红色
  "#4444FF", // 蓝色
  "#44FF44", // 绿色
  "#FF44FF", // 紫色
  "#FFAA00", // 橙色
  "#00FFFF", // 青色
  "#FF0088", // 粉红色
  "#88FF00", // 黄绿色
  "#0088FF", // 天蓝色
  "#FF8800", // 深橙色
  "#8800FF", // 深紫色
  "#00FF88", // 海绿色
];

function ParticipantText({
  participant,
  position,
  isHighlighted,
  isSelected,
  colorIndex,
}: ParticipantTextProps) {
  const textRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (textRef.current && groupRef.current) {
      // 让文字始终面向相机
      groupRef.current.lookAt(state.camera.position);

      // 高亮效果
      if (isHighlighted) {
        const scale = 1.2 + Math.sin(state.clock.elapsedTime * 8) * 0.3;
        textRef.current.scale.setScalar(scale);
      } else {
        textRef.current.scale.setScalar(isSelected ? 1.5 : 1);
      }
    }
  });

  // 根据状态选择颜色
  const textColor = isSelected
    ? "#FFD700" // 金色表示获奖
    : isHighlighted
    ? "#FFFFFF" // 白色表示高亮
    : PARTICIPANT_COLORS[colorIndex % PARTICIPANT_COLORS.length]; // 循环使用预定义颜色

  return (
    <group ref={groupRef} position={position}>
      <Text
        ref={textRef}
        fontSize={0.12}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.2}
        textAlign="center"
        outlineWidth={0.008}
        outlineColor="#000000"
        material-transparent={true}
        material-opacity={0.95}
      >
        {participant.name}
      </Text>
    </group>
  );
}

function Sphere({
  participants,
  isSpinning,
  animationSpeed,
}: {
  participants: Participant[];
  isSpinning: boolean;
  animationSpeed: number;
}) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [highlightedIndices, setHighlightedIndices] = useState<Set<number>>(
    new Set()
  );

  // 计算球体表面位置 - 使用斐波那契螺旋分布
  const positions = useMemo(() => {
    const radius = 3.1;
    const positions: THREE.Vector3[] = [];
    const count = participants.length;

    if (count === 0) return positions;

    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);

      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      positions.push(new THREE.Vector3(x * radius, y * radius, z * radius));
    }

    return positions;
  }, [participants.length]);

  // 性能优化：限制同时显示的文字数量
  const MAX_VISIBLE_TEXTS = 150;
  const shouldOptimize = participants.length > MAX_VISIBLE_TEXTS;

  const visibleParticipants = useMemo(() => {
    if (!shouldOptimize) {
      return participants.map((p, i) => ({ participant: p, index: i }));
    }

    // 对于大量参与者，随机选择一部分显示
    const shuffled = [...participants]
      .map((p, i) => ({ participant: p, index: i }))
      .sort(() => Math.random() - 0.5);

    return shuffled.slice(0, MAX_VISIBLE_TEXTS);
  }, [participants, shouldOptimize]);

  // 球体旋转动画
  useFrame((state) => {
    if (groupRef.current) {
      if (isSpinning) {
        // 抽奖时快速旋转
        groupRef.current.rotation.y += animationSpeed * 0.025;
        groupRef.current.rotation.x += animationSpeed * 0.01;
      } else {
        // 初始状态下缓慢旋转
        groupRef.current.rotation.y += 0.004;
        groupRef.current.rotation.x += 0.002;
      }
    }

    // 球体轻微的呼吸效果
    if (sphereRef.current) {
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.015;
      sphereRef.current.scale.setScalar(breathe);
    }
  });

  // 随机高亮效果
  useEffect(() => {
    if (!isSpinning) {
      setHighlightedIndices(new Set());
      return;
    }

    const interval = setInterval(() => {
      const newHighlights = new Set<number>();
      const highlightCount = Math.min(5, visibleParticipants.length);

      for (let i = 0; i < highlightCount; i++) {
        const randomIndex = Math.floor(
          Math.random() * visibleParticipants.length
        );
        newHighlights.add(randomIndex);
      }

      setHighlightedIndices(newHighlights);
    }, 250);

    return () => clearInterval(interval);
  }, [isSpinning, visibleParticipants.length]);

  return (
    <group ref={groupRef}>
      {/* 主球体 - 白色光滑效果，模仿图片样式 */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshPhongMaterial
          color="#F8F8F8"
          shininess={120}
          specular="#FFFFFF"
          transparent={false}
        />
      </mesh>

      {/* 参与者文字 */}
      {visibleParticipants.map(({ participant, index }, displayIndex) => (
        <ParticipantText
          key={participant.id}
          participant={participant}
          position={positions[index] || new THREE.Vector3()}
          isHighlighted={highlightedIndices.has(displayIndex)}
          isSelected={participant.isSelected || false}
          colorIndex={index} // 使用原始索引确保颜色一致性
        />
      ))}

      {/* 显示统计信息（当优化渲染时） */}
      {shouldOptimize && (
        <Text
          position={[0, -4.2, 0]}
          fontSize={0.18}
          color="#666666"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.005}
          outlineColor="#FFFFFF"
        >
          {`显示 ${visibleParticipants.length} / ${participants.length} 位参与者`}
        </Text>
      )}
    </group>
  );
}

function CameraController({ isSpinning }: { isSpinning: boolean }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(
      isSpinning ? 0 : 7,
      isSpinning ? 0 : 2,
      isSpinning ? 10 : 7
    );
    camera.lookAt(0, 0, 0);
  }, [isSpinning, camera]);

  return null;
}

interface SphereSceneProps {
  className?: string;
}

export default function SphereScene({ className = "" }: SphereSceneProps) {
  const { participants, isSpinning, animationSpeed, state } = useLotteryStore();
  const [isReady, setIsReady] = useState(false);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [7, 2, 7], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        style={{ background: "transparent" }}
        onCreated={({ gl, scene }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          gl.shadowMap.enabled = false; // 关闭阴影以提高性能
          scene.background = null;
          setIsReady(true);
        }}
        frameloop="always"
        dpr={[1, 2]}
      >
        {/* 环境光 */}
        <ambientLight intensity={0.6} />

        {/* 主要光源 */}
        <directionalLight
          position={[10, 10, 10]}
          intensity={1.2}
          color="#FFFFFF"
        />

        {/* 辅助光源，增强球体的立体感 */}
        <pointLight position={[-8, -8, -8]} intensity={0.4} color="#E6E6FA" />
        <pointLight position={[8, 8, 8]} intensity={0.3} color="#FFF8DC" />

        {/* 相机控制器 */}
        <CameraController isSpinning={isSpinning} />

        {/* 轨道控制 */}
        <OrbitControls
          enablePan={!isSpinning}
          enableZoom={!isSpinning}
          enableRotate={!isSpinning}
          autoRotate={false}
          minDistance={6}
          maxDistance={20}
          target={[0, 0, 0]}
        />

        {/* 3D球体和参与者 */}
        {isReady && (
          <Sphere
            participants={participants}
            isSpinning={isSpinning}
            animationSpeed={animationSpeed}
          />
        )}
      </Canvas>

      {/* 状态显示 */}
      {state === LotteryState.DRAWING && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500/90 text-white px-6 py-3 rounded-lg backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            <span>球体旋转中...</span>
          </div>
        </div>
      )}

      {/* 获奖者公告 */}
      {state === LotteryState.WINNER_SELECTED && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white z-20">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-2xl text-center shadow-2xl">
            <div className="text-4xl font-bold mb-4">🎉 恭喜获奖！ 🎉</div>
            <div className="text-2xl font-semibold text-gray-800">
              {useLotteryStore.getState().currentWinner?.name}
            </div>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <div>初始化3D场景...</div>
          </div>
        </div>
      )}
    </div>
  );
}
