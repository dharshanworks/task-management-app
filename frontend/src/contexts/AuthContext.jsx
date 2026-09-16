import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const AuthContext = createContext(null);

function formatAuthError(err) {
  if (!err) return null;
  const code = err.code || '';
  if (code === 'auth/unauthorized-domain') {
    return 'Domain unauthorized. Please add this domain to Firebase Console → Authentication → Settings → Authorized domains.';
  }
  if (code === 'auth/popup-closed-by-user') {
    return 'Google sign-in window was closed. Please click the button below to try again.';
  }
  if (code === 'auth/cancelled-popup-request') {
    return 'A sign-in request is already in progress. Please wait.';
  }
  if (code === 'auth/popup-blocked') {
    return 'Popup was blocked by your browser. Please allow popups or use the Redirect option below.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Network connection error. Please check your internet connection.';
  }
  return err.message || 'Authentication failed. Please try again.';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for result if user completed a redirect sign-in
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((err) => {
        console.error('Redirect sign-in error:', err);
        setError(formatAuthError(err));
      });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);

      // In production, Railway's edge proxy injects COOP: same-origin which
      // breaks signInWithPopup (the popup can't communicate back to the opener).
      // Use signInWithRedirect instead — it navigates the full page to Google
      // and redirects back, completely avoiding the cross-window COOP issue.
      const isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';

      if (isLocalhost) {
        // Popup works fine on localhost (no COOP proxy interference)
        await signInWithPopup(auth, googleProvider);
      } else {
        // Production: use redirect flow
        await signInWithRedirect(auth, googleProvider);
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      // If popup failed (localhost), fall back to redirect
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
        console.log('Popup failed, falling back to redirect...');
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          setError(formatAuthError(redirectErr));
          throw redirectErr;
        }
      }
      setError(formatAuthError(err));
      throw err;
    }
  };

  const signInWithGoogleRedirect = async () => {
    try {
      setError(null);
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      console.error('Redirect sign-in error:', err);
      setError(formatAuthError(err));
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  /** Get the current user's ID token for API calls */
  const getIdToken = async () => {
    if (!user) return null;
    try {
      return await user.getIdToken();
    } catch (err) {
      console.error('Token error:', err);
      return null;
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithGoogleRedirect,
    logout,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
