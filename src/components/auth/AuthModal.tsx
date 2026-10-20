import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, AlertCircle, Loader2 } from 'lucide-react';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, error, clearError } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) clearError();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setSubmitting(true);
      await signInWithGoogle();
      onClose();
    } catch {
      // Handled in auth context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[390px] bg-[#0c121d] border border-white/10 rounded-2xl p-7 sm:p-8 shadow-2xl text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle architectural gradient background accent */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent pointer-events-none" />

        {/* Minimal close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Monogram Badge */}
        <div className="relative flex flex-col items-center text-center mt-1 mb-6">
          <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-center mb-4 shadow-inner">
            <span className="font-serif-display text-2xl font-bold tracking-tight text-amber-100">
              LW
            </span>
          </div>

          <span className="text-[10px] tracking-[0.25em] font-semibold text-amber-200/80 uppercase font-sans mb-1.5">
            Passport & Journal
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-tight">
            Enter the Living World
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-[270px]">
            Sign in to bookmark serene vistas, uncover valley stories, and continue your stroll anytime.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-rose-950/40 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="flex-1 leading-snug">{error}</span>
          </div>
        )}

        {/* Sign-in button */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-medium text-sm transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                <span className="text-xs tracking-wide uppercase font-semibold">Connecting...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-xs font-semibold tracking-wide">Continue with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Bottom subtle privacy reassurance */}
        <p className="mt-5 text-center text-[11px] text-slate-400 font-sans tracking-tight">
          No passwords required · Instant access to your personal journal
        </p>
      </div>
    </div>
  );
};

export const UserProfileMenu: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse border border-white/10" />
    );
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-white/20 hover:border-amber-400/50 text-white backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
          title="Sign In"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
          <span className="text-[11px] tracking-[0.14em] font-medium uppercase font-sans text-slate-200 group-hover:text-white">
            Sign In
          </span>
        </button>

        <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-white/20 hover:border-amber-400/50 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-lg"
        title={user.displayName || user.email || 'User Account'}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'Profile'}
            className="w-7 h-7 rounded-full object-cover border border-white/20"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30 flex items-center justify-center font-bold text-xs font-serif-display">
            {(user.displayName || user.email || 'U')[0].toUpperCase()}
          </div>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0c121d]/95 border border-white/10 p-2 shadow-2xl text-white backdrop-blur-md z-50">
          <div className="px-3 py-2 border-b border-white/10">
            <p className="text-xs font-medium text-white truncate font-sans">
              {user.displayName || 'Explorer'}
            </p>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              {user.email}
            </p>
          </div>

          <button
            onClick={() => {
              setDropdownOpen(false);
              signOut();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-500/10 transition-colors cursor-pointer font-sans"
          >
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
