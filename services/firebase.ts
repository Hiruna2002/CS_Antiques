// firebaseConfig.ts
import AsyncStorage from "@react-native-async-storage/async-storage"
import { initializeApp, getApps } from "firebase/app"
//@ts-ignore
import { getReactNativePersistence, initializeAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChxz7nGYEUSIHnrMjN2Lw9q1mca-TI6d8",
  authDomain: "cs-antiques-38604.firebaseapp.com",
  projectId: "cs-antiques-38604",
  storageBucket: "cs-antiques-38604.firebasestorage.app",
  messagingSenderId: "746559199820",
  appId: "1:746559199820:web:ab930b36c26a8c3d8b72e9",
  measurementId: "G-M13EK45RCD",
}

//  Initialize app (singleton pattern)
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

//  Initialize Firestore & Storage
export const db = getFirestore(app)
export const storage = getStorage(app)

//  Initialize Auth with persistence (React Native requires AsyncStorage)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})

export const getAuthInstance = () => auth
