import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// 参与者类型
export interface Participant {
    id: string;
    name: string;
    position?: THREE.Vector3;
    element?: HTMLDivElement;
    isSelected?: boolean;
    isHighlighted?: boolean;
    avatar?: string;
    isFlashing?: boolean;
}

// 抽奖状态枚举
export enum LotteryState {
    IDLE = 'idle',
    DRAWING = 'drawing',
    WINNER_SELECTED = 'winner_selected',
    ANIMATING = 'animating'
}

// 抽奖系统状态
export interface LotteryStatus {
    state: LotteryState;
    participants: Participant[];
    winners: Participant[];
    currentWinner?: Participant;
    isSpinning: boolean;
    animationSpeed: number;
}

// 3D场景引用类型
export interface SceneRefs {
    containerRef: React.RefObject<HTMLDivElement>;
    sceneRef: React.RefObject<THREE.Scene | null>;
    cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
    rendererRef: React.RefObject<THREE.WebGLRenderer | null>;
    controlsRef: React.RefObject<OrbitControls | null>;
    sphereRef: React.RefObject<THREE.Group | null>;
    animationIdRef: React.RefObject<number | null>;
    fullscreenRef: React.RefObject<HTMLDivElement | null>;
}

// 粒子效果类型
export interface Particle {
    x: string;
    y: string;
    size: string;
    delay: string;
    key: number;
}

// 动画配置类型
export interface AnimationConfig {
    sphereSpeed: number;
    highlightIntensity: number;
    particleCount: number;
    winnerAnimationDuration: number;
}

// 存储数据类型
export interface StorageData {
    originalParticipants: string[];
    winners: string[];
    lastUpdated: string;
}

// 3D球体网格类型
export interface SphereParticipant {
    participant: Participant;
    mesh: THREE.Mesh;
    originalPosition: THREE.Vector3;
    textSprite?: THREE.Sprite;
} 