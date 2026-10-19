import React from 'react';
import { X, MapPin, Sparkles, Clock, Users, Volume2 } from 'lucide-react';
import { Hotspot } from '../../types/world';
import { audioManager } from '../../lib/audio';

interface LocationModalProps {
  hotspot: Hotspot | null;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ hotspot, onClose }) => {
  if (!hotspot) return null;

  const playChime = () => {
    audioManager.playChime();
  };

  return (
    <aside aria-label="Location Details" className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-slate-900/90 border border-white/20 rounded-2xl p-6 sm:p-8 text-white shadow-2xl backdrop-blur-xl transition-all duration-300">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-white/10 text-amber-300 border border-white/10">
              <MapPin className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-widest text-amber-300/90 font-medium">
              {hotspot.tag}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={playChime}
              title="Play location chime"
              aria-label="Play location chime"
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close location details"
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title & Short Description */}
        <h2 className="font-serif-display text-2xl sm:text-3xl font-medium tracking-tight text-white mb-2">
          {hotspot.name}
        </h2>
        <p className="text-sm text-white/75 italic mb-5 leading-relaxed">
          &ldquo;{hotspot.shortDescription}&rdquo;
        </p>

        {/* Narrative Story */}
        <div className="text-sm text-white/90 leading-relaxed space-y-3 mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
          <p>{hotspot.story}</p>
        </div>

        {/* Details List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/80 border-t border-white/10 pt-4 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span>{hotspot.details.timeActive}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span>{hotspot.details.atmosphere}</span>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Users className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span>{hotspot.details.people}</span>
          </div>
        </div>

        {/* Close / Action Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-white/90 hover:bg-white text-slate-900 font-medium text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-md text-center"
          >
            Continue Journey
          </button>
        </div>
      </div>
    </aside>
  );
};
