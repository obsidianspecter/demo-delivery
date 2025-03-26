import { NextResponse } from "next/server"
import admin from "firebase-admin"
import { cert } from "firebase-admin/app"

// Initialize Firebase Admin if not already initialized
let app
if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: cert({
      projectId: "food-ordering-system-85a75",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

const db = admin.firestore()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 })
    }

    const menuCollection = db.collection("restaurants").doc(restaurantId).collection("menu")
    const menuSnapshot = await menuCollection.get()

    const menuItems = menuSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ menu: menuItems })
  } catch (error) {
    console.error("Error fetching menu:", error)
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 })
  }
}

