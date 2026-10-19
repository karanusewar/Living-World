import React from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface FreeExploreControlsProps {
  isFreeExplore: boolean;
  onReturnToStory: () => void;
}

export const FreeExploreControls: React.FC<FreeExploreControlsProps> = ({
  isFreeExplore,
  onReturnToStory,
}) => {
  if (!isFreeExplore) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/20 py-2 px-4 rounded-full shadow-2xl animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-2 text-xs text-white/90">
        <RotateCcw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
        <span className="hidden sm:inline font-medium">Free Orbit Active</span>
        <span className="text-white/40 hidden sm:inline">·</span>
        <span className="text-white/70 text-[11px]">Drag to rotate · Scroll to zoom</span>
      </div>

      <button
        onClick={onReturnToStory}
        className="ml-2 py-1 px-3 rounded-full bg-white text-slate-900 text-xs font-semibold tracking-wider uppercase hover:bg-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 shadow"
      >
        <ArrowLeft className="w-3 h-3" />
        <span>Return</span>
      </button>
    </div>
  );
};
