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
    let isMounted = true;

    // Check for result if user completed a redirect sign-in
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user && isMounted) {
          setUser(result.user);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Redirect sign-in error:', err);
        if (isMounted) {
          setError(formatAuthError(err));
        }
      });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (isMounted) {
        setUser(firebaseUser);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      // Popup sign-in is the primary, reliable flow for Firebase Web SDK.
      // Now that Express has COOP: unsafe-none active, popups communicate directly
      // with window.opener and do NOT suffer from third-party cookie / storage partitioning blocks.
      const result = await signInWithPopup(auth, googleProvider);
      if (result?.user) {
        setUser(result.user);
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      // If popup was blocked by browser popup blocker, try redirect
      if (err.code === 'auth/popup-blocked') {
        console.log('Popup blocked, attempting redirect...');
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
