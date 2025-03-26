import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getAnalytics, isSupported } from "firebase/analytics"

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyD7pcr-SCikqAnybK2ys3e2RSqfZfsL6Rk",
  authDomain: "food-ordering-system-85a75.firebaseapp.com",
  projectId: "food-ordering-system-85a75",
  storageBucket: "food-ordering-system-85a75.firebasestorage.app",
  messagingSenderId: "140522560106",
  appId: "1:140522560106:web:37f092bf4965553ffd4813",
  measurementId: "G-HZ1Q35X2C0",
}

// Initialize Firebase
let firebaseApp
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig)
} else {
  firebaseApp = getApps()[0]
}

// Initialize Firebase services
export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)

// Initialize Analytics conditionally (only in browser)
export const initializeAnalytics = async () => {
  if (typeof window !== "undefined") {
    try {
      const analyticsSupported = await isSupported()
      if (analyticsSupported) {
        return getAnalytics(firebaseApp)
      }
    } catch (error) {
      console.error("Analytics not supported:", error)
    }
  }
  return null
}

export default firebaseApp

