# Living World

> An interactive, exploratory 3D diorama celebrating village life, natural landscapes, and community rhythms from sunrise to dusk. Handcrafted with Three.js, React 19, TypeScript, and Tailwind CSS.

🌐 **Live Demo:** [https://a-living-world.vercel.app/](https://a-living-world.vercel.app/)

---

## Overview

**Living World** is a creative web-based 3D digital diorama designed to evoke the tactile charm of handcrafted miniature models. The application pairs real-time WebGL rendering with modern front-end architectural practices, providing an ambient storytelling journey accompanied by responsive controls and an interactive procedural environment.

---

## Features

### 1. 3D Miniature Diorama (WebGL & Three.js)
- **Scenic Landscape**: Snow-capped mountain passes, cascading alpine waterfalls, and dynamic terrain with river surface refractions.
- **Village Architecture**: Detailed facades including artisan bakeries, espresso bars, local markets, and hillside cottages.
- **Dynamic Atmosphere**: Five distinct lighting profiles spanning *Sunrise*, *Morning*, *Afternoon*, *Golden Hour*, and *Night*, with lantern glow and night skylines.
- **Procedural Motion**: Drifting low-poly cloud formations, animated river currents, and ambient wildlife patterns.

### 2. Guided Camera & Story Navigation
- Smooth spline-based camera interpolation driving chapter transitions.
- Interactive points of interest with raycast detection and informational cards detailing neighborhood narratives.
- Free exploration mode with full orbit controls, tilt, and pan capability.

### 3. User Authentication
- Powered by Firebase Authentication with Google Sign-In.
- Seamless account management, profile presence, and session state persistence.

### 4. Responsive Engineering
- Tailored for high-refresh desktop monitors, tablets, and handheld devices.
- Orientation-aware mobile adaptation ensuring typography and diorama viewports remain balanced across landscape and portrait angles.

---

## Tech Stack

### Core Framework & Language
- **React 19 (`react`, `react-dom`)**: Modern React with concurrent rendering, custom hooks (`useState`, `useEffect`, `useRef`, `useContext`), and modular component architecture.
- **TypeScript 7.0**: Strict static typing across all 3D scene data, audio models, user contexts, and component interfaces.
- **Vite 8.3**: Next-generation development tooling providing fast Hot Module Replacement (HMR) and optimized Rollup production builds.

### 3D Graphics & Canvas Layer
- **Three.js (`three`, `@types/three`)**: WebGL library powering the 3D scene canvas, camera trajectories, lighting calculations, materials, and procedural dioramas.
- **@react-three/fiber (`R3F`) & @react-three/drei**: Declarative Three.js component layer for React with helpers like `OrbitControls`.

### Styling & Design System
- **Tailwind CSS v4 (`@tailwindcss/vite`)**: Utility-first CSS engine with glassmorphism (`backdrop-blur`), dynamic color layers, mobile safe-area insets (`env(safe-area-inset-*)`), and responsive layout breakpoints.
- **Typography**:
  - *Cormorant Garamond*: High-contrast editorial display serif used for headings, chapter titles, and branding.
  - *Plus Jakarta Sans*: Clean geometric sans-serif for UI badges, navigational labels, and reading copy.
- **Lucide React**: Clean SVG vector iconography for UI toggles, sound controls, compass navigation, and modals.

### Animation & Interactive Motion
- **GSAP (`gsap`, `@gsap/react`)**: High-performance timeline animation engine for camera path interpolations and chapter transitions.
- **Motion (`motion`)**: Spring physics, interactive gesture handling, modal transitions, and UI overlays.

### Backend & Authentication
- **Firebase v13 (`firebase/app`, `firebase/auth`)**:
  - **Firebase Authentication**: Google OAuth 2.0 popup flows, secure tokens, user profiles, and session persistence.
  - React Context (`AuthProvider`) for seamless authentication state management across the app.

### Procedural Audio Engineering
- **Web Audio API**: Native browser-synthesized ambient soundscapes (gentle wind, running alpine river, morning birds) generated in real-time with zero external audio assets.

### Deployment & Infrastructure
- **Vercel**: Edge network hosting with automated continuous deployment (CI/CD) on Git push.
- **Git & GitHub**: Version control and code repository hosting.

---

## Project Structure

```plaintext
Living-World/
├── public/              # Static assets, textures, and models
│   ├── images/          # Environment maps and diorama textures
│   └── user.png         # Default user avatar
├── src/
│   ├── components/
│   │   ├── 3d/          # Scene canvas, environment builders, and 3D objects
│   │   ├── auth/        # Authentication modal and user profile menu
│   │   └── ui/          # Navigation, chapter bars, modals, and prompts
│   ├── context/         # AuthContext and state providers
│   ├── lib/             # Firebase setup and sound utilities
│   ├── types/           # TypeScript definitions and data interfaces
│   ├── App.tsx          # Main application layout
│   └── main.tsx         # React root entry point
├── package.json         # Project metadata and dependencies
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite bundler configuration
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/karanusewar/Living-World.git
   cd Living-World
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and provide your Firebase credentials:
   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## Deployment

The application is optimized for deployment on Vercel:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Live URL**: [https://a-living-world.vercel.app/](https://a-living-world.vercel.app/)

---

## License

This project is licensed under the [MIT License](LICENSE).
