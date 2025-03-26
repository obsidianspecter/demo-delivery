"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, MapPin, Navigation, Clock, CheckCircle2, Utensils, Table } from "lucide-react"
import type { Order } from "@/lib/sample-data"

interface DeliveryBotTrackerProps {
  order: Order
  restaurantCoords: { lat: number; lng: number }
  tableCoords: { lat: number; lng: number }
}

export default function DeliveryBotTracker({ order, restaurantCoords, tableCoords }: DeliveryBotTrackerProps) {
  const [botPosition, setBotPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [deliveryProgress, setDeliveryProgress] = useState(0)
  const [deliveryStatus, setDeliveryStatus] = useState<
    "Preparing" | "Bot Loading" | "On the Way" | "Arriving" | "Delivered"
  >("Preparing")
  const [estimatedTime, setEstimatedTime] = useState<number>(5) // minutes

  // Simulate bot movement
  useEffect(() => {
    if (order.status !== "Ready for Delivery" && order.status !== "Delivered") {
      return
    }

    // Start delivery simulation when order is ready
    if (order.status === "Ready for Delivery") {
      // Initial state - bot at kitchen
      setBotPosition({ x: 10, y: 50 })
      setDeliveryStatus("Bot Loading")
      setDeliveryProgress(10)

      // Bot loading food
      const loadingTimeout = setTimeout(() => {
        setDeliveryStatus("On the Way")
        setDeliveryProgress(30)

        // Simulate bot movement
        const movementInterval = setInterval(() => {
          setBotPosition((prev) => {
            // Move towards table (right side of map)
            const newX = prev.x + 2
            // Add some vertical movement to make it look more natural
            const newY = 50 + Math.sin(newX / 5) * 10

            // Update progress based on position
            const progress = Math.min(90, 30 + (newX / 80) * 60)
            setDeliveryProgress(progress)

            // Update status when close to destination
            if (newX > 60 && deliveryStatus !== "Arriving") {
              setDeliveryStatus("Arriving")
              setEstimatedTime(1)
            }

            // Stop when reached destination
            if (newX >= 80) {
              clearInterval(movementInterval)
              setDeliveryStatus("Delivered")
              setDeliveryProgress(100)
              setEstimatedTime(0)
              return { x: 80, y: 50 }
            }

            // Update estimated time
            setEstimatedTime(Math.max(1, 5 - Math.floor((newX / 80) * 5)))

            return { x: newX, y: newY }
          })
        }, 500)

        return () => clearInterval(movementInterval)
      }, 3000)

      return () => clearTimeout(loadingTimeout)
    }
  }, [order.status, deliveryStatus])

  // Get status color
  const getStatusColor = () => {
    switch (deliveryStatus) {
      case "Preparing":
        return "bg-amber-100 text-amber-800"
      case "Bot Loading":
        return "bg-blue-100 text-blue-800"
      case "On the Way":
        return "bg-indigo-100 text-indigo-800"
      case "Arriving":
        return "bg-green-100 text-green-800"
      case "Delivered":
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Delivery Bot Tracker
          </CardTitle>
          <Badge className={getStatusColor()}>{deliveryStatus}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Map visualization */}
        <div className="relative h-48 mb-4 rounded-lg bg-slate-100 overflow-hidden">
          {/* Restaurant position */}
          <div className="absolute left-[10%] top-[50%] transform -translate-y-1/2">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Utensils className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs font-medium mt-1">Kitchen</span>
            </motion.div>
          </div>

          {/* Table position */}
          <div className="absolute right-[10%] top-[50%] transform -translate-y-1/2">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center">
                <Table className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs font-medium mt-1">Table {order.tableNumber.split("-")[1]}</span>
            </motion.div>
          </div>

          {/* Path line */}
          <div className="absolute left-[10%] right-[10%] top-[50%] h-0.5 bg-slate-200"></div>

          {/* Bot position */}
          <motion.div
            className="absolute top-0 left-0"
            style={{
              left: `${botPosition.x}%`,
              top: `${botPosition.y}%`,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-md"
              animate={{
                y: [0, -5, 0],
                rotate: botPosition.x > 10 ? [0, 5, 0, -5, 0] : 0,
              }}
              transition={{
                y: { repeat: Number.POSITIVE_INFINITY, duration: 1.5 },
                rotate: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
              }}
            >
              <Bot className="h-5 w-5 text-white" />
            </motion.div>
          </motion.div>
        </div>

        {/* Delivery progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Delivery Progress</span>
            <span className="font-medium">{deliveryProgress.toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${deliveryProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Delivery info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-sm font-medium mb-1">
              <Clock className="h-4 w-4 text-primary" />
              Estimated Time
            </div>
            <div className="text-lg font-bold">{estimatedTime > 0 ? `${estimatedTime} min` : "Arrived"}</div>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-sm font-medium mb-1">
              <Navigation className="h-4 w-4 text-primary" />
              Order Status
            </div>
            <div className="text-lg font-bold truncate">{order.status}</div>
          </div>
        </div>

        {/* Delivery steps */}
        <div className="mt-4 space-y-2">
          <DeliveryStep
            icon={<Utensils className="h-4 w-4" />}
            label="Food prepared"
            isCompleted={deliveryProgress >= 10}
            isActive={deliveryProgress < 10}
          />
          <DeliveryStep
            icon={<Bot className="h-4 w-4" />}
            label="Bot loading food"
            isCompleted={deliveryProgress >= 30}
            isActive={deliveryProgress >= 10 && deliveryProgress < 30}
          />
          <DeliveryStep
            icon={<Navigation className="h-4 w-4" />}
            label="Bot on the way"
            isCompleted={deliveryProgress >= 90}
            isActive={deliveryProgress >= 30 && deliveryProgress < 90}
          />
          <DeliveryStep
            icon={<MapPin className="h-4 w-4" />}
            label="Arriving at your table"
            isCompleted={deliveryProgress >= 100}
            isActive={deliveryProgress >= 90 && deliveryProgress < 100}
          />
          <DeliveryStep
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Food delivered"
            isCompleted={deliveryProgress >= 100}
            isActive={false}
          />
        </div>
      </CardContent>
    </Card>
  )
}

interface DeliveryStepProps {
  icon: React.ReactNode
  label: string
  isCompleted: boolean
  isActive: boolean
}

function DeliveryStep({ icon, label, isCompleted, isActive }: DeliveryStepProps) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          isActive
            ? "bg-primary text-white"
            : isCompleted
              ? "bg-green-100 text-green-600"
              : "bg-slate-100 text-slate-400"
        }`}
        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
      >
        {icon}
      </motion.div>
      <span
        className={`text-sm ${
          isActive ? "font-medium text-primary" : isCompleted ? "font-medium text-slate-900" : "text-slate-400"
        }`}
      >
        {label}
      </span>
      {isCompleted && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </motion.div>
      )}
    </div>
  )
}

