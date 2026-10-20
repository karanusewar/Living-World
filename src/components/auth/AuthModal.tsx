import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogIn, LogOut, X, AlertCircle, Loader2 } from 'lucide-react';

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
        className="relative w-full max-w-[360px] bg-[#0c121d] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimal close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Clean Header without icons/badges */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
            Welcome to Living World
          </h2>
          <p className="text-xs text-slate-300 mt-2 max-w-[260px] leading-relaxed">
            Sign in with Google to save your favorites, explore stories, and sync your journey.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="flex-1 leading-snug">{error}</span>
          </div>
        )}

        {/* Sign-in button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
              <span>Connecting...</span>
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
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Bottom subtle note */}
        <p className="mt-4 text-[11px] text-center text-slate-400">
          By signing in, you agree to our Terms and explore with personalized preferences.
        </p>
      </div>
    </div>
  );
};

export const UserProfileMenu: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImgError(false);
  }, [user]);

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
      <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <>
        {/* Reverted to the original white pill sign-in button */}
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 hover:bg-white text-slate-900 text-xs font-semibold backdrop-blur-md shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          title="Sign in with Google"
        >
          <LogIn className="w-3.5 h-3.5 text-amber-700" />
          <span>Sign In</span>
        </button>

        <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  const avatarSrc = (!imgError && user.photoURL) ? user.photoURL : '/user.png';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-0.5 rounded-full bg-white/90 hover:bg-white text-slate-900 transition-all duration-200 hover:scale-105 shadow-md cursor-pointer ring-1 ring-black/5"
        title={user.displayName || user.email || 'User Profile'}
      >
        <img
          src={avatarSrc}
          alt={user.displayName || 'Profile'}
          onError={() => setImgError(true)}
          className="w-7 h-7 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/95 border border-white/10 p-2 shadow-2xl text-white backdrop-blur-md z-50">
          <div className="px-3 py-2.5 border-b border-white/10 flex items-center gap-2.5">
            <img
              src={avatarSrc}
              alt={user.displayName || 'Profile'}
              className="w-8 h-8 rounded-full object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">
                {user.displayName || 'Explorer'}
              </p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setDropdownOpen(false);
              signOut();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-xl text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
