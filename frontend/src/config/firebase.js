import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAkp3v6OoCaoWEQq0ht0nzNpH4O25jdt8M',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'task-management-app-001-3f330.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'task-management-app-001-3f330',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'task-management-app-001-3f330.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '880620557199',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:880620557199:web:26f89a56cb82d90e9371fa',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
export default app;
