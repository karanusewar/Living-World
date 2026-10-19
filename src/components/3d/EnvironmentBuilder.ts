import * as THREE from 'three';
import { HOTSPOTS } from '../../lib/worldData';
import {
  createWoodTexture,
  createStoneMasonryTexture,
  createRoofTileTexture,
  createCobblestoneTexture,
  createShopSignTexture,
  createWindowTexture,
  createPainterCanvasTexture,
} from './ProceduralTextures';

export interface WorldEnvironment {
  group: THREE.Group;
  update: (delta: number, elapsed: number, timeOfDay: string) => void;
  updateLighting: (scheme: {
    skyTop: number;
    skyBottom: number;
    fogColor: number;
    sunColor: number;
    sunIntensity: number;
    sunPosition: [number, number, number];
    ambientColor: number;
    ambientIntensity: number;
    hemisphereSky: number;
    hemisphereGround: number;
    streetLightIntensity: number;
    windowGlowIntensity: number;
  }) => void;
  hotspotObjects: THREE.Object3D[];
  materialsToDispose: THREE.Material[];
  geometriesToDispose: THREE.BufferGeometry[];
}

export function createEnvironmentWorld(scene: THREE.Scene): WorldEnvironment {
  const group = new THREE.Group();
  scene.add(group);

  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  function trackMat<T extends THREE.Material>(mat: T): T {
    materialsToDispose.push(mat);
    return mat;
  }
  function trackGeo<T extends THREE.BufferGeometry>(geo: T): T {
    geometriesToDispose.push(geo);
    return geo;
  }

  // --- PROCEDURAL HIGH-RESOLUTION PBR TEXTURES ---
  const woodTexture = createWoodTexture({ baseColor: '#84532e', ringColor: '#583419', planks: true });
  woodTexture.repeat.set(3, 3);

  const trayWoodTexture = createWoodTexture({ baseColor: '#522f18', ringColor: '#361c0d', planks: false });
  trayWoodTexture.repeat.set(6, 1);

  const stoneTexture = createStoneMasonryTexture();
  stoneTexture.repeat.set(4, 4);

  const roofOrangeTexture = createRoofTileTexture('terracotta');
  roofOrangeTexture.repeat.set(3, 3);

  const roofSlateTexture = createRoofTileTexture('slate');
  roofSlateTexture.repeat.set(3, 3);

  const cobblestoneTexture = createCobblestoneTexture();
  cobblestoneTexture.repeat.set(6, 3);

  const windowTexture = createWindowTexture();
  const painterCanvasTexture = createPainterCanvasTexture();

  const bakerySignTexture = createShopSignTexture({
    title: 'BAKERY',
    subtext: 'BOULANGERIE',
    bgColor: '#962d1f',
    textColor: '#ffffff',
    accentColor: '#f5cd79'
  });

  const espressoSignTexture = createShopSignTexture({
    title: 'ESPRESSO',
    subtext: 'CAFE & ROASTERY',
    bgColor: '#2c1e13',
    textColor: '#f5f6fa',
    accentColor: '#e1b12c'
  });

  const marketSignTexture = createShopSignTexture({
    title: 'LOCAL MARKET',
    subtext: 'FRESH PRODUCE',
    bgColor: '#194d33',
    textColor: '#ffffff',
    accentColor: '#78e08f'
  });

  // --- PBR MATERIALS ---
  const matGrass = trackMat(new THREE.MeshStandardMaterial({
    color: 0x6bb354,
    roughness: 0.8,
    metalness: 0.05,
    flatShading: true,
  }));

  const matParkGrass = trackMat(new THREE.MeshStandardMaterial({
    color: 0x78c25d,
    roughness: 0.8,
    metalness: 0.05,
    flatShading: true,
  }));

  const matPath = trackMat(new THREE.MeshStandardMaterial({
    color: 0xe0d6c3,
    roughness: 0.85,
    metalness: 0.05,
    flatShading: true,
  }));

  const matRoad = trackMat(new THREE.MeshStandardMaterial({
    map: cobblestoneTexture,
    roughness: 0.7,
    metalness: 0.1,
  }));

  const matSidewalk = trackMat(new THREE.MeshStandardMaterial({
    map: stoneTexture,
    roughness: 0.75,
    metalness: 0.1,
  }));

  const matWood = trackMat(new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.6,
    metalness: 0.08,
  }));

  const matDioramaTray = trackMat(new THREE.MeshStandardMaterial({
    map: trayWoodTexture,
    roughness: 0.35,
    metalness: 0.15,
  }));

  const matBrassPlaque = trackMat(new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.85,
  }));

  const matStoneBridge = trackMat(new THREE.MeshStandardMaterial({
    map: stoneTexture,
    roughness: 0.7,
    metalness: 0.1,
  }));

  const matRockMountain = trackMat(new THREE.MeshStandardMaterial({
    color: 0x67728f,
    roughness: 0.9,
    metalness: 0.05,
    flatShading: true,
  }));

  const matSnow = trackMat(new THREE.MeshStandardMaterial({
    color: 0xf6f9fe,
    roughness: 0.3,
    metalness: 0.1,
    flatShading: true,
  }));

  const matPineGreen = trackMat(new THREE.MeshStandardMaterial({
    color: 0x224c3e,
    roughness: 0.75,
    metalness: 0.05,
    flatShading: true,
  }));

  const matPineIndigo = trackMat(new THREE.MeshStandardMaterial({
    color: 0x36486e,
    roughness: 0.75,
    metalness: 0.05,
    flatShading: true,
  }));

  const matRoofOrange = trackMat(new THREE.MeshStandardMaterial({
    map: roofOrangeTexture,
    roughness: 0.55,
    metalness: 0.1,
  }));

  const matRoofSlate = trackMat(new THREE.MeshStandardMaterial({
    map: roofSlateTexture,
    roughness: 0.5,
    metalness: 0.1,
  }));

  // Glowing Windows Material
  const matWindow = trackMat(new THREE.MeshStandardMaterial({
    map: windowTexture,
    emissiveMap: windowTexture,
    emissive: new THREE.Color(0xffbb44),
    emissiveIntensity: 0.4,
    roughness: 0.25,
    metalness: 0.1,
  }));

  // Crystal Material (Rich translucent gem glass with emissive core)
  const matCrystalBlue = trackMat(new THREE.MeshPhysicalMaterial({
    color: 0x48dbfb,
    emissive: 0x0abde3,
    emissiveIntensity: 0.45,
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.7,
    ior: 1.54,
    flatShading: true,
  }));

  const matCrystalViolet = trackMat(new THREE.MeshPhysicalMaterial({
    color: 0xa55eea,
    emissive: 0x8854d0,
    emissiveIntensity: 0.4,
    roughness: 0.12,
    metalness: 0.1,
    transmission: 0.65,
    ior: 1.54,
    flatShading: true,
  }));

  // Water Material with turquoise transparency and reflections
  const matWater = trackMat(new THREE.MeshStandardMaterial({
    color: 0x38c0d8,
    roughness: 0.15,
    metalness: 0.2,
    transparent: true,
    opacity: 0.88,
    flatShading: true,
  }));

  const streetLights: THREE.PointLight[] = [];

  // --- SKY DOME & SUN BURST ---
  const skyGeo = trackGeo(new THREE.SphereGeometry(180, 24, 16));
  const skyMat = trackMat(new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      topColor: { value: new THREE.Color(0xffa478) },
      bottomColor: { value: new THREE.Color(0x98b8ec) },
      offset: { value: 15 },
      exponent: { value: 0.7 },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
      }
    `,
  }));
  const skyMesh = new THREE.Mesh(skyGeo, skyMat);
  group.add(skyMesh);

  // Sun Disc in distance behind mountains
  const sunGeo = trackGeo(new THREE.CircleGeometry(8, 24));
  const sunMat = trackMat(new THREE.MeshBasicMaterial({
    color: 0xfff6cf,
    transparent: true,
    opacity: 0.95,
  }));
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.position.set(14, 18, -75);
  sunMesh.lookAt(0, 18, 48);
  group.add(sunMesh);

  // Sun Corona Glow Flare
  const sunGlowGeo = trackGeo(new THREE.CircleGeometry(24, 24));
  const sunGlowMat = trackMat(new THREE.MeshBasicMaterial({
    color: 0xffb578,
    transparent: true,
    opacity: 0.45,
  }));
  const sunGlowMesh = new THREE.Mesh(sunGlowGeo, sunGlowMat);
  sunGlowMesh.position.set(14, 18, -76);
  sunGlowMesh.lookAt(0, 18, 48);
  group.add(sunGlowMesh);

  // Twinkling Night Stars
  const starGeo = trackGeo(new THREE.BufferGeometry());
  const starCount = 380;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 160;
    const sinPhi = Math.sin(phi);
    const y = Math.abs(r * Math.cos(phi)) + 15;
    const x = r * sinPhi * Math.sin(theta);
    const z = r * sinPhi * Math.cos(theta);
    starPos[i * 3] = x;
    starPos[i * 3 + 1] = y;
    starPos[i * 3 + 2] = z;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = trackMat(new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2.0,
    transparent: true,
    opacity: 0.0,
  }));
  const starPoints = new THREE.Points(starGeo, starMat);
  group.add(starPoints);

  // Drifting low-poly volumetric clouds
  const clouds: { mesh: THREE.Group; speed: number }[] = [];
  function createCloud(x: number, y: number, z: number, scale: number): THREE.Group {
    const cloud = new THREE.Group();
    const puffMat = trackMat(new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0.0,
      flatShading: true,
    }));
    const puffs = 5;
    for (let i = 0; i < puffs; i++) {
      const puffGeo = trackGeo(new THREE.DodecahedronGeometry(1.6 + Math.random() * 1.1, 1));
      const puff = new THREE.Mesh(puffGeo, puffMat);
      puff.position.set((i - puffs / 2) * 1.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 1.2);
      puff.scale.set(1 + Math.random() * 0.3, 0.7 + Math.random() * 0.4, 1 + Math.random() * 0.3);
      cloud.add(puff);
    }
    cloud.position.set(x, y, z);
    cloud.scale.setScalar(scale);
    group.add(cloud);
    clouds.push({ mesh: cloud, speed: 0.3 + Math.random() * 0.3 });
    return cloud;
  }
  createCloud(-35, 26, -45, 2.2);
  createCloud(25, 28, -50, 2.5);
  createCloud(-15, 32, -60, 3.0);
  createCloud(45, 24, -40, 2.0);

  // Circling Birds
  const birdGroup = new THREE.Group();
  const birds: { mesh: THREE.Mesh; phase: number; radius: number; speed: number; baseAngle: number }[] = [];
  const birdGeo = trackGeo(new THREE.ConeGeometry(0.3, 0.8, 3));
  birdGeo.rotateX(Math.PI / 2);
  const birdMat = trackMat(new THREE.MeshBasicMaterial({ color: 0x3d3545 }));
  for (let i = 0; i < 8; i++) {
    const b = new THREE.Mesh(birdGeo, birdMat);
    b.scale.set(1.4, 0.3, 1.0);
    birdGroup.add(b);
    birds.push({
      mesh: b,
      phase: i * 0.7,
      radius: 18 + i * 2.5,
      speed: 0.25 + i * 0.02,
      baseAngle: (i / 8) * Math.PI * 0.5,
    });
  }
  birdGroup.position.set(8, 22, -35);
  group.add(birdGroup);

  // --- BACKGROUND MOUNTAIN CHAIN ---
  function createMountain(x: number, y: number, z: number, radius: number, height: number, colorBase: number, snowHeightRatio = 0.62) {
    const mtnGroup = new THREE.Group();
    const geo = trackGeo(new THREE.ConeGeometry(radius, height, 7, 3));
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const py = pos.getY(i);
      if (py > -height / 2 + 1) {
        const px = pos.getX(i);
        const pz = pos.getZ(i);
        pos.setX(i, px + (Math.sin(i * 1.5) * 0.8));
        pos.setZ(i, pz + (Math.cos(i * 2.1) * 0.8));
      }
    }
    geo.computeVertexNormals();

    const mMat = trackMat(new THREE.MeshStandardMaterial({
      color: colorBase,
      roughness: 0.9,
      metalness: 0.05,
      flatShading: true,
    }));
    const baseMesh = new THREE.Mesh(geo, mMat);
    baseMesh.position.y = height / 2;
    mtnGroup.add(baseMesh);

    // Snow Cap
    const capHeight = height * (1 - snowHeightRatio);
    const capRadius = radius * (1 - snowHeightRatio) * 1.08;
    const capGeo = trackGeo(new THREE.ConeGeometry(capRadius, capHeight, 7, 2));
    const capMesh = new THREE.Mesh(capGeo, matSnow);
    capMesh.position.y = height - capHeight / 2 + 0.1;
    mtnGroup.add(capMesh);

    mtnGroup.position.set(x, y, z);
    group.add(mtnGroup);
    return mtnGroup;
  }

  createMountain(0, 0, -42, 26, 32, 0x556082, 0.58);
  createMountain(-24, 0, -48, 22, 26, 0x4f5a7d, 0.65);
  createMountain(-48, 0, -52, 25, 24, 0x4b5578, 0.70);
  createMountain(26, 0, -45, 24, 28, 0x5a658a, 0.62);
  createMountain(52, 0, -50, 22, 25, 0x525c80, 0.68);
  createMountain(-16, 0, -32, 16, 17, 0x5b687f, 0.85);
  createMountain(18, 0, -34, 15, 16, 0x647087, 0.88);

  // --- CASCADING WATERFALL & GORGE ---
  const cliffGeo = trackGeo(new THREE.BoxGeometry(16, 14, 12));
  const cliffMesh = new THREE.Mesh(cliffGeo, matRockMountain);
  cliffMesh.position.set(-1, 5, -24);
  cliffMesh.castShadow = true;
  cliffMesh.receiveShadow = true;
  group.add(cliffMesh);

  // Cascading Waterfall steps
  const waterfallSteps = 4;
  for (let i = 0; i < waterfallSteps; i++) {
    const stepGeo = trackGeo(new THREE.BoxGeometry(3.8 - i * 0.3, 3.2, 2.5));
    const stepMesh = new THREE.Mesh(stepGeo, matWater);
    stepMesh.position.set(-1, 10 - i * 2.6, -23 + i * 2.2);
    group.add(stepMesh);
  }

  // Waterfall Mist Spray
  const mistCount = 50;
  const mistGeo = trackGeo(new THREE.BufferGeometry());
  const mistPos = new Float32Array(mistCount * 3);
  for (let i = 0; i < mistCount; i++) {
    mistPos[i * 3] = -1 + (Math.random() - 0.5) * 4.5;
    mistPos[i * 3 + 1] = 2.0 + Math.random() * 2.5;
    mistPos[i * 3 + 2] = -14 + (Math.random() - 0.5) * 3.5;
  }
  mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPos, 3));
  const mistMat = trackMat(new THREE.PointsMaterial({
    color: 0xe6fbff,
    size: 1.2,
    transparent: true,
    opacity: 0.75,
  }));
  const mistPoints = new THREE.Points(mistGeo, mistMat);
  group.add(mistPoints);

  // --- WINDING RIVER CHANNEL & WATER SURFACE ---
  const riverCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1, 1.2, -16),
    new THREE.Vector3(-0.5, 1.1, -8),
    new THREE.Vector3(0.5, 1.0, 3),
    new THREE.Vector3(2.5, 0.9, 14),
    new THREE.Vector3(4.5, 0.8, 28),
    new THREE.Vector3(6.0, 0.7, 42),
  ]);

  const riverPts = riverCurve.getPoints(36);
  const riverGeo = trackGeo(new THREE.BufferGeometry());
  const riverVerts: number[] = [];
  const riverIndices: number[] = [];
  const riverWidth = 5.6;

  for (let i = 0; i < riverPts.length; i++) {
    const pt = riverPts[i];
    const tangent = (i < riverPts.length - 1)
      ? new THREE.Vector3().subVectors(riverPts[i + 1], pt).normalize()
      : new THREE.Vector3().subVectors(pt, riverPts[i - 1]).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

    riverVerts.push(pt.x - normal.x * (riverWidth * 0.5), pt.y, pt.z - normal.z * (riverWidth * 0.5));
    riverVerts.push(pt.x + normal.x * (riverWidth * 0.5), pt.y, pt.z + normal.z * (riverWidth * 0.5));

    if (i < riverPts.length - 1) {
      const idx = i * 2;
      riverIndices.push(idx, idx + 1, idx + 2);
      riverIndices.push(idx + 1, idx + 3, idx + 2);
    }
  }
  riverGeo.setAttribute('position', new THREE.Float32BufferAttribute(riverVerts, 3));
  riverGeo.setIndex(riverIndices);
  riverGeo.computeVertexNormals();

  const riverMesh = new THREE.Mesh(riverGeo, matWater);
  group.add(riverMesh);

  // Riverbed underneath
  const riverbedGeo = riverGeo.clone();
  geometriesToDispose.push(riverbedGeo);
  const riverbedMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x243a4d, roughness: 0.9, flatShading: true }));
  const riverbedMesh = new THREE.Mesh(riverbedGeo, riverbedMat);
  riverbedMesh.position.y = -0.4;
  group.add(riverbedMesh);

  // --- WOODEN ROWBOAT WITH TWO PEOPLE ROWING ---
  const boatGroup = new THREE.Group();
  const boatHullGeo = trackGeo(new THREE.BoxGeometry(1.2, 0.5, 2.4));
  const boatHull = new THREE.Mesh(boatHullGeo, matWood);
  boatGroup.add(boatHull);

  // Wooden Seats
  const seat1 = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.1, 0.1, 0.3)), matWood);
  seat1.position.set(0, 0.2, -0.4);
  boatGroup.add(seat1);

  const seat2 = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.1, 0.1, 0.3)), matWood);
  seat2.position.set(0, 0.2, 0.4);
  boatGroup.add(seat2);

  // Wooden Oars
  const oarGeo = trackGeo(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 5));
  const oarL = new THREE.Mesh(oarGeo, matWood);
  oarL.position.set(-0.9, 0.2, 0);
  oarL.rotation.set(0.2, 0, 0.7);
  boatGroup.add(oarL);

  const oarR = new THREE.Mesh(oarGeo, matWood);
  oarR.position.set(0.9, 0.2, 0);
  oarR.rotation.set(0.2, 0, -0.7);
  boatGroup.add(oarR);

  // Two Rowers
  const rower1 = new THREE.Group();
  rower1.add(new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.2, 0.18, 0.6, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0xe67e22 }))));
  const rHead1 = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.18, 5, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0xffd1b3 })));
  rHead1.position.y = 0.45;
  rower1.add(rHead1);
  rower1.position.set(0, 0.45, -0.4);
  boatGroup.add(rower1);

  const rower2 = new THREE.Group();
  rower2.add(new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.2, 0.18, 0.6, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0x9b59b6 }))));
  const rHead2 = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.18, 5, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0xffd1b3 })));
  rHead2.position.y = 0.45;
  rower2.add(rHead2);
  rower2.position.set(0, 0.45, 0.4);
  boatGroup.add(rower2);

  boatGroup.position.set(1.5, 1.25, 12);
  group.add(boatGroup);

  // --- MAIN TERRAIN PLATFORMS ---
  // Left Park Land
  const parkTerrGeo = trackGeo(new THREE.CylinderGeometry(28, 30, 3, 14));
  const parkTerrMesh = new THREE.Mesh(parkTerrGeo, matParkGrass);
  parkTerrMesh.position.set(-18, 0, 10);
  parkTerrMesh.scale.set(1.1, 1, 1.3);
  parkTerrMesh.receiveShadow = true;
  group.add(parkTerrMesh);

  // Right Village Land
  const villageTerrGeo = trackGeo(new THREE.CylinderGeometry(28, 30, 3, 14));
  const villageTerrMesh = new THREE.Mesh(villageTerrGeo, matGrass);
  villageTerrMesh.position.set(20, 0.3, 10);
  villageTerrMesh.scale.set(1.1, 1, 1.3);
  villageTerrMesh.receiveShadow = true;
  group.add(villageTerrMesh);

  // Upper Hillside for town villas
  const upperVillageHill = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(18, 22, 4, 10)),
    matGrass
  );
  upperVillageHill.position.set(28, 2.2, -6);
  upperVillageHill.receiveShadow = true;
  group.add(upperVillageHill);

  // --- THE WOODEN DIORAMA TRAY (MANDATORY EXACT MATCH WITH ARTWORK!) ---
  const dioramaTrayGroup = new THREE.Group();

  // Front lip of wooden tray
  const frontLipGeo = trackGeo(new THREE.BoxGeometry(64, 1.8, 2.2));
  const frontLip = new THREE.Mesh(frontLipGeo, matDioramaTray);
  frontLip.position.set(0, 0.4, 30);
  frontLip.castShadow = true;
  dioramaTrayGroup.add(frontLip);

  // Golden Brass Plaque centered on front tray
  const plaqueGeo = trackGeo(new THREE.BoxGeometry(10, 0.8, 0.1));
  const plaqueMesh = new THREE.Mesh(plaqueGeo, matBrassPlaque);
  plaqueMesh.position.set(0, 0.4, 31.12);
  dioramaTrayGroup.add(plaqueMesh);

  // Left frame rim
  const leftLipGeo = trackGeo(new THREE.BoxGeometry(2.2, 1.8, 48));
  const leftLip = new THREE.Mesh(leftLipGeo, matDioramaTray);
  leftLip.position.set(-32, 0.4, 7);
  dioramaTrayGroup.add(leftLip);

  // Right frame rim
  const rightLipGeo = trackGeo(new THREE.BoxGeometry(2.2, 1.8, 48));
  const rightLip = new THREE.Mesh(rightLipGeo, matDioramaTray);
  rightLip.position.set(32, 0.4, 7);
  dioramaTrayGroup.add(rightLip);

  group.add(dioramaTrayGroup);

  // --- LUMINOUS BLUE CRYSTAL CLUSTERS (FOREGROUND RIVERBANKS) ---
  function createCrystalCluster(x: number, y: number, z: number, count = 7, scale = 1.0): THREE.Group {
    const cGroup = new THREE.Group();
    cGroup.position.set(x, y, z);

    for (let c = 0; c < count; c++) {
      const height = (1.5 + Math.random() * 2.2) * scale;
      const radius = (0.35 + Math.random() * 0.35) * scale;
      const crystalGeo = trackGeo(new THREE.ConeGeometry(radius, height, 5, 1));
      const mat = (c % 3 === 0) ? matCrystalViolet : matCrystalBlue;
      const crystal = new THREE.Mesh(crystalGeo, mat);

      const angle = (c / count) * Math.PI * 2;
      const dist = (0.4 + Math.random() * 0.8) * scale;
      crystal.position.set(Math.cos(angle) * dist, height / 2, Math.sin(angle) * dist);

      // Tilt crystal outwards
      crystal.rotation.x = (Math.random() - 0.5) * 0.4;
      crystal.rotation.z = (Math.random() - 0.5) * 0.4;
      crystal.rotation.y = Math.random() * Math.PI;

      cGroup.add(crystal);
    }

    // Glowing PointLight inside crystal cluster
    const cLight = new THREE.PointLight(0x00d2d3, 1.4, 8);
    cLight.position.set(0, 1.5 * scale, 0);
    cGroup.add(cLight);
    streetLights.push(cLight);

    group.add(cGroup);
    return cGroup;
  }

  // Left Foreground Crystal Cluster (in front of Mateo & jogger path)
  createCrystalCluster(-5.5, 1.1, 23, 8, 1.2);
  // Right Foreground Crystal Cluster (near flowerbed on market bank)
  createCrystalCluster(7.5, 1.0, 24, 7, 1.0);

  // --- ARCHED STONE BRIDGE ---
  const bridgeGroup = new THREE.Group();

  // Roadway arch deck with cobblestones
  const bridgeDeckGeo = trackGeo(new THREE.BoxGeometry(9.6, 0.6, 3.8));
  const bridgeDeck = new THREE.Mesh(bridgeDeckGeo, matRoad);
  bridgeDeck.position.set(0.8, 2.8, 3.2);
  bridgeDeck.castShadow = true;
  bridgeDeck.receiveShadow = true;
  bridgeGroup.add(bridgeDeck);

  // Stone Arch Pier Left & Right with masonry blocks
  const pierL = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(1.2, 1.6, 2.8, 8)), matStoneBridge);
  pierL.position.set(-2.6, 1.4, 3.2);
  pierL.castShadow = true;
  bridgeGroup.add(pierL);

  const pierR = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(1.2, 1.6, 2.8, 8)), matStoneBridge);
  pierR.position.set(4.2, 1.4, 3.2);
  pierR.castShadow = true;
  bridgeGroup.add(pierR);

  // Stone Balustrades with parapet cap
  const balustradeGeo = trackGeo(new THREE.BoxGeometry(9.6, 0.6, 0.3));
  const balustradeF = new THREE.Mesh(balustradeGeo, matStoneBridge);
  balustradeF.position.set(0.8, 3.3, 1.5);
  bridgeGroup.add(balustradeF);

  const balustradeB = new THREE.Mesh(balustradeGeo, matStoneBridge);
  balustradeB.position.set(0.8, 3.3, 4.9);
  bridgeGroup.add(balustradeB);

  // Victorian Wrought-Iron Street Lanterns on Bridge
  function createBridgeLantern(x: number, y: number, z: number) {
    const lGroup = new THREE.Group();
    lGroup.position.set(x, y, z);
    const post = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.04, 0.05, 1.2, 6)), trackMat(new THREE.MeshStandardMaterial({ color: 0x222f3e, roughness: 0.3 })));
    post.position.y = 0.6;
    lGroup.add(post);

    const lantern = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.25, 0.35, 0.25)), trackMat(new THREE.MeshStandardMaterial({
      color: 0xffeaa7,
      emissive: 0xffaa00,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    })));
    lantern.position.y = 1.25;
    lGroup.add(lantern);

    const lLight = new THREE.PointLight(0xffb74d, 1.0, 7);
    lLight.position.y = 1.25;
    lGroup.add(lLight);
    streetLights.push(lLight);

    bridgeGroup.add(lGroup);
  }
  createBridgeLantern(-3.4, 3.2, 1.5);
  createBridgeLantern(5.0, 3.2, 1.5);
  createBridgeLantern(-3.4, 3.2, 4.9);
  createBridgeLantern(5.0, 3.2, 4.9);

  // Pedestrians on bridge
  const walker1 = new THREE.Group();
  walker1.add(new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.2, 0.18, 0.8, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0x3498db }))));
  const wHead1 = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.18, 5, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0xffd1b3 })));
  wHead1.position.y = 0.55;
  walker1.add(wHead1);
  walker1.position.set(-0.5, 3.5, 3.0);
  bridgeGroup.add(walker1);

  const walker2 = new THREE.Group();
  walker2.add(new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.2, 0.18, 0.8, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0xe74c3c }))));
  const wHead2 = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.18, 5, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0xffd1b3 })));
  wHead2.position.y = 0.55;
  walker2.add(wHead2);
  walker2.position.set(1.8, 3.5, 3.4);
  bridgeGroup.add(walker2);

  group.add(bridgeGroup);

  // --- SUNNY MEADOW PARK (LEFT WING) ---
  // Winding Paved Paths
  function createPavedPathSegment(x: number, y: number, z: number, w: number, l: number, rotY: number) {
    const pGeo = trackGeo(new THREE.BoxGeometry(w, 0.15, l));
    const pMesh = new THREE.Mesh(pGeo, matPath);
    pMesh.position.set(x, y, z);
    pMesh.rotation.y = rotY;
    pMesh.receiveShadow = true;
    group.add(pMesh);
  }
  createPavedPathSegment(-8, 1.58, 12, 3.2, 14, 0.35);
  createPavedPathSegment(-14, 1.58, 6, 3.0, 12, -0.6);
  createPavedPathSegment(-18, 1.58, 14, 3.0, 16, 0.8);
  createPavedPathSegment(-5, 1.58, 4, 3.2, 8, 0.1);

  // PLAYGROUND
  const playgroundGroup = new THREE.Group();
  playgroundGroup.position.set(-22, 1.5, 9);

  // Sand Pit Base
  const sandGeo = trackGeo(new THREE.CylinderGeometry(7, 7.5, 0.2, 12));
  const matSand = trackMat(new THREE.MeshStandardMaterial({ color: 0xe8d5a8, roughness: 0.9, flatShading: true }));
  const sandMesh = new THREE.Mesh(sandGeo, matSand);
  sandMesh.receiveShadow = true;
  playgroundGroup.add(sandMesh);

  // Play Tower with Ladder & Roof
  const towerGeo = trackGeo(new THREE.BoxGeometry(2.4, 3.2, 2.4));
  const matTower = trackMat(new THREE.MeshStandardMaterial({ color: 0x3498db, roughness: 0.6 }));
  const towerMesh = new THREE.Mesh(towerGeo, matTower);
  towerMesh.position.set(0, 1.7, 0);
  towerMesh.castShadow = true;
  playgroundGroup.add(towerMesh);

  const roofGeo = trackGeo(new THREE.ConeGeometry(2.2, 1.6, 4));
  roofGeo.rotateY(Math.PI / 4);
  const roofMesh = new THREE.Mesh(roofGeo, matRoofOrange);
  roofMesh.position.set(0, 3.8, 0);
  roofMesh.castShadow = true;
  playgroundGroup.add(roofMesh);

  // Red Slide
  const slideGeo = trackGeo(new THREE.BoxGeometry(1.2, 0.2, 4.2));
  const matSlide = trackMat(new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.3 }));
  const slideMesh = new THREE.Mesh(slideGeo, matSlide);
  slideMesh.position.set(0, 1.2, 2.8);
  slideMesh.rotation.x = 0.55;
  slideMesh.castShadow = true;
  playgroundGroup.add(slideMesh);

  // Swing Set
  const swingGroup = new THREE.Group();
  swingGroup.position.set(-4.2, 0, 0);
  const aFrameGeo = trackGeo(new THREE.CylinderGeometry(0.1, 0.1, 3.2, 5));
  const poleL1 = new THREE.Mesh(aFrameGeo, matWood);
  poleL1.position.set(0, 1.5, -1.2);
  poleL1.rotation.x = 0.25;
  swingGroup.add(poleL1);

  const poleL2 = new THREE.Mesh(aFrameGeo, matWood);
  poleL2.position.set(0, 1.5, 1.2);
  poleL2.rotation.x = -0.25;
  swingGroup.add(poleL2);

  const topBar = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.1, 0.1, 3.4, 5)), matWood);
  topBar.position.set(1.5, 2.9, 0);
  topBar.rotation.z = Math.PI / 2;
  swingGroup.add(topBar);

  const swingSeats: THREE.Group[] = [];
  for (let s = 0; s < 2; s++) {
    const sw = new THREE.Group();
    sw.position.set(0.8 + s * 1.4, 2.8, 0);
    const rope = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.02, 0.02, 2.0, 4)), matWood);
    rope.position.y = -1.0;
    sw.add(rope);
    const seat = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.5, 0.1, 0.3)), matSlide);
    seat.position.y = -2.0;
    sw.add(seat);
    swingGroup.add(sw);
    swingSeats.push(sw);
  }
  playgroundGroup.add(swingGroup);

  // Kids playing
  function createKid(x: number, y: number, z: number, color: number) {
    const kid = new THREE.Group();
    const body = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.6, 5)), trackMat(new THREE.MeshStandardMaterial({ color })));
    const head = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.18, 5, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0xffd1b3 })));
    head.position.y = 0.42;
    kid.add(body);
    kid.add(head);
    kid.position.set(x, y, z);
    return kid;
  }
  playgroundGroup.add(createKid(1.5, 0.3, 2.2, 0xffa43b));
  playgroundGroup.add(createKid(-1.8, 0.3, -1.5, 0x2ecc71));
  playgroundGroup.add(createKid(0.8, 1.2, 1.4, 0x9b59b6));

  group.add(playgroundGroup);

  // YOGA LAWN (Morning wellness)
  const yogaGroup = new THREE.Group();
  yogaGroup.position.set(-13, 1.5, 8);
  const matColors = [0x54a0ff, 0x1dd1a1, 0xff6b6b, 0xfeca57];
  const yogaPeople: THREE.Group[] = [];

  for (let y = 0; y < 4; y++) {
    const matMesh = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.9, 0.05, 1.8)),
      trackMat(new THREE.MeshStandardMaterial({ color: matColors[y], roughness: 0.6 }))
    );
    matMesh.position.set((y % 2) * 2.2 - 1.1, 0.04, Math.floor(y / 2) * 2.4 - 1.2);
    yogaGroup.add(matMesh);

    const person = new THREE.Group();
    person.position.set(matMesh.position.x, 0.2, matMesh.position.z);
    const torso = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.2, 0.18, 0.7, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0x3d5a80 })));
    torso.position.y = 0.4;
    const head = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.18, 5, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0xffd1b3 })));
    head.position.y = 0.9;
    person.add(torso);
    person.add(head);

    const armL = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 4)), trackMat(new THREE.MeshStandardMaterial({ color: 0x3d5a80 })));
    armL.position.set(-0.35, 0.7, 0);
    armL.rotation.z = 0.7;
    person.add(armL);

    const armR = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 4)), trackMat(new THREE.MeshStandardMaterial({ color: 0x3d5a80 })));
    armR.position.set(0.35, 0.7, 0);
    armR.rotation.z = -0.7;
    person.add(armR);

    yogaGroup.add(person);
    yogaPeople.push(person);
  }
  group.add(yogaGroup);

  // SENIORS (Grandpa with cane and Grandma)
  const seniorGroup = new THREE.Group();
  seniorGroup.position.set(-11, 1.5, 13);
  const senior1 = new THREE.Group();
  senior1.add(new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.22, 0.2, 0.9, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0x576574 }))));
  const sHead1 = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.2, 5, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0xffd1b3 })));
  sHead1.position.y = 0.6;
  senior1.add(sHead1);
  const cane = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 4)), matWood);
  cane.position.set(0.35, -0.1, 0.2);
  senior1.add(cane);
  seniorGroup.add(senior1);

  const senior2 = new THREE.Group();
  senior2.position.set(0.7, 0, 0);
  senior2.add(new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.2, 0.2, 0.85, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0xe056fd }))));
  const sHead2 = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.18, 5, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0xffd1b3 })));
  sHead2.position.y = 0.55;
  senior2.add(sHead2);
  seniorGroup.add(senior2);
  group.add(seniorGroup);

  // JOGGER IN BLUE RUNNING GEAR
  const joggerGroup = new THREE.Group();
  joggerGroup.position.set(-8, 1.6, 17);
  const joggerBody = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.22, 0.18, 0.85, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0x2980b9 })));
  joggerBody.position.y = 0.45;
  const joggerHead = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.18, 5, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0xffd1b3 })));
  joggerHead.position.y = 1.0;
  joggerGroup.add(joggerBody);
  joggerGroup.add(joggerHead);
  group.add(joggerGroup);

  // MATEO THE PAINTER & HIS GOLDEN DOG (BARNABY)
  const painterGroup = new THREE.Group();
  painterGroup.position.set(-7.5, 1.6, 19.5);

  const painterBody = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.24, 0.22, 0.8, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0xe67e22 })));
  painterBody.position.set(0, 0.7, 0);
  painterGroup.add(painterBody);

  const painterHead = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.2, 5, 5)), trackMat(new THREE.MeshStandardMaterial({ color: 0xffd1b3 })));
  painterHead.position.set(0, 1.15, 0);
  const strawHat = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.45, 0.45, 0.08, 8)), trackMat(new THREE.MeshStandardMaterial({ color: 0xf1f2f6 })));
  strawHat.position.set(0, 1.3, 0);
  painterGroup.add(painterHead);
  painterGroup.add(strawHat);

  // Easel Tripod
  const easelLegGeo = trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 2.0, 4));
  const leg1 = new THREE.Mesh(easelLegGeo, matWood);
  leg1.position.set(-0.35, 0.9, -1.0);
  leg1.rotation.z = 0.15;
  painterGroup.add(leg1);

  const leg2 = new THREE.Mesh(easelLegGeo, matWood);
  leg2.position.set(0.35, 0.9, -1.0);
  leg2.rotation.z = -0.15;
  painterGroup.add(leg2);

  const leg3 = new THREE.Mesh(easelLegGeo, matWood);
  leg3.position.set(0, 0.9, -1.35);
  leg3.rotation.x = -0.2;
  painterGroup.add(leg3);

  // Painted Canvas on Easel (Miniature Mountain Masterpiece!)
  const canvasGeo = trackGeo(new THREE.BoxGeometry(1.2, 0.9, 0.06));
  const matPaintedCanvas = trackMat(new THREE.MeshStandardMaterial({
    map: painterCanvasTexture,
    roughness: 0.4,
  }));
  const canvasMesh = new THREE.Mesh(canvasGeo, matPaintedCanvas);
  canvasMesh.position.set(0, 1.25, -1.0);
  canvasMesh.rotation.x = -0.15;
  painterGroup.add(canvasMesh);

  // Golden Dog (Barnaby)
  const dogGroup = new THREE.Group();
  dogGroup.position.set(1.4, 0.15, -0.4);
  const dogBody = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.65, 0.38, 1.0)), trackMat(new THREE.MeshStandardMaterial({ color: 0xf39c12, roughness: 0.7 })));
  const dogHead = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.38, 0.38, 0.45)), trackMat(new THREE.MeshStandardMaterial({ color: 0xf39c12, roughness: 0.7 })));
  dogHead.position.set(0, 0.25, -0.5);
  const dogTail = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 4)), trackMat(new THREE.MeshStandardMaterial({ color: 0xf39c12, roughness: 0.7 })));
  dogTail.position.set(0, 0.25, 0.6);
  dogTail.rotation.x = 0.6;
  dogGroup.add(dogBody);
  dogGroup.add(dogHead);
  dogGroup.add(dogTail);
  painterGroup.add(dogGroup);

  group.add(painterGroup);

  // --- COMMERCIAL STREET & VILLAGE (RIGHT WING) ---
  const roadCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(7.0, 1.6, 30),
    new THREE.Vector3(12.0, 1.7, 18),
    new THREE.Vector3(16.0, 1.8, 8),
    new THREE.Vector3(22.0, 2.0, -2),
    new THREE.Vector3(28.0, 2.3, -16),
  ]);
  const roadPts = roadCurve.getPoints(24);
  const roadGeo = trackGeo(new THREE.BufferGeometry());
  const roadVerts: number[] = [];
  const roadIndices: number[] = [];
  const roadW = 5.2;

  for (let i = 0; i < roadPts.length; i++) {
    const pt = roadPts[i];
    const tangent = (i < roadPts.length - 1)
      ? new THREE.Vector3().subVectors(riverPts[i + 1] || pt, pt).normalize()
      : new THREE.Vector3().subVectors(pt, riverPts[i - 1] || pt).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

    roadVerts.push(pt.x - normal.x * (roadW * 0.5), pt.y + 0.05, pt.z - normal.z * (roadW * 0.5));
    roadVerts.push(pt.x + normal.x * (roadW * 0.5), pt.y + 0.05, pt.z + normal.z * (roadW * 0.5));

    if (i < roadPts.length - 1) {
      const idx = i * 2;
      roadIndices.push(idx, idx + 1, idx + 2);
      roadIndices.push(idx + 1, idx + 3, idx + 2);
    }
  }
  roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(roadVerts, 3));
  roadGeo.setIndex(roadIndices);
  roadGeo.computeVertexNormals();

  const roadMesh = new THREE.Mesh(roadGeo, matRoad);
  group.add(roadMesh);

  // Sidewalk for shops
  const sidewalkGeo = trackGeo(new THREE.BoxGeometry(7, 0.4, 28));
  const sidewalkMesh = new THREE.Mesh(sidewalkGeo, matSidewalk);
  sidewalkMesh.position.set(19.5, 1.8, 8);
  sidewalkMesh.rotation.y = -0.45;
  group.add(sidewalkMesh);

  // 1. BAKERY ("BAKERY")
  const bakeryGroup = new THREE.Group();
  bakeryGroup.position.set(13.5, 2.0, 6);
  bakeryGroup.rotation.y = -0.45;

  const bakeryBase = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.8, 4.2, 4.5)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xf5cd79, roughness: 0.6 }))
  );
  bakeryBase.position.y = 2.1;
  bakeryBase.castShadow = true;
  bakeryGroup.add(bakeryBase);

  // Red & White striped awning
  const awningGeo = trackGeo(new THREE.BoxGeometry(4.6, 0.3, 1.8));
  const matAwningRed = trackMat(new THREE.MeshStandardMaterial({ color: 0xd63031, roughness: 0.5 }));
  const awningMesh = new THREE.Mesh(awningGeo, matAwningRed);
  awningMesh.position.set(0, 2.7, 2.6);
  awningMesh.rotation.x = 0.28;
  bakeryGroup.add(awningMesh);

  // High-Resolution "BAKERY" Sign
  const bSignGeo = trackGeo(new THREE.BoxGeometry(3.6, 1.0, 0.15));
  const matBakerySign = trackMat(new THREE.MeshStandardMaterial({ map: bakerySignTexture, roughness: 0.3 }));
  const bSignMesh = new THREE.Mesh(bSignGeo, matBakerySign);
  bSignMesh.position.set(0, 3.5, 2.4);
  bakeryGroup.add(bSignMesh);

  // Glowing Mullioned Window
  const bWin = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.2, 1.8, 0.1)), matWindow);
  bWin.position.set(0, 1.6, 2.3);
  bakeryGroup.add(bWin);

  // Outdoor Cafe Tables & Chairs
  for (let t = 0; t < 2; t++) {
    const table = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.5, 0.5, 0.8, 6)), matWood);
    table.position.set(-1.4 + t * 2.8, 0.4, 3.8);
    bakeryGroup.add(table);
    const chair = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.4, 0.45, 0.4)), matAwningRed);
    chair.position.set(-1.4 + t * 2.8, 0.25, 4.6);
    bakeryGroup.add(chair);
  }
  group.add(bakeryGroup);

  // 2. ESPRESSO CAFE ("ESPRESSO")
  const espressoGroup = new THREE.Group();
  espressoGroup.position.set(18.5, 2.1, 7.5);
  espressoGroup.rotation.y = -0.45;

  const espressoBase = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.6, 4.4, 4.5)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x2c2c54, roughness: 0.55 }))
  );
  espressoBase.position.y = 2.2;
  espressoBase.castShadow = true;
  espressoGroup.add(espressoBase);

  // High-Resolution "ESPRESSO" Sign
  const eSignGeo = trackGeo(new THREE.BoxGeometry(3.4, 0.9, 0.15));
  const matEspressoSign = trackMat(new THREE.MeshStandardMaterial({ map: espressoSignTexture, roughness: 0.3 }));
  const eSignMesh = new THREE.Mesh(eSignGeo, matEspressoSign);
  eSignMesh.position.set(0, 3.6, 2.4);
  espressoGroup.add(eSignMesh);

  const eWin = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.4, 2.0, 0.1)), matWindow);
  eWin.position.set(0, 1.8, 2.3);
  espressoGroup.add(eWin);

  group.add(espressoGroup);

  // 3. LOCAL MARKET ("LOCAL MARKET")
  const marketGroup = new THREE.Group();
  marketGroup.position.set(23.8, 2.2, 9.2);
  marketGroup.rotation.y = -0.45;

  const marketBase = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.8, 4.2, 4.5)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x34495e, roughness: 0.6 }))
  );
  marketBase.position.y = 2.1;
  marketBase.castShadow = true;
  marketGroup.add(marketBase);

  // Green awning
  const matAwningGreen = trackMat(new THREE.MeshStandardMaterial({ color: 0x27ae60, roughness: 0.5 }));
  const mAwning = new THREE.Mesh(awningGeo, matAwningGreen);
  mAwning.position.set(0, 2.7, 2.6);
  mAwning.rotation.x = 0.28;
  marketGroup.add(mAwning);

  // High-Resolution "LOCAL MARKET" Sign
  const mSignGeo = trackGeo(new THREE.BoxGeometry(3.8, 1.0, 0.15));
  const matMarketSign = trackMat(new THREE.MeshStandardMaterial({ map: marketSignTexture, roughness: 0.3 }));
  const mSignMesh = new THREE.Mesh(mSignGeo, matMarketSign);
  mSignMesh.position.set(0, 3.5, 2.4);
  marketGroup.add(mSignMesh);

  // Produce Crates outside market (apples, oranges, greens)
  const crateColors = [0xe74c3c, 0xf39c12, 0x2ecc71];
  for (let c = 0; c < 3; c++) {
    const crate = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.8, 0.5, 0.6)),
      matWood
    );
    crate.position.set(-1.4 + c * 1.4, 0.25, 3.4);
    marketGroup.add(crate);

    const fruit = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.7, 0.2, 0.5)),
      trackMat(new THREE.MeshStandardMaterial({ color: crateColors[c], roughness: 0.5 }))
    );
    fruit.position.set(-1.4 + c * 1.4, 0.5, 3.4);
    marketGroup.add(fruit);
  }

  group.add(marketGroup);

  // UPPER HILLSIDE TOWN VILLAS & HOUSES
  function createVillageHouse(x: number, y: number, z: number, color: number, roofSlate = false, scale = 1.0) {
    const house = new THREE.Group();
    const hBody = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(3.6 * scale, 3.6 * scale, 3.6 * scale)),
      trackMat(new THREE.MeshStandardMaterial({ color, roughness: 0.7 }))
    );
    hBody.position.y = 1.8 * scale;
    hBody.castShadow = true;
    house.add(hBody);

    const hRoof = new THREE.Mesh(
      trackGeo(new THREE.ConeGeometry(2.8 * scale, 1.8 * scale, 4)),
      roofSlate ? matRoofSlate : matRoofOrange
    );
    hRoof.position.y = 4.3 * scale;
    hRoof.rotation.y = Math.PI / 4;
    hRoof.castShadow = true;
    house.add(hRoof);

    // Stone Chimney with smoke
    const chimney = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.4 * scale, 1.2 * scale, 0.4 * scale)),
      matStoneBridge
    );
    chimney.position.set(0.8 * scale, 4.4 * scale, 0.5 * scale);
    house.add(chimney);

    const hWin = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.8 * scale, 0.8 * scale, 0.1)), matWindow);
    hWin.position.set(0, 2.2 * scale, 1.82 * scale);
    house.add(hWin);

    house.position.set(x, y, z);
    group.add(house);
    return house;
  }

  createVillageHouse(17, 2.0, -1, 0xf8a5c2, false, 1.1);
  createVillageHouse(23, 2.5, -4, 0xf7d794, true, 1.2);
  createVillageHouse(29, 3.5, -2, 0x786fa6, false, 1.3);
  createVillageHouse(33, 4.2, -8, 0xf3a683, true, 1.2);
  createVillageHouse(25, 4.0, -12, 0xffcccc, false, 1.1);

  // Town Church / Bell Tower on upper ridge
  const churchGroup = new THREE.Group();
  churchGroup.position.set(32, 4.5, -14);
  const towerBody = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(3.0, 8.5, 3.0)),
    matStoneBridge
  );
  towerBody.position.y = 4.25;
  towerBody.castShadow = true;
  churchGroup.add(towerBody);

  const towerSpire = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(2.4, 4.2, 4)),
    matRoofSlate
  );
  towerSpire.position.y = 10.4;
  towerSpire.rotation.y = Math.PI / 4;
  churchGroup.add(towerSpire);
  group.add(churchGroup);

  // --- VEHICLES: VINTAGE ORANGE CAR & BLUE SUV ---
  interface MovingVehicle {
    mesh: THREE.Group;
    curve: THREE.CatmullRomCurve3;
    progress: number;
    speed: number;
    wheels: THREE.Mesh[];
  }
  const movingVehicles: MovingVehicle[] = [];

  function createCar(color: number, isSUV = false): { car: THREE.Group; wheels: THREE.Mesh[] } {
    const car = new THREE.Group();
    const wheels: THREE.Mesh[] = [];

    const bodyLength = isSUV ? 3.4 : 2.8;
    const bodyHeight = isSUV ? 1.4 : 0.9;
    const bodyGeo = trackGeo(new THREE.BoxGeometry(1.6, bodyHeight, bodyLength));
    const bodyMat = trackMat(new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.3 }));
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.65;
    body.castShadow = true;
    car.add(body);

    // Windshield & Cabin
    const cabinGeo = trackGeo(new THREE.BoxGeometry(1.4, 0.7, 1.6));
    const cabin = new THREE.Mesh(cabinGeo, matWindow);
    cabin.position.set(0, 1.25, -0.2);
    car.add(cabin);

    // Headlights
    const hlGeo = trackGeo(new THREE.BoxGeometry(0.3, 0.2, 0.1));
    const hlMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xfffae6 }));
    const hl1 = new THREE.Mesh(hlGeo, hlMat);
    hl1.position.set(-0.55, 0.6, bodyLength / 2 + 0.02);
    const hl2 = new THREE.Mesh(hlGeo, hlMat);
    hl2.position.set(0.55, 0.6, bodyLength / 2 + 0.02);
    car.add(hl1);
    car.add(hl2);

    // Wheels
    const wheelGeo = trackGeo(new THREE.CylinderGeometry(0.32, 0.32, 0.22, 10));
    wheelGeo.rotateZ(Math.PI / 2);
    const matWheel = trackMat(new THREE.MeshStandardMaterial({ color: 0x222f3e, roughness: 0.8 }));
    const offsets = [
      [-0.85, 0.32, -bodyLength / 3],
      [0.85, 0.32, -bodyLength / 3],
      [-0.85, 0.32, bodyLength / 3],
      [0.85, 0.32, bodyLength / 3],
    ];
    offsets.forEach(pos => {
      const w = new THREE.Mesh(wheelGeo, matWheel);
      w.position.set(pos[0], pos[1], pos[2]);
      car.add(w);
      wheels.push(w);
    });

    return { car, wheels };
  }

  // 1. Moving Vintage Orange Car
  const orangeCar = createCar(0xe67e22, false);
  group.add(orangeCar.car);
  movingVehicles.push({
    mesh: orangeCar.car,
    curve: roadCurve,
    progress: 0.3,
    speed: 0.08,
    wheels: orangeCar.wheels,
  });

  // 2. Parked Blue SUV near Local Market
  const blueSUV = createCar(0x2980b9, true);
  blueSUV.car.position.set(22.0, 1.8, 14.5);
  blueSUV.car.rotation.y = -0.45;
  group.add(blueSUV.car);

  // 3. Vintage Red Scooter parked near Bakery
  const scooter = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.4, 0.8, 1.2)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.4 }))
  );
  scooter.position.set(16.5, 2.0, 9.5);
  scooter.rotation.y = -0.45;
  group.add(scooter);

  // --- TREES & FOLIAGE ---
  function createPineTree(x: number, y: number, z: number, scale = 1.0) {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.2 * scale, 0.3 * scale, 1.6 * scale, 5)),
      matWood
    );
    trunk.position.y = 0.8 * scale;
    trunk.castShadow = true;
    tree.add(trunk);

    const levels = 3;
    for (let l = 0; l < levels; l++) {
      const cone = new THREE.Mesh(
        trackGeo(new THREE.ConeGeometry((1.8 - l * 0.4) * scale, 1.8 * scale, 6)),
        matPineGreen
      );
      cone.position.y = (1.8 + l * 1.2) * scale;
      cone.castShadow = true;
      tree.add(cone);
    }
    tree.position.set(x, y, z);
    group.add(tree);
  }

  function createLeafyTree(x: number, y: number, z: number, scale = 1.0) {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.25 * scale, 0.35 * scale, 2.0 * scale, 6)),
      matWood
    );
    trunk.position.y = 1.0 * scale;
    trunk.castShadow = true;
    tree.add(trunk);

    const crown = new THREE.Mesh(
      trackGeo(new THREE.DodecahedronGeometry(1.8 * scale, 1)),
      matParkGrass
    );
    crown.position.y = 2.8 * scale;
    crown.castShadow = true;
    tree.add(crown);

    tree.position.set(x, y, z);
    group.add(tree);
  }

  // Pine forests along slopes
  createPineTree(-28, 1.5, 0, 1.3);
  createPineTree(-25, 1.5, -6, 1.5);
  createPineTree(-20, 1.5, -12, 1.6);
  createPineTree(-14, 2.0, -18, 1.4);
  createPineTree(12, 2.5, -16, 1.4);
  createPineTree(18, 3.0, -18, 1.5);
  createPineTree(24, 3.5, -20, 1.3);

  // Deciduous park trees
  createLeafyTree(-16, 1.5, 16, 1.1);
  createLeafyTree(-6, 1.5, 8, 1.2);
  createLeafyTree(-12, 1.5, 2, 1.3);
  createLeafyTree(10, 1.6, 22, 1.0);

  // --- FLOWERBEDS ALONG PATHWAYS ---
  const flowerColors = [0xe74c3c, 0xf39c12, 0x9b59b6, 0x3498db, 0xffffff];
  const flowerGeo = trackGeo(new THREE.DodecahedronGeometry(0.18, 0));
  for (let f = 0; f < 36; f++) {
    const fMat = trackMat(new THREE.MeshStandardMaterial({
      color: flowerColors[f % flowerColors.length],
      roughness: 0.6,
      flatShading: true,
    }));
    const fl = new THREE.Mesh(flowerGeo, fMat);
    if (f < 18) {
      fl.position.set(-6 + (Math.random() - 0.5) * 4, 1.65, 20 + (Math.random() - 0.5) * 4);
    } else {
      fl.position.set(8 + (Math.random() - 0.5) * 4, 1.6, 22 + (Math.random() - 0.5) * 4);
    }
    group.add(fl);
  }

  // --- INTERACTIVE HOTSPOT TARGETS ---
  const hotspotObjects: THREE.Object3D[] = [];
  const hotspotBeacons: { mesh: THREE.Mesh }[] = [];

  HOTSPOTS.forEach((hp) => {
    const beaconGroup = new THREE.Group();
    beaconGroup.position.set(hp.position[0], hp.position[1], hp.position[2]);
    beaconGroup.userData = { hotspot: hp };

    // Invisible hit sphere for raycasting
    const hitSphere = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(2.5, 8, 8)),
      trackMat(new THREE.MeshBasicMaterial({ visible: false }))
    );
    hitSphere.userData = { hotspot: hp };
    beaconGroup.add(hitSphere);

    // Glowing Diamond Marker
    const markerGeo = trackGeo(new THREE.OctahedronGeometry(0.35, 0));
    const markerMat = trackMat(new THREE.MeshStandardMaterial({
      color: 0xffd166,
      emissive: 0xff9f1c,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    }));
    const markerMesh = new THREE.Mesh(markerGeo, markerMat);
    beaconGroup.add(markerMesh);
    hotspotBeacons.push({ mesh: markerMesh });

    group.add(beaconGroup);
    hotspotObjects.push(beaconGroup);
  });

  // --- ANIMATION UPDATE LOOP ---
  function update(delta: number, elapsed: number, timeOfDay: string) {
    // 1. Clouds drifting
    clouds.forEach(c => {
      c.mesh.position.x += delta * c.speed;
      if (c.mesh.position.x > 60) c.mesh.position.x = -60;
    });

    // 2. Circling birds
    birds.forEach(b => {
      const angle = b.baseAngle + elapsed * b.speed;
      b.mesh.position.x = Math.cos(angle) * b.radius;
      b.mesh.position.z = Math.sin(angle) * (b.radius * 0.6);
      b.mesh.position.y = Math.sin(elapsed * 2.0 + b.phase) * 1.5;
      b.mesh.rotation.y = -angle + Math.PI / 2;
      b.mesh.scale.x = 1.3 + Math.sin(elapsed * 8 + b.phase) * 0.4;
    });

    // 3. Swings swaying
    swingSeats.forEach((sw, i) => {
      sw.rotation.x = Math.sin(elapsed * 2.5 + i * 1.2) * 0.45;
    });

    // 4. Moving traffic
    movingVehicles.forEach(v => {
      v.progress = (v.progress + delta * v.speed) % 1.0;
      const pt = v.curve.getPointAt(v.progress);
      v.mesh.position.copy(pt);
      const tangent = v.curve.getTangentAt(v.progress);
      v.mesh.lookAt(pt.clone().add(tangent));
      v.wheels.forEach(w => {
        w.rotation.x += delta * 12;
      });
    });

    // 5. Jogger along path
    const jogAngle = elapsed * 0.4;
    joggerGroup.position.x = -12 + Math.cos(jogAngle) * 5.0;
    joggerGroup.position.z = 10 + Math.sin(jogAngle) * 5.0;
    joggerGroup.rotation.y = -jogAngle + Math.PI;
    joggerBody.position.y = 0.45 + Math.abs(Math.sin(elapsed * 6)) * 0.12;

    // 6. Yoga gentle arm sway
    yogaPeople.forEach((p, idx) => {
      p.rotation.y = Math.sin(elapsed * 1.2 + idx) * 0.15;
    });

    // 7. Golden dog tail wagging
    dogTail.rotation.y = Math.sin(elapsed * 5) * 0.4;

    // 8. Boat gently bobbing on the river
    boatGroup.position.y = 1.25 + Math.sin(elapsed * 2.0) * 0.08;
    boatGroup.rotation.z = Math.sin(elapsed * 1.5) * 0.06;

    // 9. Pulsating Hotspot Beacons
    hotspotBeacons.forEach((b, i) => {
      const scale = 1.0 + Math.sin(elapsed * 3.0 + i) * 0.2;
      b.mesh.scale.set(scale, scale, scale);
    });

    // 10. Stars for night
    const isNight = timeOfDay === 'night';
    const targetStarOp = isNight ? 0.85 : (timeOfDay === 'golden_hour' ? 0.2 : 0.0);
    starMat.opacity = THREE.MathUtils.lerp(starMat.opacity, targetStarOp, 0.05);
  }

  // --- LIGHTING UPDATE ---
  function updateLighting(scheme: {
    skyTop: number;
    skyBottom: number;
    fogColor: number;
    sunColor: number;
    sunIntensity: number;
    sunPosition: [number, number, number];
    ambientColor: number;
    ambientIntensity: number;
    hemisphereSky: number;
    hemisphereGround: number;
    streetLightIntensity: number;
    windowGlowIntensity: number;
  }) {
    skyMat.uniforms.topColor.value.setHex(scheme.skyTop);
    skyMat.uniforms.bottomColor.value.setHex(scheme.skyBottom);

    streetLights.forEach(sl => {
      sl.intensity = scheme.streetLightIntensity;
    });

    matWindow.emissiveIntensity = scheme.windowGlowIntensity;

    sunMesh.position.set(scheme.sunPosition[0], scheme.sunPosition[1], -75);
    sunGlowMesh.position.set(scheme.sunPosition[0], scheme.sunPosition[1], -76);
  }

  return {
    group,
    update,
    updateLighting,
    hotspotObjects,
    materialsToDispose,
    geometriesToDispose,
  };
}
