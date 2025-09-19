// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

// Check if the service account key is available
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error('The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Please check your .env.local file.');
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

export const initAdmin = () => {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error: any) {
      console.error('Firebase Admin initialization error', error.stack);
      throw new Error('Failed to initialize Firebase Admin SDK. Please check your service account credentials.');
    }
  }
};
