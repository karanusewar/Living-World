# A Day in Our Living World

An interactive 3D miniature storytelling world built with Three.js, React 19, TypeScript, and Tailwind CSS. The experience brings the stylized miniature town aesthetic to life with a scroll-driven camera journey, animated characters and vehicles, dynamic day-to-night lighting, interactive points of interest, and an optional procedural nature soundscape.

---

## Key Features

1. **Procedural 3D Miniature Diorama (Three.js WebGL)**
   - **Mountain Range & Sunrise**: Snow-capped peaks, glowing sunburst corona behind the mountain pass, drifting low-poly clouds, and circling flock of birds.
   - **Alpine Waterfall & River**: Multi-tier cascading waterfall with mist particles, crystal-blue flowing river with surface reflections, riverbank rocks, and a bobbing wooden sailboat.
   - **Historic Stone Arch Bridge**: Handcrafted stone masonry bridge spanning the river with an animated walking pedestrian.
   - **Community Park**:
     - Full playground with climbing tower, red slide, swaying swings, and playing children.
     - Morning yoga lawn with four residents practicing mindful poses.
     - Senior walkers with walking canes on winding paved paths.
     - Energetic jogger in blue athletic wear pacing the park loop.
     - Plein-air landscape painter (*Mateo*) with straw hat, easel, miniature canvas, and faithful golden retriever (*Barnaby*).
   - **Village Street & Commerce**:
     - *The Golden Crust Bakery*: Red-and-white striped awning, outdoor dining tables, and bread display.
     - *Velvet Roast Espresso*: Modern charcoal facade with warm glowing windows and cafe patio.
     - *Valley Green Grocer*: Produce crates with apples, oranges, greens, and parking sign.
     - Staggered pastel hillside villas with smoking chimneys and glowing evening windows.
     - Moving traffic with rotating wheels (compact orange car, classic blue SUV) smoothly traversing the avenue.
     - Parked vintage scooters (red Vespa, blue moped) and a playful sidewalk puppy.
   - **Foreground**: Faceted crystal-like amethyst/slate rocks, blooming wildflowers, and glowing street lanterns.

2. **Cinematic Storytelling & Scroll-Driven Camera**
   - 4 guided story chapters:
     - **01 · Sunrise** (A Day in Our World)
     - **02 · Community** (The Morning Rhythms & Park)
     - **03 · Nature** (River, Waterfall & Bridge)
     - **04 · Golden Hour** (Creativity & Commerce)
   - Smooth spline camera interpolation responding to wheel scrolling, touch vertical swipes, and timeline clicks.

3. **Free Exploration Mode**
   - Click "Explore" in the top bar or menu to unhook the camera from the narrative track.
   - Uses OrbitControls for unrestricted rotation, panning, and zoom around the 3D town.
   - Prominent "Return to Story" control seamlessly brings you back to the guided journey.

4. **Interactive Hotspots & Story Panels**
   - 9 interactive 3D hotspots across the valley.
   - Raycasting detection on hover and click.
   - Polished narrative modal cards detailing the atmosphere, daily rhythms, and characters of each location.

5. **Dynamic Day-to-Night Lighting Engine**
   - Supports 5 distinct atmospheric lighting states: *Sunrise*, *Morning*, *Nature/Afternoon*, *Golden Hour*, and *Night*.
   - Night mode turns on warm glowing street lanterns, illuminates shop windows, and displays a sparkling starry sky.
   - Quick circular toggle button at bottom right (sun/moon) and granular lighting selector in the menu.

6. **Procedural Web Audio Soundscape**
   - Standalone browser-synthesized audio: rushing river water, morning bird chirps, gentle wind, and nighttime crickets.
   - Musical chime feedback on hotspot selection.
   - Zero external audio files required — immune to 404 network errors or browser blocking.

7. **Fully Responsive Design**
   - Desktop: full-viewport immersive diorama.
   - Mobile & Tablet: touch swipe gestures, portrait FOV compensation, responsive typography, and touch-optimized controls.

---

## Technology Stack

- **Framework**: React 19 + TypeScript (Vite)
- **3D Graphics**: Three.js WebGL with custom procedural geometries, shaders, and OrbitControls
- **Styling**: Tailwind CSS v4 + Google Fonts (*Cormorant Garamond* & *Plus Jakarta Sans*)
- **Icons**: Lucide React
- **Audio**: Web Audio API Procedural Synthesizer

---

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
The application will be running at `http://localhost:3000`.

### Production Build
```bash
npm run build
```
Verify build output with:
```bash
npm run lint
```
