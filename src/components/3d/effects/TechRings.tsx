"use client";

import * as THREE from "three";

interface TechRingsProps {
  scene: THREE.Scene;
}

export default function TechRings({ scene }: TechRingsProps) {
  // 外环
  const outerRingGeometry = new THREE.RingGeometry(25, 26, 60);
  const outerRingMaterial = new THREE.MeshBasicMaterial({
    color: 0x0066ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
  });
  const outerRing = new THREE.Mesh(outerRingGeometry, outerRingMaterial);
  outerRing.rotation.x = Math.PI / 2;
  scene.add(outerRing);

  // 中环
  const middleRingGeometry = new THREE.RingGeometry(20, 20.5, 60);
  const middleRingMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ccff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.4,
  });
  const middleRing = new THREE.Mesh(middleRingGeometry, middleRingMaterial);
  middleRing.rotation.x = Math.PI / 2;
  scene.add(middleRing);

  // 内环
  const innerRingGeometry = new THREE.RingGeometry(18, 18.3, 60);
  const innerRingMaterial = new THREE.MeshBasicMaterial({
    color: 0x33ffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
  });
  const innerRing = new THREE.Mesh(innerRingGeometry, innerRingMaterial);
  innerRing.rotation.x = Math.PI / 2;
  scene.add(innerRing);

  return null; // 不渲染任何UI内容，仅处理Three.js场景
}
