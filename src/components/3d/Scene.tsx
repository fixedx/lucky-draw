"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useParticipants } from "../../context/ParticipantContext";
import { useDraw } from "../../context/DrawContext";
import { Participant } from "../../types/types";
import StarField from "./effects/StarField";
import TechRings from "./effects/TechRings";

interface SceneProps {
  locale: string;
}

export default function Scene({ locale }: SceneProps) {
  const { participants } = useParticipants();
  const { isDrawing, drawSpeed, allWinners } = useDraw();

  // 初始化refs
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sphereRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);

  // 更新3D显示
  const updateParticipantsDisplay = useCallback(() => {
    if (!sphereRef.current || !sceneRef.current || !containerRef.current)
      return;

    // 清除现有内容
    while (sphereRef.current.children.length > 0) {
      sphereRef.current.remove(sphereRef.current.children[0]);
    }

    // 同时清除DOM中的标签元素
    const existingLabels = containerRef.current.querySelectorAll(".name-label");
    existingLabels.forEach((label) => label.remove());

    // 过滤掉已经中奖的参与者，确保他们不会显示在球上
    const activeParticipants = participants.filter(
      (participant) =>
        !allWinners.some((winner) => winner.name === participant.name)
    );

    // 如果没有参与者，不显示
    if (activeParticipants.length === 0) return;

    // 性能优化：定义大数据量的阈值
    const LARGE_DATASET_THRESHOLD = 500;
    const isLargeDataset = activeParticipants.length > LARGE_DATASET_THRESHOLD;

    // 计算适合参与者数量的球体半径 - 大数据量时适当调大半径
    const radius = isLargeDataset
      ? Math.max(15, Math.min(25, activeParticipants.length * 0.05))
      : Math.max(8, Math.min(14, activeParticipants.length * 0.1));

    // 创建球体中心可视化 - 更加科技感的球体
    const coreSphereGeometry = new THREE.SphereGeometry(
      radius * 0.5,
      isLargeDataset ? 16 : 32,
      isLargeDataset ? 16 : 32
    );
    const coreSphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x3366cc,
      transparent: true,
      opacity: 0.2,
      shininess: 150,
      emissive: 0x1a3366,
      emissiveIntensity: 0.5,
    });
    const coreSphereMesh = new THREE.Mesh(
      coreSphereGeometry,
      coreSphereMaterial
    );
    sphereRef.current.add(coreSphereMesh);

    // 添加内部发光球体 - 大数据量时降低多边形数量
    const glowSphereGeometry = new THREE.SphereGeometry(
      radius * 0.3,
      isLargeDataset ? 12 : 24,
      isLargeDataset ? 12 : 24
    );
    const glowSphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x66ccff,
      transparent: true,
      opacity: 0.6,
      shininess: 200,
      emissive: 0x66ccff,
      emissiveIntensity: 1,
    });
    const glowSphereMesh = new THREE.Mesh(
      glowSphereGeometry,
      glowSphereMaterial
    );
    sphereRef.current.add(glowSphereMesh);

    // 添加网格效果 - 外球体网格
    const wireframeGeometry = new THREE.SphereGeometry(
      radius * 0.6,
      isLargeDataset ? 8 : 16,
      isLargeDataset ? 8 : 16
    );
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    sphereRef.current.add(wireframeMesh);

    // 调整相机位置，确保能看到整个球体
    if (cameraRef.current) {
      cameraRef.current.position.z = radius * 3;
    }

    // 根据数据量渲染参与者 - 大数据量时跳过一部分渲染以提高性能
    const MAX_DISPLAY_COUNT = 1500; // 设置最大显示数量为1500
    let displayCount;

    // 确定显示数量
    if (activeParticipants.length > MAX_DISPLAY_COUNT) {
      // 当参与者超过1500时，固定显示1500个
      displayCount = MAX_DISPLAY_COUNT;
    } else {
      // 小数据量时显示全部
      displayCount = activeParticipants.length;
    }

    console.log(`准备显示参与者: ${displayCount}/${activeParticipants.length}`);

    // 改进的抽样策略 - 保证准确数量
    const sampledParticipants: Participant[] = [];

    if (activeParticipants.length > displayCount) {
      // 直接随机抽样，不使用步进方式，确保精确数量
      // 复制数组，避免修改原数组
      const participantsCopy = [...activeParticipants];

      // Fisher-Yates 洗牌算法，随机打乱数组
      for (let i = participantsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [participantsCopy[i], participantsCopy[j]] = [
          participantsCopy[j],
          participantsCopy[i],
        ];
      }

      // 选取前displayCount个元素
      sampledParticipants.push(...participantsCopy.slice(0, displayCount));
    } else {
      // 数量不足MAX_DISPLAY_COUNT时直接使用全部
      sampledParticipants.push(...activeParticipants);
    }

    console.log(`实际抽样数量: ${sampledParticipants.length}`);

    // 创建临时场景组，稍后一次性添加所有对象（减少重绘次数）
    const tempGroup = new THREE.Group();

    // 性能优化：大数据量时使用共享材质和几何体
    let sharedGeometry;
    let sharedLineMaterial;
    const materials = new Map(); // 缓存材质以重用

    if (isLargeDataset) {
      sharedGeometry = new THREE.PlaneGeometry(2.8, 1.4); // 稍小一些以节省资源
    }

    // 预设一些颜色以重用 - 大数据量时不需要每个参与者都有唯一颜色
    const presetColors = [];
    for (let i = 0; i < 20; i++) {
      const hue = (i * 18) % 360;
      presetColors.push(hue);
    }

    for (let i = 0; i < sampledParticipants.length; i++) {
      const participant = sampledParticipants[i];
      const index = i;

      // 计算在球体上的位置（均匀分布）
      const phi = Math.acos(-1 + (2 * index) / sampledParticipants.length);
      const theta = Math.sqrt(sampledParticipants.length * Math.PI) * phi;

      // 球面上的位置（基础位置）
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      // 检查计算出的坐标是否有效
      if (
        isNaN(x) ||
        isNaN(y) ||
        isNaN(z) ||
        !isFinite(x) ||
        !isFinite(y) ||
        !isFinite(z)
      ) {
        console.warn(`跳过无效坐标的参与者 ${index}:`, participant.name);
        continue;
      }

      // 性能优化：大数据量时使用共享材质和简化的Canvas处理
      let material;
      let texture;

      // 在大数据量时，使用共享/缓存的材质
      if (isLargeDataset) {
        // 使用预设颜色而不是生成唯一颜色
        const colorIndex = index % presetColors.length;
        const hue = presetColors[colorIndex];

        // 检查材质缓存
        if (materials.has(colorIndex)) {
          material = materials.get(colorIndex);
        } else {
          // 创建较小的canvas来减少内存和处理时间
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = 128; // 降低纹理分辨率
          canvas.height = 64;

          if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);

            // 简化的渐变背景
            context.fillStyle = `hsla(${hue}, 70%, 60%, 0.9)`;
            context.fillRect(0, 0, canvas.width, canvas.height);

            // 简化的边框
            context.strokeStyle = `hsla(${hue}, 80%, 40%, 0.7)`;
            context.lineWidth = 2;
            context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

            // 名字 - 简化字体设置
            context.fillStyle = "#ffffff";
            context.font = "bold 18px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";

            // 性能优化：长名字截断以提高渲染性能
            let displayName = participant.name;
            if (displayName.length > 10) {
              displayName = displayName.substring(0, 10) + "...";
            }

            context.fillText(displayName, canvas.width / 2, canvas.height / 2);
          }

          texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;
          texture.minFilter = THREE.LinearFilter; // 减少mipmapping处理

          material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide,
          });

          // 缓存这个材质以便重用
          materials.set(colorIndex, material);
        }
      } else {
        // 小数据量的原始高质量渲染处理
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = 160;
        canvas.height = 80;

        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);

          // 设置背景（半透明渐变）
          const gradient = context.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            5,
            canvas.width / 2,
            canvas.height / 2,
            40
          );

          // 根据索引创建不同的颜色
          const hue = (index * 137.5) % 360; // 黄金角分布，避免颜色聚集
          gradient.addColorStop(0, `hsla(${hue}, 80%, 80%, 0.95)`);
          gradient.addColorStop(1, `hsla(${hue}, 60%, 50%, 0.8)`);

          context.fillStyle = gradient;
          context.fillRect(0, 0, canvas.width, canvas.height);

          // 绘制边框
          context.strokeStyle = `hsla(${hue}, 90%, 40%, 0.8)`;
          context.lineWidth = 2;
          context.roundRect(2, 2, canvas.width - 4, canvas.height - 4, 10);
          context.stroke();

          // 绘制名字
          context.fillStyle = "#ffffff";
          context.font = "bold 22px Arial";
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillText(
            participant.name,
            canvas.width / 2,
            canvas.height / 2
          );

          // 添加发光效果
          context.shadowColor = `hsla(${hue}, 100%, 70%, 0.8)`;
          context.shadowBlur = 10;
          context.fillText(
            participant.name,
            canvas.width / 2,
            canvas.height / 2
          );
        }

        texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide,
        });
      }

      // 计算刺的延伸距离 - 大数据量时适当缩短以减少视觉复杂度
      const spikeLength = isLargeDataset ? radius * 0.6 : radius * 0.8;
      const cardOffset = isLargeDataset ? 0.5 : 0.8;

      // 方向向量（从球心指向球面位置）
      const dir = new THREE.Vector3(x, y, z).normalize();

      // 名片的位置（位于刺的末端）
      const cardX = dir.x * (radius + spikeLength + cardOffset);
      const cardY = dir.y * (radius + spikeLength + cardOffset);
      const cardZ = dir.z * (radius + spikeLength + cardOffset);

      // 创建平面几何体（名片）- 大数据量时使用共享几何体
      const geometry = isLargeDataset
        ? sharedGeometry
        : new THREE.PlaneGeometry(3.2, 1.6);
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(cardX, cardY, cardZ);

      // 名片朝向与方向向量垂直
      plane.lookAt(0, 0, 0);
      plane.rotateY(Math.PI); // 旋转使文字正向显示

      // 创建刺的几何体（连接球心到名片）
      const spikeStart = new THREE.Vector3(
        dir.x * radius * 0.5,
        dir.y * radius * 0.5,
        dir.z * radius * 0.5
      );
      const spikeEnd = new THREE.Vector3(
        dir.x * (radius + spikeLength),
        dir.y * (radius + spikeLength),
        dir.z * (radius + spikeLength)
      );

      // 安全检查：确保创建的向量不包含NaN值
      const isValidVector = (v: THREE.Vector3) =>
        !isNaN(v.x) &&
        !isNaN(v.y) &&
        !isNaN(v.z) &&
        isFinite(v.x) &&
        isFinite(v.y) &&
        isFinite(v.z);

      if (!isValidVector(spikeStart) || !isValidVector(spikeEnd)) {
        console.warn("跳过包含NaN值的刺:", index, participant.name);
        continue; // 跳过这个参与者
      }

      // 优化: 大数据量时使用共享材质
      let spikeMaterial;
      if (isLargeDataset) {
        if (!sharedLineMaterial) {
          sharedLineMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(`hsl(210, 80%, 60%)`),
            linewidth: 1,
            opacity: 0.6,
            transparent: true,
          });
        }
        spikeMaterial = sharedLineMaterial;
      } else {
        // 使用与名片相同的颜色
        const colorHue = (index * 137.5) % 360;
        spikeMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color(`hsl(${colorHue}, 80%, 60%)`),
          linewidth: 2,
          opacity: 0.7,
          transparent: true,
        });
      }

      // 创建几何体并确保点是有效的
      const spikeGeometry = new THREE.BufferGeometry().setFromPoints([
        spikeStart,
        spikeEnd,
      ]);

      // 额外安全检查：尝试预先计算边界，捕获潜在错误
      try {
        spikeGeometry.computeBoundingSphere();
        if (
          !spikeGeometry.boundingSphere ||
          isNaN(spikeGeometry.boundingSphere.radius)
        ) {
          console.warn("跳过边界计算失败的刺:", index, participant.name);
          continue; // 如果边界球计算失败，跳过这个参与者
        }
      } catch (e) {
        console.warn("边界计算错误:", e);
        continue; // 出现异常时跳过
      }

      const spike = new THREE.Line(spikeGeometry, spikeMaterial);

      // 添加到临时组
      tempGroup.add(spike);
      tempGroup.add(plane);

      // 保存位置信息
      participant.position = new THREE.Vector3(cardX, cardY, cardZ);
    }

    // 一次性添加所有对象，减少重绘次数
    if (sphereRef.current) {
      sphereRef.current.add(tempGroup);

      // 添加调试信息
      console.log(`实际添加到球体的对象数量: ${tempGroup.children.length / 2}`); // 每个参与者有2个对象：线和平面

      // 添加数字标记 - 仅在开发模式使用
      if (process.env.NODE_ENV === "development") {
        // 在球体上添加数量标记，便于调试
        const countLabel = document.createElement("div");
        countLabel.className = "debug-count-label";
        countLabel.style.position = "absolute";
        countLabel.style.bottom = "70px";
        countLabel.style.right = "10px";
        countLabel.style.background = "rgba(0,0,0,0.7)";
        countLabel.style.color = "white";
        countLabel.style.padding = "5px 10px";
        countLabel.style.borderRadius = "3px";
        countLabel.style.fontSize = "12px";
        countLabel.style.zIndex = "1000";
        // countLabel.textContent = `显示: ${tempGroup.children.length / 2}/${
        //   participants.length
        // }`;
        containerRef.current?.appendChild(countLabel);
      }
    }

    // 清理内存
    if (isLargeDataset) {
      // 强制执行垃圾回收（仅用于调试）
      // if (window.gc) window.gc();
    }
  }, [participants, allWinners]);

  // 初始化3D场景
  useEffect(() => {
    if (!containerRef.current) return;

    // 清理之前的场景
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    // 移除可能存在的调试标记
    const existingLabels = document.querySelectorAll(".debug-count-label");
    existingLabels.forEach((label) => label.remove());

    // 设置场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x061433); // 深科技蓝背景
    sceneRef.current = scene;

    // 设置相机
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    // 调整相机位置，确保能看到整个球体
    const radius = Math.max(10, Math.min(18, participants.length * 0.12));
    camera.position.z = radius * 2.2;
    cameraRef.current = camera;

    // 设置渲染器 - 性能优化：降低分辨率和精度
    const renderer = new THREE.WebGLRenderer({
      antialias: participants.length < 1000, // 大数据量时关闭抗锯齿
      precision: participants.length > 2000 ? "lowp" : "mediump", // 大数据量时降低精度
      powerPreference: "high-performance",
      alpha: false, // 禁用alpha通道以提高性能
      stencil: false, // 禁用模板缓冲区以提高性能
      depth: true, // 保留深度缓冲区
    });

    // 设置像素比例 - 重要的性能因素
    const getOptimalPixelRatio = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;

      if (participants.length > 3000) return Math.min(1.0, devicePixelRatio);
      if (participants.length > 1500) return Math.min(1.25, devicePixelRatio);
      if (participants.length > 800) return Math.min(1.5, devicePixelRatio);

      return devicePixelRatio;
    };

    renderer.setPixelRatio(getOptimalPixelRatio());
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 添加控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enabled = !isDrawing; // 根据当前抽奖状态设置控制器启用状态
    controls.autoRotate = false; // 禁用自动旋转
    controlsRef.current = controls;

    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // 添加光线效果 - 大数据量时简化光照
    if (participants.length < 2000) {
      const pointLight = new THREE.PointLight(0x3366ff, 3, 50);
      pointLight.position.set(0, 10, 0);
      scene.add(pointLight);
    }

    // 创建一个空的球形组
    const sphere = new THREE.Group();
    scene.add(sphere);
    sphereRef.current = sphere;

    // 添加星星背景 - 大数据量时减少星星数量
    const starCount = participants.length > 1000 ? 300 : 800;
    StarField({ scene, count: starCount });

    // 添加科技风格的环形
    TechRings({ scene });

    // 窗口大小变化时调整
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current)
        return;

      cameraRef.current.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    // 初始渲染 - 确保DOM已完全创建
    renderer.render(scene, camera);

    // 更新参与者显示
    if (participants.length > 0 && sphereRef.current) {
      updateParticipantsDisplay();
    }

    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [isDrawing, participants.length, updateParticipantsDisplay, locale]); // 添加locale作为依赖项

  // 动画循环
  useEffect(() => {
    // 确保所有必要的3D对象都已初始化
    if (
      !sceneRef.current ||
      !cameraRef.current ||
      !rendererRef.current ||
      !sphereRef.current
    )
      return;

    // 确保参与者已显示在球体上
    if (participants.length > 0 && sphereRef.current.children.length === 0) {
      updateParticipantsDisplay();
    }

    // 性能优化：大数据量时降低动画复杂度
    const isLargeDataset = participants.length > 500;

    // 帧率控制 - 用于流畅动画
    const clock = new THREE.Clock();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let frameCounter = 0;
    let accumulatedTime = 0;

    // 更加平滑的旋转控制
    const rotationSpeed = isDrawing ? 0.5 * drawSpeed : 0.05;
    let targetRotationSpeed = rotationSpeed;
    let currentRotationSpeed = 0;

    // 计算呼吸效果
    let breathingPhase = 0;

    // 优化动画循环 - 使用基于时间的动画
    const animate = () => {
      // 设置下一帧的动画请求
      animationIdRef.current = requestAnimationFrame(animate);

      try {
        // 时间增量计算
        const delta = clock.getDelta();
        accumulatedTime += delta;
        frameCounter++;

        // 每秒计算一次平均帧率（仅用于调试）
        if (accumulatedTime >= 1.0) {
          // console.log(`FPS: ${frameCounter}`);
          frameCounter = 0;
          accumulatedTime = 0;
        }

        // 平滑旋转速度补间
        currentRotationSpeed +=
          (targetRotationSpeed - currentRotationSpeed) *
          Math.min(1.0, delta * 3.0);

        // 控制器更新
        if (controlsRef.current) {
          controlsRef.current.update();
        }

        // 优化大数据量时的渲染频率
        const shouldSkipFrame =
          isLargeDataset && Math.random() > (isDrawing ? 0.9 : 0.8);
        if (shouldSkipFrame) {
          // 即使跳过复杂更新，也要确保基本的旋转
          if (sphereRef.current) {
            if (
              !isNaN(currentRotationSpeed) &&
              isFinite(currentRotationSpeed)
            ) {
              sphereRef.current.rotation.y += delta * currentRotationSpeed;
            }
          }

          // 渲染场景
          if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
          }
          return;
        }

        if (sphereRef.current) {
          // 更新旋转 - 使用平滑的动画速度
          if (!isNaN(currentRotationSpeed) && isFinite(currentRotationSpeed)) {
            sphereRef.current.rotation.y += delta * currentRotationSpeed;
          } else {
            // 如果发现无效值，重置旋转速度
            console.warn("检测到无效的旋转速度，重置中...");
            currentRotationSpeed = isDrawing ? 0.2 : 0.05;
          }

          // 更新呼吸效果 - 动画速度根据数据量调整
          breathingPhase += delta * (isLargeDataset ? 0.4 : 0.8);
          const breathingScale =
            1 + Math.sin(breathingPhase) * (isLargeDataset ? 0.02 : 0.04);

          // 安全检查：确保缩放比例不是NaN
          const safeScale =
            isNaN(breathingScale) || !isFinite(breathingScale)
              ? 1.0
              : breathingScale;

          // 优化：大数据集时只更新少量关键元素
          if (isLargeDataset) {
            // 仅处理前几个子元素（通常是球体核心部分）
            const coreElements = Math.min(5, sphereRef.current.children.length);
            for (let i = 0; i < coreElements; i++) {
              const child = sphereRef.current.children[i];

              if (child instanceof THREE.Mesh) {
                // 简化缩放计算
                child.scale.setScalar(safeScale);

                // 网格球体简单旋转
                if (child.material.wireframe === true) {
                  child.rotation.y -= delta * 0.2;
                  if (isDrawing) child.rotation.x += delta * 0.1;
                }
              }
            }
          } else {
            // 小数据量时的完整动画效果
            sphereRef.current.children.forEach((child) => {
              if (child instanceof THREE.Line) {
                // 微弱的呼吸效果 - 仅在抽奖时应用
                if (isDrawing) {
                  const scaleFactor = safeScale * 1.05;
                  child.scale.setScalar(scaleFactor);
                }
              } else if (
                child instanceof THREE.Mesh &&
                child.geometry instanceof THREE.SphereGeometry
              ) {
                // 核心球体
                if (child.material.opacity < 0.4) {
                  child.scale.setScalar(safeScale * 1.1);
                  // 透明度变化
                  if (isDrawing) {
                    child.material.opacity =
                      0.2 + Math.sin(breathingPhase) * 0.1;
                  }
                }
                // 内部发光球体
                else if (child.material.opacity > 0.5) {
                  child.scale.setScalar(
                    isDrawing ? safeScale * 0.9 : safeScale
                  );
                  // 发光强度
                  if (child.material.emissiveIntensity !== undefined) {
                    const targetIntensity = isDrawing ? 1.2 : 0.7;
                    const variation = isDrawing ? 0.4 : 0.2;
                    child.material.emissiveIntensity =
                      targetIntensity + Math.sin(breathingPhase) * variation;
                  }
                }
              } else if (
                child instanceof THREE.Mesh &&
                child.material.wireframe === true
              ) {
                // 网格球体旋转 - 更平滑的旋转
                child.rotation.y -= delta * (isDrawing ? 0.3 : 0.1);
                if (isDrawing) child.rotation.x += delta * 0.15;
                // 透明度变化
                if (isDrawing) {
                  child.material.opacity =
                    0.3 + Math.sin(breathingPhase * 2) * 0.15;
                }
              }
            });
          }
        }

        // 渲染场景
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      } catch (error) {
        // 捕获所有渲染错误，防止循环中断
        console.error("渲染循环中发生错误:", error);

        // 尝试恢复渲染 - 如果错误连续出现过多，考虑重置场景
        if (
          sphereRef.current &&
          rendererRef.current &&
          sceneRef.current &&
          cameraRef.current
        ) {
          try {
            // 最小化渲染 - 只渲染核心球体
            const childrenToHide: THREE.Object3D[] = [];
            sphereRef.current.children.forEach((child, i) => {
              if (i > 3) {
                // 保留前几个核心对象（通常是球体本身）
                child.visible = false;
                childrenToHide.push(child);
              }
            });

            // 尝试安全渲染
            rendererRef.current.render(sceneRef.current, cameraRef.current);

            // 恢复可见性
            childrenToHide.forEach((child) => {
              child.visible = true;
            });
          } catch (e) {
            console.error("恢复渲染失败:", e);
          }
        }
      }
    };

    // 处理动画速度变化
    const updateRotationSpeed = () => {
      targetRotationSpeed = isDrawing ? 0.5 * drawSpeed : 0.05;
    };
    updateRotationSpeed();

    // 启动动画循环
    animate();

    // 清理函数
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [
    isDrawing,
    drawSpeed,
    participants.length,
    updateParticipantsDisplay,
    locale,
  ]);

  // 监听抽奖状态变化，更新动画效果
  useEffect(() => {
    // 如果3D场景尚未准备好，直接返回
    if (!controlsRef.current || !sphereRef.current) return;

    // 根据抽奖状态更新控制器
    controlsRef.current.enabled = !isDrawing;
  }, [isDrawing]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen absolute top-0 left-0 z-0"
    />
  );
}
