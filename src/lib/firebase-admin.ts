// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

let serviceAccount: admin.ServiceAccount;

// Check if the service account key is available and parse it.
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } catch (error) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error);
    // Don't throw an error here to allow the build to pass.
    // Functions depending on Firebase Admin will fail gracefully.
  }
} else {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Firebase Admin features will be disabled.');
}


export const initAdmin = () => {
  // Initialize only if the service account is available and there are no existing apps.
  if (serviceAccount && !admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error: any) {
      console.error('Firebase Admin initialization error', error.stack);
    }
  }
};
