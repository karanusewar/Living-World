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

| Domain | Technology |
|---|---|
| **Core** | React 19, TypeScript |
| **Bundler & Tooling** | Vite |
| **3D Rendering** | Three.js, @react-three/fiber, @react-three/drei |
| **Styling** | Tailwind CSS v4 |
| **Animation & Curves** | GSAP, Motion |
| **Authentication** | Firebase Auth (Google OAuth) |
| **Icons** | Lucide React |

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
