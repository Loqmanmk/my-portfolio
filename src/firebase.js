import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

/* ─── Firebase Config  ─── */
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

/* ─── Init Firebase App ─── */
const app = initializeApp(firebaseConfig);

/* ─── Firestore Database ─── */
export const db = getFirestore(app);

/* ─── Analytics (safe init) ─── */
let analytics = null;

isSupported().then((yes) => {
    if (yes) {
        analytics = getAnalytics(app);
    }
});

export { app, analytics };