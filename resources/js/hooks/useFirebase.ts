import { useState, useEffect } from 'react';
import {
  getFirebaseAuth,
  getFirebaseFirestore,
  getFirebaseStorage,
  getFirebaseMessaging,
} from '@/config/firebase';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';
import { Messaging } from 'firebase/messaging';

interface FirebaseServices {
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
  messaging: Messaging;
}

/**
 * Hook to access Firebase services
 * @returns Firebase services (auth, firestore, storage, messaging)
 *
 * @example
 * const { auth, firestore } = useFirebase();
 * const user = onAuthStateChanged(auth, (user) => {
 *   console.log('User:', user);
 * });
 */
export function useFirebase(): FirebaseServices {
  const [services, setServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const firestore = getFirebaseFirestore();
      const storage = getFirebaseStorage();
      const messaging = getFirebaseMessaging();

      setServices({
        auth,
        firestore,
        storage,
        messaging,
      });
    } catch (error) {
      console.error('Failed to initialize Firebase services:', error);
    }
  }, []);

  return (
    services || {
      auth: {} as Auth,
      firestore: {} as Firestore,
      storage: {} as FirebaseStorage,
      messaging: {} as Messaging,
    }
  );
}

/**
 * Hook to get Firebase Auth service
 */
export function useFirebaseAuth(): Auth {
  return getFirebaseAuth();
}

/**
 * Hook to get Firebase Firestore service
 */
export function useFirebaseFirestore(): Firestore {
  return getFirebaseFirestore();
}

/**
 * Hook to get Firebase Storage service
 */
export function useFirebaseStorage(): FirebaseStorage {
  return getFirebaseStorage();
}

/**
 * Hook to get Firebase Messaging service
 */
export function useFirebaseMessaging(): Messaging {
  return getFirebaseMessaging();
}
