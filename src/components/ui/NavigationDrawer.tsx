import React from 'react';
import { X, Sun, Sunrise, Sunset, Moon, Sparkles, Volume2, VolumeX, Compass, MapPin } from 'lucide-react';
import { CHAPTERS, HOTSPOTS } from '../../lib/worldData';
import { TimeOfDay } from '../../types/world';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentProgress: number;
  timeOfDay: TimeOfDay;
  onSelectChapter: (index: number) => void;
  onSelectLighting: (time: TimeOfDay) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFreeExplore?: boolean;
  onToggleFreeExplore?: (enabled: boolean) => void;
  onSelectHotspot: (id: string) => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentProgress,
  timeOfDay,
  onSelectChapter,
  onSelectLighting,
  isMuted,
  onToggleMute,
  isFreeExplore,
  onToggleFreeExplore,
  onSelectHotspot,
}) => {
  if (!isOpen) return null;

  const activeChapterIndex = Math.min(
    CHAPTERS.length - 1,
    Math.max(0, Math.round(currentProgress * (CHAPTERS.length - 1)))
  );

  return (
    <aside aria-label="Navigation Menu" className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md h-full bg-slate-950/95 border-l border-white/10 p-6 md:p-8 flex flex-col justify-between overflow-y-auto text-white shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-white/90">
              A LIVING WORLD
            </h2>
            <p className="text-[11px] text-white/50 tracking-wider uppercase mt-0.5">
              Experience Navigation
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-6 space-y-8 flex-1">
          {/* 1. Exploration Mode Switcher */}
          <div>
            <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-3 font-semibold">
              Exploration Mode
            </span>
            <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => {
                  onToggleFreeExplore?.(false);
                  onClose();
                }}
                className={`py-2 px-3 rounded-lg text-xs font-medium tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !isFreeExplore
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Story Mode</span>
              </button>
              <button
                onClick={() => {
                  onToggleFreeExplore?.(true);
                  onClose();
                }}
                className={`py-2 px-3 rounded-lg text-xs font-medium tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isFreeExplore
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Free Explore</span>
              </button>
            </div>
          </div>

          {/* 2. Story Chapters */}
          <div>
            <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-3 font-semibold">
              Story Chapters
            </span>
            <div className="space-y-1.5">
              {CHAPTERS.map((chap, idx) => {
                const isActive = activeChapterIndex === idx && !isFreeExplore;
                return (
                  <button
                    key={chap.id}
                    onClick={() => {
                      onToggleFreeExplore?.(false);
                      onSelectChapter(idx);
                      onClose();
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isActive
                        ? 'bg-white/15 border-white/30 text-white'
                        : 'bg-white/5 hover:bg-white/10 border-white/5 text-white/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-white/40 group-hover:text-amber-300 transition-colors">
                        0{idx + 1}
                      </span>
                      <div>
                        <span className="text-xs font-medium tracking-wider uppercase block">
                          {chap.label}
                        </span>
                        <span className="text-[11px] text-white/50 block font-normal">
                          {chap.title}
                        </span>
                      </div>
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Atmosphere & Time of Day */}
          <div>
            <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-3 font-semibold">
              Lighting & Atmosphere
            </span>
            <div className="grid grid-cols-4 gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => onSelectLighting('morning')}
                title="Morning"
                aria-label="Set morning lighting"
                className={`py-2 flex flex-col items-center gap-1 rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  timeOfDay === 'morning' || timeOfDay === 'sunrise' ? 'bg-amber-600/80 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <Sunrise className="w-4 h-4" />
                <span className="scale-90 font-medium">Morning</span>
              </button>
              <button
                onClick={() => onSelectLighting('afternoon')}
                title="Afternoon"
                aria-label="Set afternoon lighting"
                className={`py-2 flex flex-col items-center gap-1 rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  timeOfDay === 'afternoon' || timeOfDay === 'community' || timeOfDay === 'nature' ? 'bg-sky-600/80 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span className="scale-90 font-medium">Noon</span>
              </button>
              <button
                onClick={() => onSelectLighting('evening')}
                title="Evening"
                aria-label="Set evening lighting"
                className={`py-2 flex flex-col items-center gap-1 rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  timeOfDay === 'evening' || timeOfDay === 'golden_hour' ? 'bg-orange-600/80 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <Sunset className="w-4 h-4" />
                <span className="scale-90 font-medium">Evening</span>
              </button>
              <button
                onClick={() => onSelectLighting('night')}
                title="Night"
                aria-label="Set night lighting"
                className={`py-2 flex flex-col items-center gap-1 rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  timeOfDay === 'night' ? 'bg-indigo-900 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span className="scale-90 font-medium">Night</span>
              </button>
            </div>
          </div>

          {/* 4. Landmarks Directory */}
          <div>
            <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-3 font-semibold">
              Landmarks & Hotspots ({HOTSPOTS.length})
            </span>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {HOTSPOTS.map(spot => (
                <button
                  key={spot.id}
                  onClick={() => {
                    onSelectHotspot(spot.id);
                    onClose();
                  }}
                  className="p-2 text-left bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-lg transition-all cursor-pointer flex items-center gap-2 group"
                >
                  <MapPin className="w-3 h-3 text-amber-300/80 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-white/80 group-hover:text-white truncate">
                    {spot.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Soundscape Toggle */}
          <div className="pt-2">
            <button
              onClick={onToggleMute}
              className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white/50" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
                <div className="text-left">
                  <span className="text-xs font-medium block">
                    Procedural Soundscape
                  </span>
                  <span className="text-[10px] text-white/50 block">
                    {isMuted ? 'Muted (Click to enable)' : 'Gentle river & bird ambience active'}
                  </span>
                </div>
              </div>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${isMuted ? 'bg-white/10 text-white/60' : 'bg-emerald-500/20 text-emerald-300'}`}>
                {isMuted ? 'Off' : 'On'}
              </span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-white/10 text-[11px] text-white/40 flex items-center justify-between">
          <span>Interactive 3D WebGL Diorama</span>
          <span>Designed with care</span>
        </div>
      </div>
    </aside>
  );
};
