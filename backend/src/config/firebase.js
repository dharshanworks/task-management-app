const admin = require('firebase-admin');

/**
 * Initialize Firebase Admin SDK.
 * 
 * Supports two modes:
 * 1. Service account JSON file (local development)
 * 2. Inline credentials via environment variables (production / Railway)
 */
function initializeFirebase() {
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      // Local development — use service account file
      const serviceAccount = require(
        require('path').resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else if (process.env.FIREBASE_PROJECT_ID) {
      // Production — use inline credentials
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      // Fallback: Application Default Credentials
      admin.initializeApp();
    }
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    // Don't crash — allow health endpoint to still respond
  }

  return admin;
}

const firebaseAdmin = initializeFirebase();
const db = admin.firestore();

module.exports = { admin, db };
