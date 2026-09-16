import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const { signInWithGoogle, signInWithGoogleRedirect, error } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    if (isSigningIn) return;
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleRedirectSignIn = async (e) => {
    e.preventDefault();
    if (isSigningIn) return;
    try {
      setIsSigningIn(true);
      await signInWithGoogleRedirect();
    } catch (err) {
      setIsSigningIn(false);
    }
  };

  const features = [
    { icon: '📋', text: 'Kanban board with drag & drop' },
    { icon: '🤖', text: 'AI-powered task suggestions' },
    { icon: '🔒', text: 'Secure Google authentication' },
    { icon: '⚡', text: 'Real-time sync across devices' },
  ];

  return (
    <div className="login-page">
      <div className="animated-bg" />

      {/* Floating accent orb */}
      <div className="login-orb login-orb--1" />
      <div className="login-orb login-orb--2" />

      <div className="login-container">
        <div className="login-card glass-card">
          {/* Logo & Branding */}
          <div className="login-header">
            <div className="login-logo">
              <svg width="56" height="56" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="14" fill="url(#grad)" />
                <path d="M14 24L20 30L34 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="48" y2="48">
                    <stop stopColor="#6366f1" />
                    <stop offset="1" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="login-title">TaskFlow</h1>
            <p className="login-subtitle">
              Smart task management with AI-powered intelligence
            </p>
          </div>

          {/* Features — staggered entrance */}
          <div className="login-features">
            {features.map((f, i) => (
              <div
                className="login-feature"
                key={i}
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                <span className="login-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Sign-in Button */}
          <div className="login-actions">
            <button
              className="btn-google"
              onClick={handleSignIn}
              disabled={isSigningIn}
              id="google-signin-btn"
            >
              {isSigningIn ? (
                <span className="btn-loading-content">
                  <span className="btn-spinner" />
                  Connecting to Google...
                </span>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <button
              type="button"
              className="btn-redirect-link"
              onClick={handleRedirectSignIn}
              disabled={isSigningIn}
            >
              Popup blocked? Try page redirect →
            </button>
          </div>

          {error && (
            <p className="login-error">{error}</p>
          )}
        </div>

        {/* Tech strip */}
        <div className="login-tech-strip">
          <span className="login-tech-dot" />
          <span>React</span>
          <span className="login-tech-sep">·</span>
          <span>Firebase</span>
          <span className="login-tech-sep">·</span>
          <span>Gemini AI</span>
          <span className="login-tech-sep">·</span>
          <span>Firestore</span>
        </div>
      </div>
    </div>
  );
}
