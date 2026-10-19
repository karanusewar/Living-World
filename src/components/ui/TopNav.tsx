import React from 'react';
import { Volume2, VolumeX, Compass } from 'lucide-react';

interface TopNavProps {
  onOpenMenu?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  isFreeExplore?: boolean;
  onToggleFreeExplore?: (enabled: boolean) => void;
  onScrollNext?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenMenu,
  isMuted = true,
  onToggleMute,
  isFreeExplore = false,
  onToggleFreeExplore,
  onScrollNext,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-none select-none px-6 py-6 sm:px-8 sm:py-8 md:px-14 md:py-10 flex items-start justify-between">
      {/* Brand Wordmark (Top-Left): exactly 2 lines in dark bold sans */}
      <div className="pointer-events-auto flex flex-col items-start leading-[1.14]">
        <span className="text-xs md:text-sm tracking-[0.22em] font-bold text-slate-900 uppercase font-sans">
          A LIVING
        </span>
        <span className="text-xs md:text-sm tracking-[0.22em] font-bold text-slate-900 uppercase font-sans">
          WORLD
        </span>
      </div>

      {/* Top Center: Hand Pointer + "SCROLL TO EXPLORE" */}
      <button
        onClick={onScrollNext}
        title="Scroll or click to advance story"
        className="pointer-events-auto flex flex-col items-center justify-center -translate-x-1/2 left-1/2 absolute top-6 sm:top-8 md:top-10 cursor-pointer group transition-transform duration-200 active:scale-95"
      >
        {/* Hand pointer cursor icon (white fill with crisp black outline) */}
        <div className="mb-1.5 transition-transform duration-300 group-hover:-translate-y-1">
          <svg
            className="w-5 h-5 drop-shadow-sm"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 3.5V13L7.2 11.2C6.8 10.8 6.2 10.8 5.8 11.2C5.4 11.6 5.4 12.2 5.8 12.6L10.5 17.3C11.3 18.1 12.4 18.5 13.5 18.5H16.5C18.2 18.5 19.5 17.2 19.5 15.5V9.5C19.5 8.7 18.8 8 18 8C17.7 8 17.4 8.1 17.2 8.3C16.9 7.5 16.3 7 15.5 7C15.2 7 14.9 7.1 14.7 7.3C14.4 6.5 13.8 6 13 6C12.7 6 12.4 6.1 12.2 6.3V3.5C12.2 2.7 11.5 2 10.7 2H10.5C9.7 2 9 2.7 9 3.5Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-[10px] md:text-[11px] tracking-[0.28em] font-bold text-slate-900 uppercase font-sans group-hover:text-amber-800 transition-colors">
          SCROLL TO EXPLORE
        </span>
      </button>

      {/* Top Right: Quick Controls & Hamburger Icon */}
      <div className="pointer-events-auto flex items-center gap-3">
        {/* Sound toggle button */}
        {onToggleMute && (
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Enable nature soundscape' : 'Mute soundscape'}
            aria-label={isMuted ? 'Enable nature soundscape' : 'Mute soundscape'}
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-slate-900 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
          </button>
        )}

        {/* Free Orbit toggle button */}
        {onToggleFreeExplore && (
          <button
            onClick={() => onToggleFreeExplore(!isFreeExplore)}
            title={isFreeExplore ? 'Return to story camera' : 'Free 3D orbit explore'}
            aria-label={isFreeExplore ? 'Return to story camera' : 'Free 3D orbit explore'}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 ${
              isFreeExplore
                ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300'
                : 'bg-white/70 hover:bg-white text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
          </button>
        )}

        {/* Clean 3 Horizontal Black Bars (Hamburger Icon) */}
        <button
          onClick={onOpenMenu}
          title="Open World Directory & Settings"
          aria-label="Open World Directory and Settings"
          className="flex flex-col justify-between w-6 h-4 md:w-7 md:h-[18px] cursor-pointer hover:opacity-75 transition-opacity py-0.5"
        >
          <span className="w-full h-[2.5px] bg-slate-900 rounded-full" />
          <span className="w-full h-[2.5px] bg-slate-900 rounded-full" />
          <span className="w-full h-[2.5px] bg-slate-900 rounded-full" />
        </button>
      </div>
    </header>
  );
};
