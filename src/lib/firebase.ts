import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCbUECBk76LStT1EMR9O0jcXQ2m_h0jtlo",
  authDomain: "kyron-94213.firebaseapp.com",
  projectId: "kyron-94213",
  storageBucket: "kyron-94213.firebasestorage.app",
  messagingSenderId: "191899636676",
  appId: "1:191899636676:web:f82bdc0716a31bffee4a91",
  measurementId: "G-5ECZBT89X4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);