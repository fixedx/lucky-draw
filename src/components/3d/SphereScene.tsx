"use client";

import React, { useRef, useEffect, useMemo, Suspense, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
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

// HTML Overlay 组件 - 使用Html组件在Canvas内部渲染
function HTMLOverlay({
  participants,
  spherePoints,
}: {
  participants: Participant[];
  spherePoints: { position: THREE.Vector3; normal: THREE.Vector3 }[];
}) {
  if (!participants || participants.length === 0 || !spherePoints) return null;

  // 只显示前几个参与者作为测试
  const maxVisible = Math.min(3, participants.length);

  return (
    <>
      {spherePoints.slice(0, maxVisible).map((point, index) => {
        const participant = participants[index];
        if (!participant || !point) return null;

        return (
          <Html
            key={participant.id || index}
            position={[point.position.x, point.position.y, point.position.z]}
            distanceFactor={10}
            occlude={false}
            transform={false}
            sprite={true}
          >
            <div className="text-white text-sm font-medium bg-black/70 px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap pointer-events-none">
              {participant.name}
            </div>
          </Html>
        );
      })}
    </>
  );
}

function ParticipantText({
  participant,
  position,
  normal,
}: ParticipantTextProps) {
  // 使用简单的球体标记，文字由HTML overlay显示
  return (
    <mesh position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial color="orange" />
    </mesh>
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

  const MAX_VISIBLE_TEXTS = Math.min(1, participants?.length || 0);

  const visibleParticipantIndices = useMemo(() => {
    if (!participants || participants.length === 0) return [];
    if (participants.length <= MAX_VISIBLE_TEXTS) {
      return participants.map((_, i) => i);
    }
    const indices = Array.from({ length: participants.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, MAX_VISIBLE_TEXTS);
  }, [participants, MAX_VISIBLE_TEXTS]);

  useFrame(() => {
    if (sphereGroupRef.current) {
      const rotationYFactor = isSpinning ? animationSpeed * 0.02 : 0.003;
      const rotationXFactor = isSpinning ? animationSpeed * 0.005 : 0.0015;
      sphereGroupRef.current.rotation.y += rotationYFactor;
      sphereGroupRef.current.rotation.x += rotationXFactor;
    }
    if (physicalSphereRef.current) {
      physicalSphereRef.current.rotation.y += 0.0005;
    }
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
          color="#E0E0E0" // Light grey / silver
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {visibleParticipantIndices.map((originalIndex) => {
        const participant = participants[originalIndex];
        const point = spherePoints[originalIndex];

        if (!participant || !point || !point.position || !point.normal) {
          return null;
        }
        return (
          <ParticipantText
            key={participant.id || originalIndex}
            participant={participant}
            position={point.position}
            normal={point.normal}
          />
        );
      })}

      {participants.length > MAX_VISIBLE_TEXTS && MAX_VISIBLE_TEXTS > 0 && (
        <Text
          position={[0, -SPHERE_RADIUS - 0.6, 0]}
          fontSize={0.12}
          color="#B0BEC5"
        >
          {`显示 ${MAX_VISIBLE_TEXTS} / ${participants.length} 名`}
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
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      const position = new THREE.Vector3(x, y, z).multiplyScalar(SPHERE_RADIUS);
      const normal = new THREE.Vector3(x, y, z).normalize();
      points.push({ position, normal });
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

          {/* HTML Overlay - 使用Html组件在Canvas内部 */}
          <HTMLOverlay
            participants={participants || []}
            spherePoints={spherePoints}
          />
        </Suspense>
      </Canvas>

      {/* State Display: Drawing */}
      {lotteryState === LotteryState.DRAWING && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-5 py-2.5 rounded-lg backdrop-blur-sm shadow-xl">
          <div className="flex items-center space-x-2.5">
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span className="text-sm">幸运抽取中...</span>
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
