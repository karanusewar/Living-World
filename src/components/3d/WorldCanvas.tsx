import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createEnvironmentWorld, WorldEnvironment } from './EnvironmentBuilder';
import { CHAPTERS, HOTSPOTS, LIGHTING_PRESETS } from '../../lib/worldData';
import { Hotspot, TimeOfDay } from '../../types/world';

interface WorldCanvasProps {
  progress: number;
  timeOfDay: TimeOfDay;
  onProgressChange: (newProgress: number) => void;
  selectedHotspotId: string | null;
  onSelectHotspot: (hotspot: Hotspot | null) => void;
  isFreeExplore: boolean;
  onToggleFreeExplore: (enabled: boolean) => void;
  zoomFactor: number;
  onZoomChange?: (newZoom: number) => void;
}

export const WorldCanvas: React.FC<WorldCanvasProps> = ({
  progress,
  timeOfDay,
  onProgressChange,
  selectedHotspotId,
  onSelectHotspot,
  isFreeExplore,
  zoomFactor,
  onZoomChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const worldRef = useRef<WorldEnvironment | null>(null);

  // Lighting refs
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const ambLightRef = useRef<THREE.AmbientLight | null>(null);

  // Default overview camera
  const baseCamPos = useRef(new THREE.Vector3(0, 18, 48));
  const baseLookAt = useRef(new THREE.Vector3(0, 3.5, -4));

  // Interpolated camera targets
  const currentCamPos = useRef(new THREE.Vector3(0, 18, 48));
  const targetCamPos = useRef(new THREE.Vector3(0, 18, 48));
  const currentLookAt = useRef(new THREE.Vector3(0, 3.5, -4));
  const targetLookAt = useRef(new THREE.Vector3(0, 3.5, -4));

  // Mouse parallax state
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Raycasting for hotspots
  const raycaster = useRef(new THREE.Raycaster());
  const mouseCoords = useRef(new THREE.Vector2(-999, -999));
  const hoveredHotspot = useRef<Hotspot | null>(null);

  // Touch handling
  const touchStartY = useRef<number | null>(null);
  const touchStartDist = useRef<number | null>(null);

  // Calculate target camera from progress
  const getCameraTargetFromProgress = useCallback((prog: number) => {
    const clamped = Math.max(0, Math.min(1, prog));
    const segmentCount = CHAPTERS.length - 1;
    const scaled = clamped * segmentCount;
    const index = Math.min(Math.floor(scaled), segmentCount - 1);
    const fraction = scaled - index;

    const startChap = CHAPTERS[index];
    const endChap = CHAPTERS[Math.min(index + 1, segmentCount)];

    const pX = THREE.MathUtils.lerp(startChap.camera.position[0], endChap.camera.position[0], fraction);
    const pY = THREE.MathUtils.lerp(startChap.camera.position[1], endChap.camera.position[1], fraction);
    const pZ = THREE.MathUtils.lerp(startChap.camera.position[2], endChap.camera.position[2], fraction);

    const tX = THREE.MathUtils.lerp(startChap.camera.target[0], endChap.camera.target[0], fraction);
    const tY = THREE.MathUtils.lerp(startChap.camera.target[1], endChap.camera.target[1], fraction);
    const tZ = THREE.MathUtils.lerp(startChap.camera.target[2], endChap.camera.target[2], fraction);

    return {
      pos: new THREE.Vector3(pX, pY, pZ),
      target: new THREE.Vector3(tX, tY, tZ),
    };
  }, []);

  // Sync camera targets when progress, hotspot selection, or zoomFactor changes
  useEffect(() => {
    if (selectedHotspotId) {
      const hp = HOTSPOTS.find((h) => h.id === selectedHotspotId);
      if (hp) {
        // Close-up inspection target
        const target = new THREE.Vector3(hp.cameraTarget[0], hp.cameraTarget[1], hp.cameraTarget[2]);
        const offset = new THREE.Vector3(hp.cameraOffset[0], hp.cameraOffset[1], hp.cameraOffset[2]).multiplyScalar(0.45);
        const pos = target.clone().add(offset);

        targetCamPos.current.copy(pos);
        targetLookAt.current.copy(target);
        if (controlsRef.current) {
          controlsRef.current.target.copy(target);
        }
        return;
      }
    }

    // Default story / chapter target
    const { pos, target } = getCameraTargetFromProgress(progress);

    // Apply zoomFactor: interpolate position closer to target
    if (zoomFactor > 1.0) {
      const dir = pos.clone().sub(target);
      const zoomedDist = dir.length() / zoomFactor;
      dir.normalize().multiplyScalar(Math.max(5, zoomedDist));
      targetCamPos.current.copy(target.clone().add(dir));
    } else {
      targetCamPos.current.copy(pos);
    }

    targetLookAt.current.copy(target);
    if (controlsRef.current) {
      controlsRef.current.target.copy(target);
    }
  }, [progress, selectedHotspotId, zoomFactor, getCameraTargetFromProgress]);

  // Main Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const initialScheme = LIGHTING_PRESETS[timeOfDay] || LIGHTING_PRESETS.sunrise;
    scene.fog = new THREE.FogExp2(initialScheme.fogColor, initialScheme.fogDensity);

    // 2. Camera with high-fidelity perspective
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.5, 450);
    camera.position.set(0, 18, 48);
    camera.lookAt(0, 3.5, -4);
    cameraRef.current = camera;
    currentCamPos.current.copy(camera.position);

    // 3. Renderer with high-resolution visual quality
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Environment Reflection Probe (PMREM RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting
    const ambLight = new THREE.AmbientLight(initialScheme.ambientColor, initialScheme.ambientIntensity);
    scene.add(ambLight);
    ambLightRef.current = ambLight;

    const hemiLight = new THREE.HemisphereLight(
      initialScheme.hemisphereSky,
      initialScheme.hemisphereGround,
      0.95
    );
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const sunLight = new THREE.DirectionalLight(initialScheme.sunColor, initialScheme.sunIntensity);
    sunLight.position.set(initialScheme.sunPosition[0], initialScheme.sunPosition[1], initialScheme.sunPosition[2]);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 130;
    const d = 38;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // 6. OrbitControls with smooth zoom and panning
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 4; // allow zooming right up close to inspect each object!
    controls.maxDistance = 85;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.9;
    controls.enabled = true; // Always allow user to zoom & orbit!
    controlsRef.current = controls;

    let isInteracting = false;
    controls.addEventListener('start', () => {
      isInteracting = true;
    });
    controls.addEventListener('end', () => {
      isInteracting = false;
    });

    // 7. Build the 3D World with Procedural High-Res Textures
    const world = createEnvironmentWorld(scene);
    worldRef.current = world;
    world.updateLighting(initialScheme);

    // 8. Mouse move for Parallax & Raycasting
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseCoords.current.set(x, y);

      mouse.current.targetX = x * 1.5;
      mouse.current.targetY = y * 1.0;

      // Raycast against interactive hotspots
      raycaster.current.setFromCamera(mouseCoords.current, camera);
      const intersects = raycaster.current.intersectObjects(world.hotspotObjects, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.hotspot && obj.parent) {
          obj = obj.parent;
        }
        if (obj?.userData?.hotspot) {
          hoveredHotspot.current = obj.userData.hotspot;
          container.style.cursor = 'pointer';
          return;
        }
      }
      hoveredHotspot.current = null;
      container.style.cursor = 'grab';
    };

    // Click to focus landmark
    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (hoveredHotspot.current) {
        onSelectHotspot(hoveredHotspot.current);
      }
    };

    // Resize Handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Mouse parallax lerp
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

      // Update 3D World (waterfall, birds, river boat, traffic, dog tail, etc.)
      world.update(delta, elapsed, timeOfDay);

      // Camera lerp towards target
      if (!isInteracting) {
        // Controls idle: smooth glide
        currentCamPos.current.lerp(targetCamPos.current, 0.04);
        currentLookAt.current.lerp(targetLookAt.current, 0.04);

        camera.position.x = currentCamPos.current.x + mouse.current.x * 0.6;
        camera.position.y = currentCamPos.current.y - mouse.current.y * 0.4;
        camera.position.z = currentCamPos.current.z;

        camera.lookAt(
          currentLookAt.current.x + mouse.current.x * 0.15,
          currentLookAt.current.y - mouse.current.y * 0.15,
          currentLookAt.current.z
        );
      } else {
        controls.update();
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);

      world.materialsToDispose.forEach((m) => m.dispose());
      world.geometriesToDispose.forEach((g) => g.dispose());

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Lighting Scheme smoothly on timeOfDay changes
  useEffect(() => {
    const world = worldRef.current;
    const scene = sceneRef.current;
    if (!world || !scene) return;

    const scheme = LIGHTING_PRESETS[timeOfDay] || LIGHTING_PRESETS.sunrise;

    if (ambLightRef.current) {
      ambLightRef.current.color.setHex(scheme.ambientColor);
      ambLightRef.current.intensity = scheme.ambientIntensity;
    }
    if (hemiLightRef.current) {
      hemiLightRef.current.color.setHex(scheme.hemisphereSky);
      hemiLightRef.current.groundColor.setHex(scheme.hemisphereGround);
    }
    if (sunLightRef.current) {
      sunLightRef.current.color.setHex(scheme.sunColor);
      sunLightRef.current.intensity = scheme.sunIntensity;
      sunLightRef.current.position.set(scheme.sunPosition[0], scheme.sunPosition[1], scheme.sunPosition[2]);
    }
    if (scene.fog && 'color' in scene.fog) {
      (scene.fog as THREE.FogExp2).color.setHex(scheme.fogColor);
      (scene.fog as THREE.FogExp2).density = scheme.fogDensity;
    }

    world.updateLighting(scheme);
  }, [timeOfDay]);

  // Scroll Wheel listener for Zooming
  const handleWheel = (e: React.WheelEvent) => {
    if (onZoomChange) {
      const zoomDelta = -e.deltaY * 0.002;
      const nextZoom = Math.max(1.0, Math.min(5.0, zoomFactor + zoomDelta));
      onZoomChange(nextZoom);
    }
  };

  // Pinch-to-zoom on touch devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDist.current = Math.hypot(dx, dy);
    } else if (e.touches.length === 1) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDist.current !== null && onZoomChange) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / touchStartDist.current;
      touchStartDist.current = dist;
      const nextZoom = Math.max(1.0, Math.min(5.0, zoomFactor * ratio));
      onZoomChange(nextZoom);
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
    touchStartDist.current = null;
  };

  return (
    <div
      ref={mountRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="absolute inset-0 w-full h-full overflow-hidden select-none touch-none"
    />
  );
};
