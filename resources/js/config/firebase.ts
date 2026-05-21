import { initializeApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getMessaging, Messaging } from 'firebase/messaging';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
let analytics: Analytics | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let messaging: Messaging | null = null;

// Get or initialize services on demand
export function getFirebaseAnalytics() {
  if (!analytics) {
    analytics = getAnalytics(app);
  }
  return analytics;
}

export function getFirebaseAuth() {
  if (!auth) {
    auth = getAuth(app);
  }
  return auth;
}

export function getFirebaseFirestore() {
  if (!firestore) {
    firestore = getFirestore(app);
  }
  return firestore;
}

export function getFirebaseStorage() {
  if (!storage) {
    storage = getStorage(app);
  }
  return storage;
}

export function getFirebaseMessaging() {
  if (!messaging) {
    messaging = getMessaging(app);
  }
  return messaging;
}

// Export the initialized app
export default app;
