"use client";

import * as THREE from "three";

interface StarFieldProps {
  scene: THREE.Scene;
  count: number;
}

export default function StarField({ scene, count }: StarFieldProps) {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
  });

  const starVertices = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
  );
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  return null; // 不渲染任何UI内容，仅处理Three.js场景
}
