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

export async function POST(request: Request) {
  try {
    const orderData = await request.json()

    // Validate order data
    if (!orderData.items || !orderData.totalPrice) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 })
    }

    // Add order to Firestore
    const orderRef = await db.collection("orders").add({
      ...orderData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    return NextResponse.json({
      message: "Order placed successfully",
      orderId: orderRef.id,
    })
  } catch (error) {
    console.error("Error placing order:", error)
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const orderDoc = await db.collection("orders").doc(orderId).get()

    if (!orderDoc.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      order: {
        id: orderDoc.id,
        ...orderDoc.data(),
      },
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

