import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TimeOfDay } from '../../types/world';

interface AnimatedCloudsProps {
  timeOfDay: TimeOfDay;
}

interface CloudData {
  id: string;
  texturePath: string;
  origX: number; // in image coordinates (0..1376)
  origY: number; // in image coordinates (0..768)
  origW: number;
  origH: number;
  zDepth: number; // 3D depth layer for parallax
  driftSpeed: number; // units per second
  bobFreq: number;
  bobAmp: number;
  phase: number;
}

const CLOUDS_CONFIG: CloudData[] = [
  {
    id: 'left_main',
    texturePath: '/images/cloud_left_main.png',
    origX: 145,
    origY: 58,
    origW: 246,
    origH: 90,
    zDepth: 1.8,
    driftSpeed: 0.07,
    bobFreq: 0.7,
    bobAmp: 0.12,
    phase: 0.0,
  },
  {
    id: 'left_small',
    texturePath: '/images/cloud_left_small.png',
    origX: 341,
    origY: 88,
    origW: 113,
    origH: 44,
    zDepth: 1.2,
    driftSpeed: 0.09,
    bobFreq: 0.9,
    bobAmp: 0.09,
    phase: 1.7,
  },
  {
    id: 'right_small',
    texturePath: '/images/cloud_right_small.png',
    origX: 1092,
    origY: 43,
    origW: 75,
    origH: 43,
    zDepth: 1.3,
    driftSpeed: 0.065,
    bobFreq: 0.8,
    bobAmp: 0.08,
    phase: 3.2,
  },
  {
    id: 'right_main',
    texturePath: '/images/cloud_right_main.png',
    origX: 1226,
    origY: 53,
    origW: 188,
    origH: 74,
    zDepth: 2.1,
    driftSpeed: 0.08,
    bobFreq: 0.65,
    bobAmp: 0.14,
    phase: 4.8,
  },
];

function SingleCloud({
  data,
  aspectRatio,
  viewWidth,
  viewHeight,
  timeOfDay,
}: {
  data: CloudData;
  aspectRatio: number;
  viewWidth: number;
  viewHeight: number;
  timeOfDay: TimeOfDay;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Load cloud texture
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(data.texturePath);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [data.texturePath]);

  // Initial normalized coordinates mapped to 3D world space
  const initialPos = useMemo(() => {
    const nx = data.origX / 1376 - 0.5;
    const ny = 0.5 - data.origY / 768;
    return {
      x: nx * viewWidth,
      y: ny * viewHeight,
    };
  }, [data.origX, data.origY, viewWidth, viewHeight]);

  const cloudWidth = (data.origW / 1376) * viewWidth * 1.05;
  const cloudHeight = (data.origH / 768) * viewHeight * 1.05;

  // Track position offset
  const offsetRef = useRef(0);

  // Tint colors based on atmosphere
  const tint = useMemo(() => {
    if (timeOfDay === 'golden_hour') {
      return { color: new THREE.Color('#ffe2c4'), opacity: 0.98 };
    }
    if (timeOfDay === 'night') {
      return { color: new THREE.Color('#7891b8'), opacity: 0.55 };
    }
    return { color: new THREE.Color('#ffffff'), opacity: 1.0 };
  }, [timeOfDay]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    // Smooth continuous horizontal drift
    offsetRef.current += data.driftSpeed * delta * (viewWidth * 0.08);

    // Bounding limits
    const halfWidth = viewWidth * 0.75;
    let currentX = initialPos.x + offsetRef.current;

    // Seamless loop around screen
    if (currentX > halfWidth + cloudWidth) {
      offsetRef.current -= (halfWidth * 2 + cloudWidth * 2);
      currentX = initialPos.x + offsetRef.current;
    }

    // Natural undulating vertical bobbing
    const bob = Math.sin(time * data.bobFreq + data.phase) * (data.bobAmp * viewHeight * 0.035);

    // Subtle 3D breathing scale and tilt
    const breath = 1.0 + Math.sin(time * 0.45 + data.phase) * 0.015;
    const tilt = Math.sin(time * 0.6 + data.phase) * 0.02;

    meshRef.current.position.x = currentX;
    meshRef.current.position.y = initialPos.y + bob;
    meshRef.current.position.z = data.zDepth;
    meshRef.current.rotation.z = tilt;
    meshRef.current.scale.set(breath, breath, 1);
  });

  return (
    <mesh ref={meshRef} position={[initialPos.x, initialPos.y, data.zDepth]}>
      <planeGeometry args={[cloudWidth, cloudHeight]} />
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.01}
        depthWrite={false}
        color={tint.color}
        opacity={tint.opacity}
        toneMapped={false}
      />
    </mesh>
  );
}

export const AnimatedClouds: React.FC<AnimatedCloudsProps> = ({ timeOfDay }) => {
  const { viewport } = useThree();

  const imageAspect = 1376 / 768;
  const viewportAspect = viewport.width / viewport.height;

  let width = viewport.width;
  let height = viewport.height;

  if (viewportAspect > imageAspect) {
    width = viewport.width;
    height = viewport.width / imageAspect;
  } else {
    height = viewport.height;
    width = viewport.height * imageAspect;
  }

  return (
    <group name="animated-clouds">
      {CLOUDS_CONFIG.map((cloud) => (
        <SingleCloud
          key={cloud.id}
          data={cloud}
          aspectRatio={imageAspect}
          viewWidth={width}
          viewHeight={height}
          timeOfDay={timeOfDay}
        />
      ))}
    </group>
  );
};
