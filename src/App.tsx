/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { UserProfileMenu } from './components/auth/AuthModal';
import { MyWorldScene } from './components/3d/MyWorldScene';
import { RotatePrompt } from './components/ui/RotatePrompt';

export default function App() {
  return (
    <AuthProvider>
      <main className="relative w-screen h-[100dvh] min-h-[100dvh] overflow-hidden bg-[#070b14] select-none">
        {/* Pristine Single View Diorama */}
        <MyWorldScene />

        {/* Top-Left: Brand Name (A LIVING WORLD) with Mobile Safe Areas */}
        <header
          className="fixed top-0 left-0 z-30 pointer-events-none select-none transition-all duration-300"
          style={{
            paddingTop: 'max(env(safe-area-inset-top, 0px) + 1.25rem, 1.25rem)',
            paddingLeft: 'max(env(safe-area-inset-left, 0px) + 1.25rem, 1.25rem)',
          }}
        >
          <div className="flex flex-col items-start leading-[1.12]">
            <span className="text-[11px] sm:text-xs md:text-sm tracking-[0.22em] font-bold text-slate-900 uppercase font-sans drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]">
              A LIVING
            </span>
            <span className="text-[11px] sm:text-xs md:text-sm tracking-[0.22em] font-bold text-slate-900 uppercase font-sans drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]">
              WORLD
            </span>
          </div>
        </header>

        {/* Top-Right: User Profile / Sign-In */}
        <div
          className="fixed top-0 right-0 z-30 transition-all duration-300"
          style={{
            paddingTop: 'max(env(safe-area-inset-top, 0px) + 1.25rem, 1.25rem)',
            paddingRight: 'max(env(safe-area-inset-right, 0px) + 1.25rem, 1.25rem)',
          }}
        >
          <UserProfileMenu />
        </div>

        {/* Bottom-Left: Title and Slogan (A DAY IN OUR WORLD) with Mobile Safe Areas */}
        <footer
          className="fixed bottom-0 left-0 z-30 pointer-events-none select-none transition-all duration-300 max-w-[92vw] sm:max-w-xl md:max-w-2xl"
          style={{
            paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 1.5rem, 1.5rem)',
            paddingLeft: 'max(env(safe-area-inset-left, 0px) + 1.25rem, 1.25rem)',
            paddingRight: 'max(env(safe-area-inset-right, 0px) + 1.25rem, 1.25rem)',
          }}
        >
          <div className="flex flex-col items-start">
            <h1 className="font-serif-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-bold tracking-tight text-white leading-[0.98] drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">
              A DAY IN<br />
              OUR WORLD
            </h1>
            <p className="text-white/95 text-xs sm:text-sm md:text-[15px] font-normal tracking-wide mt-2 sm:mt-3 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)] leading-relaxed">
              Every street has a story. Every life is connected.
            </p>
          </div>
        </footer>

        {/* Rotate Phone Animation UI for mobile/tablet portrait devices */}
        <RotatePrompt />
      </main>
    </AuthProvider>
  );
}
