// firebase.js (Combined for both frontend and backend)

require('dotenv').config(); // Load environment variables from .env

// Firebase Admin SDK for Backend (Server-side)
const admin = require("firebase-admin");

// Firebase SDK for Frontend (Client-side)
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

// Initialize Firebase Admin SDK (for backend)
if (admin.apps.length === 0) {
  const serviceAccount = require('./config/catalyst-1d0af-firebase.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Firebase storage bucket
  });
}

const bucket = admin.storage().bucket(); // Firebase Storage Bucket for backend

// Initialize Firebase SDK for frontend (client-side)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase (frontend)
const app = initializeApp(firebaseConfig);
const storage = getStorage(app); // Firebase Storage for frontend

module.exports = { bucket, admin, storage };
