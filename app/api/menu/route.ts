import { NextResponse } from "next/server"
// import admin from "firebase-admin"
// import { cert } from "firebase-admin/app"
import { sampleMenuItems } from "@/lib/sample-data"

// Initialize Firebase Admin if not already initialized and credentials are available
// let app
// if (!admin.apps.length) {
//   try {
//     if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID) {
//       app = admin.initializeApp({
//         credential: cert({
//           projectId: process.env.FIREBASE_PROJECT_ID,
//           clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//           privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//         }),
//       })
//     }
//   } catch (error) {
//     console.warn("Firebase admin initialization error:", error)
//   }
// }

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 })
    }

    // If Firebase is not initialized, return sample data
    // if (!app) {
    //   console.log("Using sample menu data")
    //   return NextResponse.json({ menu: sampleMenuItems })
    // }

    // If Firebase is initialized, fetch from Firestore
    // const db = admin.firestore()
    // const menuCollection = db.collection("restaurants").doc(restaurantId).collection("menu")
    // const menuSnapshot = await menuCollection.get()

    // const menuItems = menuSnapshot.docs.map((doc) => ({
    //   id: doc.id,
    //   ...doc.data(),
    // }))

    // return NextResponse.json({ menu: menuItems })
    
    // Always return sample data for now
    return NextResponse.json({ menu: sampleMenuItems })
  } catch (error) {
    console.error("Error fetching menu:", error)
    // Return sample data as fallback in case of any error
    return NextResponse.json({ menu: sampleMenuItems })
  }
}

