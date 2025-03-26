import { NextResponse } from "next/server"
import admin from "firebase-admin"
import { cert } from "firebase-admin/app"
import { sampleOrders } from "@/lib/sample-data"

// Initialize Firebase Admin if not already initialized and credentials are available
let app
if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID) {
      app = admin.initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      })
    }
  } catch (error) {
    console.warn("Firebase admin initialization error:", error)
  }
}

export async function PATCH(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const { status } = await request.json()
    const { orderId } = params

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // If Firebase is not initialized, update sample data
    if (!app) {
      console.log("Using sample data for order status update")
      const orderIndex = sampleOrders.findIndex((order) => order.id === orderId)
      if (orderIndex === -1) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }
      sampleOrders[orderIndex] = {
        ...sampleOrders[orderIndex],
        status,
        updatedAt: new Date(),
      }
      return NextResponse.json({
        message: "Order status updated successfully",
      })
    }

    // If Firebase is initialized, update in Firestore
    const db = admin.firestore()
    await db.collection("orders").doc(orderId).update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    return NextResponse.json({
      message: "Order status updated successfully",
    })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}

