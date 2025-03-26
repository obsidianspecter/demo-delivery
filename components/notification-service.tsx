"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell } from "lucide-react"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, onSnapshot, query, where, orderBy, limit } from "firebase/firestore"

// Firebase configuration - replace with your own config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface NotificationSettings {
  newOrders: boolean
  statusUpdates: boolean
  completedOrders: boolean
  sound: boolean
}

export default function NotificationService() {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null)
  const [settings, setSettings] = useState<NotificationSettings>({
    newOrders: true,
    statusUpdates: true,
    completedOrders: true,
    sound: true,
  })

  useEffect(() => {
    // Check if browser supports notifications
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission)
    }

    // Listen for new orders
    if (settings.newOrders && notificationPermission === "granted") {
      const ordersCollection = collection(db, "orders")
      const newOrdersQuery = query(
        ordersCollection,
        where("status", "==", "Pending"),
        orderBy("createdAt", "desc"),
        limit(5),
      )

      const unsubscribe = onSnapshot(newOrdersQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const order = change.doc.data()
            showNotification(
              "New Order Received",
              `Order #${change.doc.id.slice(-4)} - Table ${order.tableNumber} - $${order.totalPrice.toFixed(2)}`,
            )
          }
        })
      })

      return () => unsubscribe()
    }
  }, [settings.newOrders, notificationPermission])

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
    }
  }

  const showNotification = (title: string, body: string) => {
    if (notificationPermission === "granted") {
      const notification = new Notification(title, {
        body,
        icon: "/favicon.ico",
      })

      if (settings.sound) {
        // Play notification sound
        const audio = new Audio("/notification-sound.mp3")
        audio.play().catch((e) => console.error("Error playing notification sound:", e))
      }

      notification.onclick = () => {
        window.focus()
        notification.close()
      }
    }
  }

  const toggleSetting = (setting: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  const testNotification = () => {
    showNotification("Test Notification", "This is a test notification from the QR Food Ordering System")
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure how you receive notifications about orders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationPermission !== "granted" ? (
            <div className="rounded-md bg-amber-50 p-4 text-amber-800">
              <h3 className="mb-2 font-medium">Notifications are not enabled</h3>
              <p className="mb-4 text-sm">
                Enable notifications to receive alerts about new orders and status updates.
              </p>
              <Button onClick={requestNotificationPermission}>Enable Notifications</Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="new-orders" className="flex flex-col space-y-1">
                  <span>New Orders</span>
                  <span className="text-xs text-slate-500">Receive notifications when new orders are placed</span>
                </Label>
                <Switch
                  id="new-orders"
                  checked={settings.newOrders}
                  onCheckedChange={() => toggleSetting("newOrders")}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="status-updates" className="flex flex-col space-y-1">
                  <span>Status Updates</span>
                  <span className="text-xs text-slate-500">Receive notifications when order status changes</span>
                </Label>
                <Switch
                  id="status-updates"
                  checked={settings.statusUpdates}
                  onCheckedChange={() => toggleSetting("statusUpdates")}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="completed-orders" className="flex flex-col space-y-1">
                  <span>Completed Orders</span>
                  <span className="text-xs text-slate-500">Receive notifications when orders are delivered</span>
                </Label>
                <Switch
                  id="completed-orders"
                  checked={settings.completedOrders}
                  onCheckedChange={() => toggleSetting("completedOrders")}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="sound" className="flex flex-col space-y-1">
                  <span>Notification Sound</span>
                  <span className="text-xs text-slate-500">Play a sound when notifications are received</span>
                </Label>
                <Switch id="sound" checked={settings.sound} onCheckedChange={() => toggleSetting("sound")} />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={testNotification}
            disabled={notificationPermission !== "granted"}
            variant="outline"
            className="w-full"
          >
            Test Notification
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

