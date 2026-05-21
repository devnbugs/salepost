# Firebase Integration Guide

This document explains how to use Firebase services in the Salepost application.

## Configuration

Firebase credentials are stored in environment variables in the `.env` file:

```
VITE_FIREBASE_API_KEY=AIzaSyAYqoy6sssgiCfEmu2L40cTAEkYeAm1gMY
VITE_FIREBASE_AUTH_DOMAIN=salepostapp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=salepostapp
VITE_FIREBASE_STORAGE_BUCKET=salepostapp.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=684824078528
VITE_FIREBASE_APP_ID=1:684824078528:web:2b5d037888e731d682e525
VITE_FIREBASE_MEASUREMENT_ID=G-V5N768365Y
```

## Initialization

Firebase is automatically initialized in `resources/js/bootstrap.ts` when the app loads. The Analytics service is initialized to track app usage.

## Available Services

Firebase services are available through the config file: `resources/js/config/firebase.ts`

- **Analytics** - `getFirebaseAnalytics()` - Track user interactions and events
- **Auth** - `getFirebaseAuth()` - User authentication and account management
- **Firestore** - `getFirebaseFirestore()` - Real-time database
- **Storage** - `getFirebaseStorage()` - Cloud file storage
- **Messaging** - `getFirebaseMessaging()` - Push notifications

## Usage in React Components

### Method 1: Using Hooks (Recommended)

```tsx
import { useFirebaseAuth, useFirebaseFirestore } from '@/hooks/useFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export function MyComponent() {
  const auth = useFirebaseAuth();
  const db = useFirebaseFirestore();

  useEffect(() => {
    // Monitor auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('User:', user);
    });

    return () => unsubscribe();
  }, [auth]);

  return <div>My Component</div>;
}
```

### Method 2: Direct Import

```tsx
import { getFirebaseAuth, getFirebaseFirestore } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function MyComponent() {
  const auth = getFirebaseAuth();
  const db = getFirebaseFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('User:', user);
    });

    return () => unsubscribe();
  }, []);

  return <div>My Component</div>;
}
```

## Common Tasks

### Authentication

```tsx
import { getFirebaseAuth } from '@/config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const auth = getFirebaseAuth();

// Sign up
await createUserWithEmailAndPassword(auth, email, password);

// Sign in
await signInWithEmailAndPassword(auth, email, password);

// Sign out
await auth.signOut();
```

### Firestore Operations

```tsx
import { getFirebaseFirestore } from '@/config/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const db = getFirebaseFirestore();

// Add document
await addDoc(collection(db, 'users'), {
  name: 'John',
  email: 'john@example.com',
});

// Query documents
const q = query(collection(db, 'users'), where('email', '==', 'john@example.com'));
const snapshot = await getDocs(q);
```

### File Storage

```tsx
import { getFirebaseStorage } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storage = getFirebaseStorage();

// Upload file
const file = new File(['content'], 'test.txt', { type: 'text/plain' });
const fileRef = ref(storage, 'uploads/test.txt');
await uploadBytes(fileRef, file);

// Get download URL
const url = await getDownloadURL(fileRef);
```

### Push Notifications

```tsx
import { getFirebaseMessaging } from '@/config/firebase';
import { getToken, onMessage } from 'firebase/messaging';

const messaging = getFirebaseMessaging();

// Get FCM token
const token = await getToken(messaging, {
  vapidKey: 'YOUR_PUBLIC_VAPID_KEY',
});

// Listen for messages
onMessage(messaging, (payload) => {
  console.log('Message received:', payload);
});
```

### Analytics Events

```tsx
import { getFirebaseAnalytics } from '@/config/firebase';
import { logEvent } from 'firebase/analytics';

const analytics = getFirebaseAnalytics();

// Log custom event
logEvent(analytics, 'sale_completed', {
  value: 100,
  currency: 'USD',
});
```

## Environment Setup

To use Firebase services locally:

1. Ensure `.env` file has all Firebase credentials set
2. Restart the dev server after updating `.env`
3. Firebase will automatically initialize when the app loads

## Debugging

To check if Firebase is initialized:

```tsx
import app from '@/config/firebase';
console.log(app.name); // '[DEFAULT]'
console.log(app.options); // Firebase config object
```

## Firebase Console

Access your Firebase project at: https://console.firebase.google.com/project/salepostapp

## Resources

- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Firebase Authentication](https://firebase.google.com/docs/auth/web/start)
- [Cloud Firestore](https://firebase.google.com/docs/firestore/quickstart)
- [Cloud Storage](https://firebase.google.com/docs/storage/web/start)
- [Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/js/client-setup)
