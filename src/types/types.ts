import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// 参与者类型
export interface Participant {
    name: string;
    position?: THREE.Vector3;
    element?: HTMLDivElement;
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