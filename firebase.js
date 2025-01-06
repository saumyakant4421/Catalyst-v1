
require('dotenv').config(); // Load environment variables from .env

// Firebase Admin SDK for Backend (Server-side)
const admin = require("firebase-admin");

// Firebase SDK for Frontend (Client-side)
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

// Initialize Firebase Admin SDK (for backend)
if (admin.apps.length === 0) {
  const serviceAccount = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), 
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
  };
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, 
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
const storage = getStorage(app); 

module.exports = { bucket, admin, storage };
