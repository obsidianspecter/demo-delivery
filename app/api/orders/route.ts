import { NextResponse } from "next/server"
// import admin from "firebase-admin"
// import { cert } from "firebase-admin/app"
import { sampleOrders } from "@/lib/sample-data"

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

export async function POST(request: Request) {
  try {
    const orderData = await request.json()

    // Validate order data
    if (!orderData.items || !orderData.totalPrice) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 })
    }

    // If Firebase is not initialized, use sample data
    // if (!app) {
    //   console.log("Using sample data for order creation")
    //   const newOrder = {
    //     id: `order-${sampleOrders.length + 1}`,
    //     ...orderData,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   }
    //   sampleOrders.push(newOrder)
    //   return NextResponse.json({
    //     message: "Order placed successfully",
    //     orderId: newOrder.id,
    //   })
    // }

    // If Firebase is initialized, add to Firestore
    // const db = admin.firestore()
    // const orderRef = await db.collection("orders").add({
    //   ...orderData,
    //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
    // })

    // Always use sample data for now
    const newOrder = {
      id: `order-${sampleOrders.length + 1}`,
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    sampleOrders.push(newOrder)
    return NextResponse.json({
      message: "Order placed successfully",
      orderId: newOrder.id,
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

    // If Firebase is not initialized, use sample data
    // if (!app) {
    //   console.log("Using sample data for order fetch")
    //   const order = sampleOrders.find((order) => order.id === orderId)
    //   if (!order) {
    //     return NextResponse.json({ error: "Order not found" }, { status: 404 })
    //   }
    //   return NextResponse.json({ order })
    // }

    // If Firebase is initialized, fetch from Firestore
    // const db = admin.firestore()
    // const orderDoc = await db.collection("orders").doc(orderId).get()

    // if (!orderDoc.exists) {
    //   return NextResponse.json({ error: "Order not found" }, { status: 404 })
    // }

    // return NextResponse.json({
    //   order: {
    //     id: orderDoc.id,
    //     ...orderDoc.data(),
    //   },
    // })

    // Always use sample data for now
    const order = sampleOrders.find((order) => order.id === orderId)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

