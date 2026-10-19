import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TimeOfDay } from '../../types/world';

interface FlockOfBirdsProps {
  timeOfDay: TimeOfDay;
}

interface BirdIndividual {
  offset: THREE.Vector3;
  wingPhase: number;
  flapSpeed: number;
  glideTimer: number;
  glideDuration: number;
  isGliding: boolean;
  scale: number;
}

// Low-poly 3D Bird Component with articulated flapping wings
function SingleBird3D({
  bird,
  timeOfDay,
}: {
  bird: BirdIndividual;
  timeOfDay: TimeOfDay;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);

  // Low-poly materials: charcoal feather body and white wing highlights
  const { bodyMat, wingHighlightMat } = useMemo(() => {
    let bodyColor = '#242830';
    let highlightColor = '#f0f5fa';

    if (timeOfDay === 'golden_hour') {
      bodyColor = '#3a2e2d';
      highlightColor = '#ffeed6';
    } else if (timeOfDay === 'night') {
      bodyColor = '#151a24';
      highlightColor = '#8fa3bd';
    }

    return {
      bodyMat: new THREE.MeshStandardMaterial({
        color: bodyColor,
        roughness: 0.5,
        metalness: 0.1,
        flatShading: true,
      }),
      wingHighlightMat: new THREE.MeshStandardMaterial({
        color: highlightColor,
        roughness: 0.3,
        metalness: 0.15,
        flatShading: true,
      }),
    };
  }, [timeOfDay]);

  // Low-poly geometries
  const { bodyGeo, wingGeo, tipGeo } = useMemo(() => {
    // Tapered diamond body
    const bGeo = new THREE.ConeGeometry(0.022, 0.13, 4);
    bGeo.rotateX(Math.PI / 2); // Point forward along -Z or +X

    // Wing: flat triangular wedge
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.09, 0.04);
    shape.lineTo(0.07, -0.025);
    shape.closePath();

    const extrudeSettings = { depth: 0.005, bevelEnabled: false };
    const wGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Wing tip highlight
    const tipShape = new THREE.Shape();
    tipShape.moveTo(0.06, 0.02);
    tipShape.lineTo(0.09, 0.04);
    tipShape.lineTo(0.075, 0.005);
    tipShape.closePath();
    const tGeo = new THREE.ExtrudeGeometry(tipShape, { depth: 0.006, bevelEnabled: false });

    return { bodyGeo: bGeo, wingGeo: wGeo, tipGeo: tGeo };
  }, []);

  return (
    <group ref={groupRef} position={bird.offset} scale={bird.scale}>
      {/* Fuselage / Body */}
      <mesh geometry={bodyGeo} material={bodyMat} />

      {/* Left Wing Group (Pivot at x = -0.015) */}
      <group ref={leftWingRef} position={[-0.012, 0.008, 0]}>
        <group rotation={[0, Math.PI, 0]}>
          <mesh geometry={wingGeo} material={bodyMat} />
          <mesh geometry={tipGeo} material={wingHighlightMat} position={[0, 0, 0.001]} />
        </group>
      </group>

      {/* Right Wing Group (Pivot at x = +0.015) */}
      <group ref={rightWingRef} position={[0.012, 0.008, 0]}>
        <mesh geometry={wingGeo} material={bodyMat} />
        <mesh geometry={tipGeo} material={wingHighlightMat} position={[0, 0, 0.001]} />
      </group>
    </group>
  );
}

export const FlockOfBirds: React.FC<FlockOfBirdsProps> = ({ timeOfDay }) => {
  const flockRef = useRef<THREE.Group>(null);
  const birdsDataRef = useRef<BirdIndividual[]>([]);
  const birdMeshesRef = useRef<{
    leftWing: THREE.Group | null;
    rightWing: THREE.Group | null;
    root: THREE.Group | null;
  }[]>([]);

  const { viewport } = useThree();

  const imageAspect = 1376 / 768;
  const viewportAspect = viewport.width / viewport.height;
  let viewWidth = viewport.width;
  let viewHeight = viewport.height;
  if (viewportAspect > imageAspect) {
    viewWidth = viewport.width;
    viewHeight = viewport.width / imageAspect;
  } else {
    viewHeight = viewport.height;
    viewWidth = viewport.height * imageAspect;
  }

  // Initial center position matching original birds location in image
  // Image coords: x ~ 820, y ~ 115
  const baseFlockPos = useMemo(() => {
    const nx = 820 / 1376 - 0.5;
    const ny = 0.5 - 115 / 768;
    return new THREE.Vector3(nx * viewWidth, ny * viewHeight, 3.2);
  }, [viewWidth, viewHeight]);

  // Create 18 birds in a cohesive V-formation with realistic natural dispersal
  const birds = useMemo(() => {
    const list: BirdIndividual[] = [];
    const count = 18;

    for (let i = 0; i < count; i++) {
      let ox = 0;
      let oy = 0;
      let oz = 0;

      if (i === 0) {
        // Leader bird
        ox = 0;
        oy = 0;
        oz = 0;
      } else {
        const side = i % 2 === 0 ? 1 : -1;
        const tier = Math.ceil(i / 2);
        ox = side * tier * 0.055 + (Math.sin(i * 3.4) * 0.02);
        oy = -tier * 0.028 + (Math.cos(i * 2.1) * 0.015);
        oz = -tier * 0.035 + (Math.sin(i * 1.7) * 0.02);
      }

      list.push({
        offset: new THREE.Vector3(ox, oy, oz),
        wingPhase: (i * 0.45) % (Math.PI * 2),
        flapSpeed: 16 + (i % 5) * 1.8, // 16 to 25 rad/s
        glideTimer: Math.random() * 3,
        glideDuration: 1.6 + Math.random() * 2.0,
        isGliding: false,
        scale: 0.95 + (Math.sin(i * 5) * 0.15),
      });
    }

    birdsDataRef.current = list;
    return list;
  }, []);

  useFrame((state, delta) => {
    if (!flockRef.current) return;
    const time = state.clock.elapsedTime;

    // Parametric Soaring Path across the sky and mountain peaks
    // The flock circles gracefully across the mountain ridge
    const pathSpeed = 0.16;
    const pathTime = time * pathSpeed;

    // Elegant figure-8 / elliptical soaring orbit
    const orbitRadiusX = viewWidth * 0.38;
    const orbitRadiusY = viewHeight * 0.12;

    const currentX = baseFlockPos.x + Math.sin(pathTime) * orbitRadiusX;
    const currentY = baseFlockPos.y + Math.sin(pathTime * 2) * orbitRadiusY * 0.6 + Math.cos(pathTime) * 0.08;
    const currentZ = baseFlockPos.z + Math.cos(pathTime) * 0.8;

    flockRef.current.position.set(currentX, currentY, currentZ);

    // Calculate heading direction (tangent of path) for banking and facing
    const tangentX = Math.cos(pathTime) * orbitRadiusX;
    const tangentY = 2 * Math.cos(pathTime * 2) * orbitRadiusY * 0.6;

    const angle = Math.atan2(tangentY, tangentX);
    // Face the flight direction
    flockRef.current.rotation.y = -angle * 0.35 + Math.PI / 12;
    // Bank into turns
    flockRef.current.rotation.z = Math.cos(pathTime) * 0.25;

    // Animate each bird's wings and individual micro-motions
    birdMeshesRef.current.forEach((meshObj, i) => {
      const bird = birdsDataRef.current[i];
      if (!bird || !meshObj.leftWing || !meshObj.rightWing) return;

      // Update gliding timer
      bird.glideTimer += delta;
      if (!bird.isGliding && bird.glideTimer > 2.8 + (i % 3)) {
        bird.isGliding = true;
        bird.glideTimer = 0;
      } else if (bird.isGliding && bird.glideTimer > bird.glideDuration) {
        bird.isGliding = false;
        bird.glideTimer = 0;
      }

      if (bird.isGliding) {
        // Smooth transition to glide dihedral angle (~8-12 degrees)
        meshObj.leftWing.rotation.z = THREE.MathUtils.lerp(meshObj.leftWing.rotation.z, 0.14, 0.12);
        meshObj.rightWing.rotation.z = THREE.MathUtils.lerp(meshObj.rightWing.rotation.z, -0.14, 0.12);
      } else {
        // Flapping cycle
        const flapAngle = Math.sin(time * bird.flapSpeed + bird.wingPhase) * 0.65;
        meshObj.leftWing.rotation.z = flapAngle;
        meshObj.rightWing.rotation.z = -flapAngle;
      }

      // Micro-bobbing of individual bird in wind
      if (meshObj.root) {
        meshObj.root.position.y = bird.offset.y + Math.sin(time * 3 + bird.wingPhase) * 0.008;
      }
    });
  });

  return (
    <group ref={flockRef} position={baseFlockPos} name="flock-of-birds">
      {birds.map((bird, i) => (
        <group
          key={i}
          ref={(el) => {
            if (!birdMeshesRef.current[i]) {
              birdMeshesRef.current[i] = { leftWing: null, rightWing: null, root: null };
            }
            if (el) {
              birdMeshesRef.current[i].root = el;
              // Grab children groups for wings
              const singleGroup = el.children[0] as THREE.Group | undefined;
              if (singleGroup) {
                birdMeshesRef.current[i].leftWing = (singleGroup.children[1] as THREE.Group) || null;
                birdMeshesRef.current[i].rightWing = (singleGroup.children[2] as THREE.Group) || null;
              }
            }
          }}
        >
          <SingleBird3D bird={bird} timeOfDay={timeOfDay} />
        </group>
      ))}
    </group>
  );
};
