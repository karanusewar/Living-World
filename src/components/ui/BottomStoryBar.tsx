import React from 'react';
import { CHAPTERS } from '../../lib/worldData';
import { TimeOfDay } from '../../types/world';

interface BottomStoryBarProps {
  timeOfDay: TimeOfDay;
  onSelectChapter?: (index: number) => void;
  onCycleLighting: () => void;
  activeChapterIndex?: number;
}

export const BottomStoryBar: React.FC<BottomStoryBarProps> = ({
  onSelectChapter,
  onCycleLighting,
  activeChapterIndex = 0,
}) => {
  const currentChapter = CHAPTERS[activeChapterIndex] || CHAPTERS[0];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none select-none pb-8 md:pb-12 px-8 md:px-14">
      <div className="w-full flex flex-col gap-6 md:gap-7">
        {/* Title & Subtitle (Bottom-Left: exactly 2 lines in serif Cormorant Garamond) */}
        <div className="pointer-events-auto flex flex-col items-start max-w-xl">
          <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-bold tracking-tight text-white leading-[0.98] drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            A DAY IN<br />
            OUR WORLD
          </h1>
          <p key={currentChapter.id} className="text-white/95 text-xs sm:text-sm md:text-[15px] font-normal tracking-wide mt-2 md:mt-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] animate-in fade-in duration-500">
            {currentChapter.quote}
          </p>
        </div>

        {/* Timeline Bar & Day/Night Toggle (Bottom Row) */}
        <div className="pointer-events-auto flex items-center justify-between gap-6 md:gap-10">
          {/* Progress Timeline Track */}
          <div className="flex-1 flex flex-col gap-2">
            {/* The Horizontal Line with Dot Indicator */}
            <div className="relative w-full h-[2px] bg-white/70 rounded-full">
              {/* White Circular Bead / Dot sitting on the line */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] transition-all duration-300"
                style={{
                  left: `${(activeChapterIndex / (CHAPTERS.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Labels Row with Centered Dots: SUNRISE · COMMUNITY · NATURE · GOLDEN HOUR */}
            <div className="flex items-center justify-between w-full pt-1.5">
              {CHAPTERS.map((chap, idx) => {
                const isActive = activeChapterIndex === idx;
                return (
                  <React.Fragment key={chap.id}>
                    <button
                      onClick={() => onSelectChapter && onSelectChapter(idx)}
                      className={`text-[10px] md:text-xs tracking-[0.24em] font-semibold uppercase font-sans transition-all duration-200 cursor-pointer text-left ${
                        isActive
                          ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {chap.label}
                    </button>

                    {/* Centered dot separator between chapters */}
                    {idx < CHAPTERS.length - 1 && (
                      <span className="text-white/80 text-xs md:text-sm select-none font-bold">
                        •
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Circular Day/Night Toggle Button (Matching Screenshot Bottom Right!) */}
          <button
            onClick={onCycleLighting}
            title="Toggle Day / Night atmosphere"
            aria-label="Toggle day and night atmosphere"
            className="shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white hover:bg-slate-100 text-slate-900 flex items-center justify-center shadow-2xl transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {/* Custom SVG matching the exact Day/Night icon in the image */}
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="9.5" fill="#0F172A" />
              <path
                d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21V3Z"
                fill="#FFFFFF"
              />
              <circle cx="7.5" cy="7.5" r="0.8" fill="#0F172A" />
              <circle cx="6" cy="12" r="0.8" fill="#0F172A" />
              <circle cx="7.5" cy="16.5" r="0.8" fill="#0F172A" />
              <path
                d="M12 4.5C14.8 6.2 16.5 9.2 16.5 12C16.5 14.8 14.8 17.8 12 19.5C16.14 19.5 19.5 16.14 19.5 12C19.5 7.86 16.14 4.5 12 4.5Z"
                fill="#FFFFFF"
              />
              <circle cx="14.2" cy="10" r="0.6" fill="#0F172A" />
              <circle cx="15.2" cy="14" r="0.6" fill="#0F172A" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};
