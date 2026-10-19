import React, { useState, useEffect } from 'react';

export const RotatePrompt: React.FC = () => {
  const [isPortraitMobile, setIsPortraitMobile] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if device is in portrait mode on mobile/tablet screens
      const isPortrait = window.innerHeight > window.innerWidth;
      const isMobileOrTablet = window.innerWidth <= 1024;
      setIsPortraitMobile(isPortrait && isMobileOrTablet);
    };

    checkOrientation();

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // When device is turned to horizontal (landscape), reset dismiss state so it works next time
  useEffect(() => {
    if (!isPortraitMobile) {
      setIsDismissed(false);
    }
  }, [isPortraitMobile]);

  if (!isPortraitMobile || isDismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Screen orientation suggestion"
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#070b14]/75 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
    >
      <div className="relative flex flex-col items-center max-w-xs text-center px-6 py-8 rounded-2xl bg-[#0c1222]/90 border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-white">
        {/* Animated Phone Graphic */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          {/* Circular Rotation Guide Track */}
          <svg
            className="absolute inset-0 w-full h-full text-white/20"
            viewBox="0 0 80 80"
            fill="none"
          >
            <circle
              cx="40"
              cy="40"
              r="34"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Rotating Arrow Indicator */}
          <svg
            className="absolute inset-0 w-full h-full text-amber-400 rotate-phone-arrow"
            viewBox="0 0 80 80"
            fill="none"
          >
            <path
              d="M66 40 A26 26 0 0 1 40 66"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <polygon points="40,70 40,62 33,66" fill="currentColor" />
          </svg>

          {/* Phone Body with Rotation Keyframe */}
          <div className="w-9 h-14 rounded-lg border-2 border-white bg-slate-900/90 shadow-lg flex flex-col items-center justify-between p-1 rotate-phone-device">
            {/* Speaker bar */}
            <div className="w-2.5 h-0.5 rounded-full bg-white/60" />
            {/* Screen inner miniature horizon preview */}
            <div className="w-full flex-1 my-0.5 rounded-[3px] bg-gradient-to-b from-sky-400/30 to-amber-400/30 border border-white/10 flex items-center justify-center overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-amber-300/80 shadow-sm" />
            </div>
            {/* Home indicator bar */}
            <div className="w-3 h-0.5 rounded-full bg-white/50" />
          </div>
        </div>

        {/* Text Instructions */}
        <h2 className="text-base sm:text-lg font-bold tracking-wide text-white uppercase font-sans mb-1.5">
          Rotate For Wide View
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-5">
          Turn your device horizontally for the complete panoramic diorama experience.
        </p>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-400 hover:text-white px-4 py-2 rounded-full border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all cursor-pointer active:scale-95"
        >
          Continue in portrait
        </button>
      </div>

      <style>{`
        @keyframes rotatePhoneAnimation {
          0%, 15% {
            transform: rotate(0deg);
          }
          45%, 70% {
            transform: rotate(90deg);
          }
          90%, 100% {
            transform: rotate(0deg);
          }
        }

        @keyframes rotateArrowPulse {
          0%, 15% {
            opacity: 0.3;
            transform: rotate(0deg);
          }
          45%, 70% {
            opacity: 1;
            transform: rotate(45deg);
          }
          90%, 100% {
            opacity: 0.3;
            transform: rotate(0deg);
          }
        }

        .rotate-phone-device {
          animation: rotatePhoneAnimation 3s ease-in-out infinite;
          transform-origin: center center;
        }

        .rotate-phone-arrow {
          animation: rotateArrowPulse 3s ease-in-out infinite;
          transform-origin: center center;
        }
      `}</style>
    </aside>
  );
};
