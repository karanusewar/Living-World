export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night' | 'sunrise' | 'golden_hour' | 'community' | 'nature';

export interface Chapter {
  id: string;
  number: number;
  label: string;
  title: string;
  quote: string;
  description: string;
  targetProgress: number;
  timeOfDay: TimeOfDay;
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    fov?: number;
  };
}

export interface Hotspot {
  id: string;
  name: string;
  category: 'landmark' | 'community' | 'nature' | 'commerce' | 'life';
  position: [number, number, number];
  cameraTarget: [number, number, number];
  cameraOffset: [number, number, number];
  tag: string;
  shortDescription: string;
  story: string;
  details: {
    timeActive: string;
    atmosphere: string;
    people: string;
  };
}

export interface LightingScheme {
  skyTop: number;
  skyBottom: number;
  fogColor: number;
  fogDensity: number;
  sunColor: number;
  sunIntensity: number;
  sunPosition: [number, number, number];
  ambientColor: number;
  ambientIntensity: number;
  hemisphereSky: number;
  hemisphereGround: number;
  streetLightIntensity: number;
  windowGlowIntensity: number;
}
