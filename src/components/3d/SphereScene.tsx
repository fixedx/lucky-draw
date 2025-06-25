"use client";

import React, { useRef, useEffect, useMemo, Suspense, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { useLotteryStore } from "@/utils/lotteryStore";
import { LotteryState, type Participant } from "@/types/types";

const SPHERE_RADIUS = 3;
const MIN_VECTOR_LENGTH_SQUARED = 1e-8;

const worldUp = new THREE.Vector3(0, 1, 0);
const worldRight = new THREE.Vector3(1, 0, 0);
const worldForward = new THREE.Vector3(0, 0, 1);

interface ParticipantTextProps {
  participant: Participant;
  position: THREE.Vector3;
  normal: THREE.Vector3;
}

/* // Temporarily unused
const PARTICIPANT_COLORS = [
  '#E57373', '#81C784', '#64B5F6', '#FFD54F', '#BA68C8',
  '#4DD0E1', '#FF8A65', '#A1887F', '#90A4AE', '#7986CB',
];
*/

// 3D Text Overlay 组件 - 使用Three.js直接渲染文字，性能更好
function TextOverlay({
  participants,
  spherePoints,
}: {
  participants: Participant[];
  spherePoints: { position: THREE.Vector3; normal: THREE.Vector3 }[];
}) {
  // 可以显示更多参与者，因为Three.js Text性能更好
  const maxVisible = Math.min(participants?.length || 0, 1500);

  // 闪烁状态管理 - 每个文字的闪烁状态
  const [flashStates, setFlashStates] = useState<{
    [key: number]: {
      isFlashing: boolean;
      intensity: number;
      nextFlashTime: number;
      flashDuration: number;
    };
  }>({});

  // 如果参与者很多，均匀选择要显示的参与者索引
  const selectedIndices = useMemo(() => {
    if (!participants || participants.length === 0 || !spherePoints) return [];

    if (participants.length <= maxVisible) {
      return Array.from({ length: participants.length }, (_, i) => i);
    }

    // 使用更智能的均匀选择算法
    const indices: number[] = [];
    const step = participants.length / maxVisible;

    // 添加第一个点
    indices.push(0);

    // 添加最后一个点
    if (participants.length > 1) {
      indices.push(participants.length - 1);
    }

    // 在中间均匀分布其余的点
    for (let i = 1; i < maxVisible - 1; i++) {
      const index = Math.round(i * step);
      if (index < participants.length && !indices.includes(index)) {
        indices.push(index);
      }
    }

    // 确保索引按顺序排列
    const result = indices.sort((a, b) => a - b).slice(0, maxVisible);

    console.log(
      `显示参与者分布: 总数${participants.length}, 显示${result.length}个, 索引:`,
      result
    );

    return result;
  }, [participants, spherePoints, maxVisible]);

  // 初始化闪烁状态
  useEffect(() => {
    const newFlashStates: typeof flashStates = {};
    selectedIndices.forEach((index) => {
      newFlashStates[index] = {
        isFlashing: false,
        intensity: 0,
        nextFlashTime: Math.random() * 3000, // 0-3秒内随机开始闪烁
        flashDuration: 200 + Math.random() * 300, // 200-500ms的闪烁持续时间
      };
    });
    setFlashStates(newFlashStates);
  }, [selectedIndices]);

  // 闪烁动画逻辑
  useFrame((state) => {
    const currentTime = state.clock.elapsedTime * 1000; // 转换为毫秒

    setFlashStates((prev) => {
      const newStates = { ...prev };

      selectedIndices.forEach((index) => {
        const flashState = newStates[index];
        if (!flashState) return;

        // 检查是否应该开始闪烁
        if (!flashState.isFlashing && currentTime >= flashState.nextFlashTime) {
          flashState.isFlashing = true;
          flashState.intensity = 1;
        }

        // 处理KTV灯球式闪烁过程
        if (flashState.isFlashing) {
          // 快速衰减，像灯泡快速闪烁
          flashState.intensity = Math.max(0, flashState.intensity - 0.08);

          // 闪烁结束，设置下次闪烁时间
          if (flashState.intensity <= 0) {
            flashState.isFlashing = false;
            // 随机间隔：0.5-2秒，更频繁的闪烁
            flashState.nextFlashTime = currentTime + 500 + Math.random() * 1500;
            flashState.flashDuration = 150 + Math.random() * 200;
          }
        }
      });

      return newStates;
    });
  });

  if (!participants || participants.length === 0 || !spherePoints) return null;

  return (
    <>
      {selectedIndices.map((participantIndex) => {
        const point = spherePoints[participantIndex];
        const participant = participants[participantIndex];
        if (!participant || !point) return null;

        // 让文字完全贴在球体表面，像用笔写在球面上
        const textPosition = point.position
          .clone()
          .add(point.normal.clone().multiplyScalar(0.01));

        // 计算文字的朝向，让它完全贴合球面切线
        const up = new THREE.Vector3(0, 1, 0);
        const tangent = up.clone().cross(point.normal).normalize();
        const bitangent = point.normal.clone().cross(tangent).normalize();

        // 创建一个看向球心的朝向矩阵
        const lookAtMatrix = new THREE.Matrix4();
        lookAtMatrix.lookAt(
          textPosition,
          new THREE.Vector3(0, 0, 0), // 球心
          bitangent
        );

        const euler = new THREE.Euler();
        euler.setFromRotationMatrix(lookAtMatrix);

        // 获取当前文字的闪烁状态
        const flashState = flashStates[participantIndex];
        const isFlashing = flashState?.isFlashing || false;
        const flashIntensity = flashState?.intensity || 0;

        // 根据闪烁状态调整颜色和发光效果
        const baseColor = "#FEF3C7"; // 温暖的奶黄色文字
        const flashColor = "#FBBF24"; // 金黄色闪烁，更喜庆
        const currentColor = isFlashing
          ? `rgb(${251 + 4 * flashIntensity}, ${191 + 64 * flashIntensity}, ${
              36 + 219 * flashIntensity
            })`
          : baseColor;

        return (
          <Text
            key={participant.id || participantIndex}
            position={[textPosition.x, textPosition.y, textPosition.z]}
            rotation={[euler.x, euler.y, euler.z]}
            fontSize={0.06}
            color={currentColor}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.003}
            outlineColor={isFlashing ? "#FBBF24" : "#B91C1C"} // 闪烁时描边为金黄色，平时为深红色
            maxWidth={1.2}
            textAlign="center"
            // 让文字完全平贴在表面
            renderOrder={1}
            // 添加发光效果
            material-emissive={isFlashing ? flashColor : "#000000"}
            material-emissiveIntensity={flashIntensity * 0.5}
          >
            {participant.name}
          </Text>
        );
      })}
    </>
  );
}

interface SpherePoint {
  position: THREE.Vector3;
  normal: THREE.Vector3;
}

function Sphere({
  participants,
  isSpinning,
  animationSpeed,
  spherePoints,
}: {
  participants: Participant[];
  isSpinning: boolean;
  animationSpeed: number;
  spherePoints: SpherePoint[];
}) {
  const sphereGroupRef = useRef<THREE.Group>(null!);
  const physicalSphereRef = useRef<THREE.Mesh>(null!);
  // const [highlightedIndices, setHighlightedIndices] = useState<Set<number>>(new Set()); // Commented out as isHighlighted prop is not used

  const MAX_VISIBLE_TEXTS = Math.min(participants?.length || 0, 50); // 增加显示数量

  const visibleParticipantIndices = useMemo(() => {
    if (!participants || participants.length === 0) return [];
    return participants.map((_, i) => i);
  }, [participants]);

  useFrame(() => {
    if (sphereGroupRef.current) {
      // 只围绕Y轴旋转，不做不规则旋转
      const rotationYFactor = isSpinning ? animationSpeed * 0.15 : 0.008; // 抽奖时大幅加快旋转速度
      sphereGroupRef.current.rotation.y += rotationYFactor;
      // 移除X轴旋转，保持稳定的Y轴旋转
    }
    // 移除球体本身的额外旋转，避免重复旋转
  });

  /* // Commented out useEffect for highlighting as it's not used
   useEffect(() => {
     if (!isSpinning || visibleParticipantIndices.length === 0) {
       setHighlightedIndices(new Set());
       return;
     }
     const interval = setInterval(() => {
       const newHighlights = new Set<number>();
       const numToHighlight = Math.min(Math.max(1, Math.floor(visibleParticipantIndices.length * 0.05)), 5); 
       for (let i = 0; i < numToHighlight; i++) {
         newHighlights.add(Math.floor(Math.random() * visibleParticipantIndices.length));
       }
       setHighlightedIndices(newHighlights);
     }, 400);
     return () => clearInterval(interval);
   }, [isSpinning, visibleParticipantIndices]);
  */

  if (!participants || participants.length === 0 || spherePoints.length === 0) {
    return (
      <Text position={[0, 0, 0]} color="#B0BEC5" fontSize={0.3}>
        Loading...
      </Text>
    );
  }

  return (
    <group ref={sphereGroupRef}>
      <mesh ref={physicalSphereRef}>
        <sphereGeometry args={[SPHERE_RADIUS, 48, 48]} />
        <meshStandardMaterial
          color="#F97316" // 橘黄色
          metalness={0.5}
          roughness={0.3}
          emissive="#FBBF24" // 金黄色发光效果
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* 3D文字标签 - 跟随球体旋转 */}
      <TextOverlay participants={participants} spherePoints={spherePoints} />

      {participants.length > 0 && (
        <Text
          position={[0, -SPHERE_RADIUS - 0.6, 0]}
          fontSize={0.12}
          color="#FBBF24" // 金黄色，更加喜庆
        >
          {`共 ${participants.length} 名参与者`}
        </Text>
      )}
    </group>
  );
}

function CameraController({ isSpinning }: { isSpinning: boolean }) {
  const { camera } = useThree();

  useEffect(() => {
    const targetPos = new THREE.Vector3(
      isSpinning ? 0 : 5,
      isSpinning ? 0.5 : 2,
      isSpinning ? SPHERE_RADIUS + 4.5 : SPHERE_RADIUS + 2.5
    );
    camera.position.set(targetPos.x, targetPos.y, targetPos.z);
    camera.lookAt(0, 0, 0);
  }, [isSpinning, camera]);

  return null;
}

interface SphereSceneProps {
  className?: string;
}

export default function SphereScene({ className = "" }: SphereSceneProps) {
  const { participants, isSpinning, animationSpeed } = useLotteryStore();
  const lotteryState = useLotteryStore.getState().state;
  const currentWinner = useLotteryStore.getState().currentWinner;

  // 在这里计算spherePoints，以便传递给HTMLOverlay
  const spherePoints = useMemo(() => {
    if (!participants || participants.length === 0) return [];
    const points: SpherePoint[] = [];
    const count = participants.length;

    // 使用改进的球面均匀分布算法
    if (count === 1) {
      // 只有一个参与者时，放在球的前面
      const position = new THREE.Vector3(0, 0, SPHERE_RADIUS);
      const normal = new THREE.Vector3(0, 0, 1);
      points.push({ position, normal });
    } else {
      // 使用斐波那契球面分布算法，确保更均匀的分布
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // 黄金角度

      for (let i = 0; i < count; i++) {
        // 改进的分布计算
        const y = 1 - (2 * i) / (count - 1); // y从1到-1
        const radius = Math.sqrt(1 - y * y);

        // 使用黄金角度确保螺旋分布
        const theta = goldenAngle * i;

        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;

        const position = new THREE.Vector3(x, y, z).multiplyScalar(
          SPHERE_RADIUS
        );
        const normal = new THREE.Vector3(x, y, z).normalize();

        points.push({ position, normal });
      }
    }

    return points;
  }, [participants]);

  return (
    <div className={`relative w-full h-full ${className} bg-transparent`}>
      <Canvas
        camera={{
          position: [5, 2, SPHERE_RADIUS + 2.5],
          fov: 60,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true, // Important for transparent background of canvas itself
          powerPreference: "high-performance",
          logarithmicDepthBuffer: true, // Can help with z-fighting at scale
        }}
        style={{ background: "transparent" }} // Ensure canvas HTML element bg is transparent
        onCreated={({ gl, scene }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Adjusted for performance
          scene.background = null; // Ensure Three.js scene background is transparent
        }}
        frameloop="always" // Or "demand" if animations are not continuous
      >
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[8, 10, 12]}
          intensity={1.2}
          color="#FFFFFF"
        />
        <pointLight position={[-10, -5, -10]} intensity={0.3} color="#E0E0E0" />

        <CameraController isSpinning={isSpinning} />
        <OrbitControls
          enablePan={!isSpinning}
          enableZoom={true} // Allow zoom always
          enableRotate={!isSpinning}
          minDistance={SPHERE_RADIUS + 0.5}
          maxDistance={SPHERE_RADIUS + 10}
          target={[0, 0, 0]}
        />

        <Suspense
          fallback={
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1, 0.5, 0.1]} />
              <meshStandardMaterial color="#B0BEC5" />
            </mesh>
          }
        >
          {participants && participants.length > 0 ? (
            <Sphere
              participants={participants}
              isSpinning={isSpinning}
              animationSpeed={animationSpeed}
              spherePoints={spherePoints}
            />
          ) : (
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1, 0.5, 0.1]} />
              <meshStandardMaterial color="#B0BEC5" />
            </mesh>
          )}
        </Suspense>
      </Canvas>

      {/* State Display: Drawing */}
      {lotteryState === LotteryState.DRAWING && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-red-600/80 text-yellow-100 px-5 py-2.5 rounded-lg backdrop-blur-sm shadow-xl border border-yellow-300/30">
          <div className="flex items-center space-x-2.5">
            <div className="animate-spin w-5 h-5 border-2 border-yellow-300 border-t-transparent rounded-full"></div>
            <span className="text-sm font-medium">幸运抽取中...</span>
          </div>
        </div>
      )}

      {/* State Display: Winner Selected */}
      {lotteryState === LotteryState.WINNER_SELECTED && currentWinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-20">
          <div className="bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 p-8 rounded-xl text-center shadow-2xl max-w-sm">
            <div className="text-5xl mb-5">🎉</div>
            <div className="text-2xl font-bold text-white mb-3">恭喜中奖!</div>
            <div className="text-3xl font-semibold text-white bg-black/20 py-3 px-4 rounded-lg break-all">
              {currentWinner.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
