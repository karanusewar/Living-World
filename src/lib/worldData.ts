import { Chapter, Hotspot, LightingScheme, TimeOfDay } from '../types/world';

export const CHAPTERS: Chapter[] = [
  {
    id: 'sunrise',
    number: 1,
    label: 'SUNRISE',
    title: 'A DAY IN OUR WORLD',
    quote: 'Every street has a story. Every life is connected.',
    description: 'As golden light spills past the jagged peaks, our miniature valley awakens to a gentle morning breeze.',
    targetProgress: 0.0,
    timeOfDay: 'sunrise',
    camera: {
      position: [0, 18, 48],
      target: [0, 4, -4],
      fov: 46
    }
  },
  {
    id: 'community',
    number: 2,
    label: 'COMMUNITY',
    title: 'THE MORNING RHYTHMS',
    quote: 'A neighborhood is woven together by the little moments we share.',
    description: 'In the green park, neighbors stretch in morning yoga, elders greet one another on winding paths, and children laugh on the swings.',
    targetProgress: 0.33,
    timeOfDay: 'community',
    camera: {
      position: [-16, 11, 22],
      target: [-14, 2, 4],
      fov: 44
    }
  },
  {
    id: 'nature',
    number: 3,
    label: 'NATURE',
    title: 'RIVER & WATERFALL',
    quote: 'Pure mountain waters carry life through the heart of the village.',
    description: 'Originating high in the alpine snowfields, the glacial stream rushes through the canyon and passes beneath the historic arched bridge.',
    targetProgress: 0.66,
    timeOfDay: 'nature',
    camera: {
      position: [0, 10, 18],
      target: [0, 2, -10],
      fov: 45
    }
  },
  {
    id: 'golden_hour',
    number: 4,
    label: 'GOLDEN HOUR',
    title: 'CREATIVITY & COMMERCE',
    quote: 'Every person adds something warm and irreplaceable to the tapestry.',
    description: 'The aroma of fresh baguettes drifts from the bakery. On the corner, an artist dabs vibrant oils onto canvas beside a quiet golden dog.',
    targetProgress: 1.0,
    timeOfDay: 'golden_hour',
    camera: {
      position: [18, 9, 21],
      target: [13, 2, 3],
      fov: 44
    }
  }
];

export const HOTSPOTS: Hotspot[] = [
  {
    id: 'playground',
    name: 'Sunny Meadow Playground',
    category: 'community',
    position: [-22, 2.5, 9],
    cameraTarget: [-22, 2, 9],
    cameraOffset: [-18, 7, 20],
    tag: 'Park & Recreation',
    shortDescription: 'Swings, slides, and joyful laughter under the morning sun.',
    story: 'Built by the town guild three decades ago, the playground remains the heart of childhood memories. On bright mornings, parents gather with thermal mugs as young adventurers race to conquer the red spiral slide.',
    details: {
      timeActive: 'Active from 7:00 AM - Dusk',
      atmosphere: 'Cheerful, playful, energized',
      people: 'Children, parents, weekend families'
    }
  },
  {
    id: 'yoga_lawn',
    name: 'Zenith Community Lawn',
    category: 'community',
    position: [-13, 1.8, 8],
    cameraTarget: [-13, 1.2, 8],
    cameraOffset: [-10, 5, 17],
    tag: 'Wellness & Mindfulness',
    shortDescription: 'Morning breathing, yoga salutations, and seniors sharing stories.',
    story: 'Every sunrise, master instructor Elena leads a free outdoor stretch class. Beside the lawn, retired schoolteacher Arthur and his companions take their daily morning stroll, greeting every passerby with a warm tip of the hat.',
    details: {
      timeActive: 'Daily session at 6:45 AM',
      atmosphere: 'Serene, rhythmic, rejuvenating',
      people: 'Elena, Arthur, local residents'
    }
  },
  {
    id: 'artist_easel',
    name: "Mateo's Open-Air Easel",
    category: 'life',
    position: [-8, 2.1, 19],
    cameraTarget: [-8, 1.8, 19],
    cameraOffset: [-6, 4.5, 26],
    tag: 'Art & Heritage',
    shortDescription: 'An outdoor landscape painter capturing the snowcapped peaks.',
    story: 'Mateo has painted the same mountain range for twenty seasons, yet claims no two mornings share the exact same violet haze. His faithful golden companion, Barnaby, rests patiently by his leather tackle box, soaking in the gentle breeze.',
    details: {
      timeActive: 'Capturing morning & golden hour light',
      atmosphere: 'Contemplative, artistic, quiet',
      people: 'Mateo and Barnaby the golden dog'
    }
  },
  {
    id: 'stone_bridge',
    name: 'Old Mill Stone Arch Bridge',
    category: 'landmark',
    position: [0.5, 2.2, 3],
    cameraTarget: [0.5, 2, 3],
    cameraOffset: [4, 7, 13],
    tag: 'Historic Landmark',
    shortDescription: 'Weathered cobblestone arches spanning the crystalline river.',
    story: 'Handcrafted from granite quarried in the upper peaks, this two-hundred-year-old bridge binds the quiet western parklands to the bustling eastern market street. Children often lean over the stone parapet to race wooden boats downstream.',
    details: {
      timeActive: 'Continuous foot and bicycle path',
      atmosphere: 'Historic, breezy, scenic',
      people: 'Joggers, couples, river watchers'
    }
  },
  {
    id: 'waterfall',
    name: 'Alpine Cascade & Gorge',
    category: 'nature',
    position: [-1, 10, -20],
    cameraTarget: [-1, 7, -20],
    cameraOffset: [3, 14, -6],
    tag: 'Natural Wonder',
    shortDescription: 'Crisp glacial meltwater plunging through tiered pine terraces.',
    story: 'Feeding the lifeblood of the entire valley, the Alpine Cascade falls seventy meters through sculpted granite steps before slowing into the clear turquoise river that flows past the village center.',
    details: {
      timeActive: 'Roaring year-round',
      atmosphere: 'Crisp, invigorating, mist-laden',
      people: 'Distant hikers and alpine eagles'
    }
  },
  {
    id: 'bakery',
    name: 'The Golden Crust Boulangerie',
    category: 'commerce',
    position: [13, 2.5, 6],
    cameraTarget: [13, 2.2, 6],
    cameraOffset: [16, 5.5, 14],
    tag: 'Artisanal Bakery',
    shortDescription: 'Fresh sourdough, butter croissants, and red-and-white cafe awnings.',
    story: 'Pierre stokes the wood-fired ovens at 4:00 AM. By the time the sun peaks over Mount Solitude, the golden scent of caramelized crusts draws residents down the cobblestone sidewalk for their morning café au lait.',
    details: {
      timeActive: 'Open 6:30 AM - 4:00 PM',
      atmosphere: 'Warm, buttery, bustling',
      people: 'Chef Pierre, neighborhood early risers'
    }
  },
  {
    id: 'coffee',
    name: 'Velvet Roast Espresso House',
    category: 'commerce',
    position: [18.5, 2.6, 7],
    cameraTarget: [18.5, 2.3, 7],
    cameraOffset: [21, 6, 16],
    tag: 'Specialty Coffee',
    shortDescription: 'Single-origin beans, cozy wooden counter, and sunlit patio seating.',
    story: 'With its matte charcoal facade and glowing warm interior, Velvet Roast is the town center for morning catchups and creative laptops. The outdoor bistro tables offer a panoramic view of the mountain waterfall across the valley.',
    details: {
      timeActive: 'Open 7:00 AM - 7:00 PM',
      atmosphere: 'Roasted hazelnut aroma, upbeat jazz',
      people: 'Baristas Maya & Leo, morning patrons'
    }
  },
  {
    id: 'market',
    name: 'Valley Green Grocer & Market',
    category: 'commerce',
    position: [24, 2.7, 9],
    cameraTarget: [24, 2.4, 9],
    cameraOffset: [26, 6.5, 18],
    tag: 'Local Produce',
    shortDescription: 'Crates of crisp orchard apples, fresh herbs, and coastal citrus.',
    story: 'Family-operated for three generations, this colorful corner store receives fresh produce daily from nearby foothill farms. Woven baskets of berries and bundles of wildflowers brighten the sidewalk under blue striped awnings.',
    details: {
      timeActive: 'Open 8:00 AM - 6:30 PM',
      atmosphere: 'Vibrant, earthy, fragrant',
      people: 'The Rossi family, neighborhood cooks'
    }
  },
  {
    id: 'village_street',
    name: 'Meadowbrook Avenue & Traffic',
    category: 'landmark',
    position: [16, 1.8, 17],
    cameraTarget: [16, 1.5, 17],
    cameraOffset: [17, 5.5, 26],
    tag: 'Town Life',
    shortDescription: 'Vintage mopeds, compact family cars, and a playful sidewalk pup.',
    story: 'The avenue connects the lower valley to the hillside villas. Cheerful compact cars hum smoothly down the street while brightly painted mopeds rest outside the cafe. A playful puppy watches eagerly from the curb.',
    details: {
      timeActive: 'Continuous lively neighborhood transit',
      atmosphere: 'Friendly, rhythmic, scenic',
      people: 'Commuters, delivery riders, strolling dogs'
    }
  }
];

export const LIGHTING_PRESETS: Record<TimeOfDay, LightingScheme> = {
  sunrise: {
    skyTop: 0xffa478,
    skyBottom: 0x98b8ec,
    fogColor: 0xdeb8a2,
    fogDensity: 0.007,
    sunColor: 0xffd39b,
    sunIntensity: 2.2,
    sunPosition: [12, 16, -35],
    ambientColor: 0x7c8ba8,
    ambientIntensity: 0.9,
    hemisphereSky: 0xffe2cb,
    hemisphereGround: 0x6e809e,
    streetLightIntensity: 0.4,
    windowGlowIntensity: 0.3
  },
  morning: {
    skyTop: 0x75b7ff,
    skyBottom: 0xd6e8ff,
    fogColor: 0xc8ddf8,
    fogDensity: 0.006,
    sunColor: 0xfffaed,
    sunIntensity: 2.8,
    sunPosition: [25, 38, -15],
    ambientColor: 0x9cb8db,
    ambientIntensity: 1.1,
    hemisphereSky: 0xc2e2ff,
    hemisphereGround: 0x739775,
    streetLightIntensity: 0.0,
    windowGlowIntensity: 0.0
  },
  community: {
    skyTop: 0x64aaff,
    skyBottom: 0xd8edff,
    fogColor: 0xcde0f5,
    fogDensity: 0.006,
    sunColor: 0xfff4dc,
    sunIntensity: 2.6,
    sunPosition: [18, 32, -22],
    ambientColor: 0x9dbadc,
    ambientIntensity: 1.0,
    hemisphereSky: 0xbde0ff,
    hemisphereGround: 0x6e9075,
    streetLightIntensity: 0.0,
    windowGlowIntensity: 0.0
  },
  nature: {
    skyTop: 0x5da0f5,
    skyBottom: 0xcfe6fc,
    fogColor: 0xc0d8f0,
    fogDensity: 0.0065,
    sunColor: 0xffeed0,
    sunIntensity: 2.5,
    sunPosition: [8, 28, -28],
    ambientColor: 0x93b4d8,
    ambientIntensity: 1.0,
    hemisphereSky: 0xb4daff,
    hemisphereGround: 0x658970,
    streetLightIntensity: 0.1,
    windowGlowIntensity: 0.1
  },
  afternoon: {
    skyTop: 0x4896f5,
    skyBottom: 0xc8e2fc,
    fogColor: 0xb5d4f0,
    fogDensity: 0.0055,
    sunColor: 0xffffff,
    sunIntensity: 3.0,
    sunPosition: [10, 45, -10],
    ambientColor: 0xa5c4e8,
    ambientIntensity: 1.15,
    hemisphereSky: 0xbfe2ff,
    hemisphereGround: 0x6e9575,
    streetLightIntensity: 0.0,
    windowGlowIntensity: 0.0
  },
  evening: {
    skyTop: 0xf58b57,
    skyBottom: 0xffcf99,
    fogColor: 0xf3ba8e,
    fogDensity: 0.007,
    sunColor: 0xff9944,
    sunIntensity: 2.7,
    sunPosition: [22, 14, -30],
    ambientColor: 0x8b6d85,
    ambientIntensity: 0.9,
    hemisphereSky: 0xffb582,
    hemisphereGround: 0x5a5568,
    streetLightIntensity: 1.2,
    windowGlowIntensity: 1.0
  },
  golden_hour: {
    skyTop: 0xf58b57,
    skyBottom: 0xffcf99,
    fogColor: 0xf3ba8e,
    fogDensity: 0.007,
    sunColor: 0xff9944,
    sunIntensity: 2.7,
    sunPosition: [22, 14, -30],
    ambientColor: 0x8b6d85,
    ambientIntensity: 0.9,
    hemisphereSky: 0xffb582,
    hemisphereGround: 0x5a5568,
    streetLightIntensity: 1.2,
    windowGlowIntensity: 1.0
  },
  night: {
    skyTop: 0x080f22,
    skyBottom: 0x182444,
    fogColor: 0x0f1830,
    fogDensity: 0.010,
    sunColor: 0x7892c8,
    sunIntensity: 0.6,
    sunPosition: [-15, 25, -25],
    ambientColor: 0x223055,
    ambientIntensity: 0.6,
    hemisphereSky: 0x24335c,
    hemisphereGround: 0x11192b,
    streetLightIntensity: 2.6,
    windowGlowIntensity: 2.8
  }
};
