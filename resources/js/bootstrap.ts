import axios from 'axios';
import { getFirebaseAnalytics } from '@/config/firebase';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Initialize Firebase
try {
  getFirebaseAnalytics();
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
}
