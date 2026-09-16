import { useAuth } from '../../contexts/AuthContext';
import './AppLayout.css';

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-layout">
      <div className="animated-bg" />

      {/* Top Navigation Bar */}
      <header className="app-header glass-card">
        <div className="app-header-left">
          <div className="app-logo">
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="url(#gradH)" />
              <path d="M14 24L20 30L34 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="gradH" x1="0" y1="0" x2="48" y2="48">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <span className="app-logo-text">TaskFlow</span>
          </div>
        </div>

        <div className="app-header-right">
          <div className="app-user-info">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="app-avatar"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="app-avatar app-avatar-placeholder">
                {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <span className="app-user-name">{user?.displayName || user?.email}</span>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={logout}
            id="logout-btn"
            title="Sign out"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {children}
      </main>
    </div>
  );
}
