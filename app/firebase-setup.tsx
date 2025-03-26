"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { collection, addDoc, doc, setDoc } from "firebase/firestore"
import { useState } from "react"
import { db } from "@/lib/firebase"

// Sample restaurant data
const sampleRestaurant = {
  name: "Demo Restaurant",
  address: "123 Main St, Anytown, USA",
  phone: "555-123-4567",
  email: "info@demorestaurant.com",
}

// Sample menu items
const sampleMenuItems = [
  {
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, and special sauce",
    price: 12.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Burgers",
  },
  {
    name: "Veggie Burger",
    description: "Plant-based patty with avocado and vegan mayo",
    price: 13.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Burgers",
  },
  {
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomatoes, and basil on a thin crust",
    price: 14.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Pizza",
  },
  {
    name: "Pepperoni Pizza",
    description: "Classic pepperoni pizza with mozzarella cheese",
    price: 15.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Pizza",
  },
  {
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with Caesar dressing and croutons",
    price: 9.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Salads",
  },
  {
    name: "Greek Salad",
    description: "Fresh vegetables, feta cheese, and olives with vinaigrette",
    price: 10.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Salads",
  },
  {
    name: "Chicken Wings",
    description: "Spicy buffalo wings served with blue cheese dip",
    price: 11.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Appetizers",
  },
  {
    name: "Mozzarella Sticks",
    description: "Breaded and fried mozzarella with marinara sauce",
    price: 8.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Appetizers",
  },
  {
    name: "Chocolate Brownie",
    description: "Warm chocolate brownie with vanilla ice cream",
    price: 7.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Desserts",
  },
  {
    name: "Cheesecake",
    description: "New York style cheesecake with berry compote",
    price: 8.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Desserts",
  },
]

export default function FirebaseSetup() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const setupFirestore = async () => {
    try {
      setLoading(true)
      setResult(null)

      // Create restaurant document
      const restaurantId = "demo-restaurant"
      await setDoc(doc(db, "restaurants", restaurantId), sampleRestaurant)

      // Add menu items to restaurant
      for (const item of sampleMenuItems) {
        await addDoc(collection(db, "restaurants", restaurantId, "menu"), item)
      }

      setResult({
        success: true,
        message: "Firebase Firestore setup completed successfully!",
      })
    } catch (error) {
      console.error("Error setting up Firestore:", error)
      setResult({
        success: false,
        message: `Error setting up Firestore: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>Firebase Firestore Setup</CardTitle>
          <CardDescription>
            Initialize your Firestore database with sample data for the QR food ordering system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="structure">
            <TabsList className="mb-4">
              <TabsTrigger value="structure">Data Structure</TabsTrigger>
              <TabsTrigger value="sample">Sample Data</TabsTrigger>
            </TabsList>
            <TabsContent value="structure">
              <div className="rounded-md bg-slate-50 p-4">
                <h3 className="mb-2 font-medium">Firestore Collections Structure</h3>
                <pre className="overflow-auto rounded-md bg-slate-100 p-4 text-sm">
                  {`restaurants/
  {restaurantId}/
    name: string
    address: string
    phone: string
    email: string
    
    menu/
      {menuItemId}/
        name: string
        description: string
        price: number
        image: string
        category: string

orders/
  {orderId}/
    items: array
      id: string
      name: string
      price: number
      quantity: number
    totalPrice: number
    tableNumber: string
    status: string (Pending, Preparing, Ready for Delivery, Delivered)
    createdAt: timestamp
    updatedAt: timestamp`}
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="sample">
              <div className="rounded-md bg-slate-50 p-4">
                <h3 className="mb-2 font-medium">Sample Restaurant</h3>
                <pre className="mb-4 overflow-auto rounded-md bg-slate-100 p-4 text-sm">
                  {JSON.stringify(sampleRestaurant, null, 2)}
                </pre>

                <h3 className="mb-2 font-medium">Sample Menu Items (First 2)</h3>
                <pre className="overflow-auto rounded-md bg-slate-100 p-4 text-sm">
                  {JSON.stringify(sampleMenuItems.slice(0, 2), null, 2)}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button onClick={setupFirestore} disabled={loading} className="w-full">
            {loading ? "Setting up..." : "Initialize Firestore with Sample Data"}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <div
          className={`mt-4 rounded-md p-4 ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
        >
          {result.message}
        </div>
      )}
    </div>
  )
}

