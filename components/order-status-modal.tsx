"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, CookingPot, Bot, Table, Users, Receipt } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { scaleUp, progressBar } from "@/lib/animation-variants"
import type { Order } from "@/lib/sample-data"
import DeliveryBotTracker from "./delivery-bot-tracker"
import { useOrderDelivery } from "@/hooks/useOrderDelivery"
import OrderBill from "./order-bill"

interface OrderStatusModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | undefined
  onTableChange?: (tableNumber: string) => void
}

// Available tables in the restaurant
const AVAILABLE_TABLES = [
  { id: "Table-1", capacity: 4, key: "t1" },
  { id: "Table-2", capacity: 6, key: "t2" },
  { id: "Table-3", capacity: 4, key: "t3" },
  { id: "Table-4", capacity: 8, key: "t4" },
  { id: "Table-5", capacity: 4, key: "t5" },
  { id: "Table-6", capacity: 6, key: "t6" },
  { id: "Table-7", capacity: 4, key: "t7" },
  { id: "Table-8", capacity: 8, key: "t8" },
  { id: "Table-9", capacity: 4, key: "t9" },
  { id: "Table-10", capacity: 6, key: "t10" },
]

export default function OrderStatusModal({ isOpen, onClose, order, onTableChange }: OrderStatusModalProps) {
  const [progress, setProgress] = useState(0)
  const [showBotTracker, setShowBotTracker] = useState(false)
  const [showTableDialog, setShowTableDialog] = useState(false)
  const [showBillDialog, setShowBillDialog] = useState(false)
  const deliveryStatus = useOrderDelivery(order)

  useEffect(() => {
    if (!order) return

    switch (deliveryStatus || order.status) {
      case "Pending":
        setProgress(25)
        setShowBotTracker(false)
        break
      case "Preparing":
        setProgress(50)
        setShowBotTracker(false)
        break
      case "Ready for Delivery":
        setProgress(75)
        setShowBotTracker(true)
        break
      case "Delivered":
        setProgress(100)
        setShowBotTracker(false)
        break
    }
  }, [order, deliveryStatus])

  if (!order) return null

  const handleTableChange = (newTable: string) => {
    onTableChange?.(newTable)
    setShowTableDialog(false)
  }

  // Generate a unique key for the status
  const statusKey = `${order.id}-${deliveryStatus || order.status}`

  // Safely format the date
  const formatOrderTime = (date: Date) => {
    try {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "N/A"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl gradient-text">Order Status</DialogTitle>
              <DialogDescription>Track your order progress and delivery status</DialogDescription>
            </DialogHeader>

            <motion.div initial="hidden" animate="visible" exit="exit" variants={scaleUp}>
              <div className="py-4">
                <motion.div
                  className="mb-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Order #{order.id.slice(-4)}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => setShowBillDialog(true)}
                      >
                        <Receipt className="mr-2 h-4 w-4" />
                        View Bill
                      </Button>
                      <span className="text-sm text-slate-500">
                        {formatOrderTime(order.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Table className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-500">{order.tableNumber}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => setShowTableDialog(true)}
                    >
                      Change Table
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Order Progress</span>
                    <motion.span
                      className="font-medium text-primary"
                      key={statusKey}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {deliveryStatus || order.status}
                    </motion.span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      initial="hidden"
                      animate="visible"
                      variants={progressBar(progress)}
                    />
                  </div>
                </motion.div>

                {showBotTracker ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <DeliveryBotTracker
                      order={order}
                      restaurantCoords={{ lat: 37.7749, lng: -122.4194 }}
                      tableCoords={{ lat: 37.7749, lng: -122.4184 }}
                    />
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <StatusStep
                      icon={<Clock className="h-5 w-5" />}
                      title="Order Received"
                      description="Your order has been received by the kitchen"
                      isCompleted={progress >= 25}
                      isActive={progress === 25}
                      delay={0.3}
                    />

                    <StatusStep
                      icon={<CookingPot className="h-5 w-5" />}
                      title="Preparing"
                      description="The kitchen is preparing your food"
                      isCompleted={progress >= 50}
                      isActive={progress === 50}
                      delay={0.4}
                    />

                    <StatusStep
                      icon={<Bot className="h-5 w-5" />}
                      title="Ready for Delivery"
                      description="Your food is ready and our delivery bot is on the way"
                      isCompleted={progress >= 75}
                      isActive={progress === 75}
                      delay={0.5}
                    />

                    <StatusStep
                      icon={<CheckCircle className="h-5 w-5" />}
                      title="Delivered"
                      description="Enjoy your meal!"
                      isCompleted={progress >= 100}
                      isActive={progress === 100}
                      delay={0.6}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}

      {/* Table Selection Dialog */}
      <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Your Table</DialogTitle>
            <DialogDescription>Choose a table for your order</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {AVAILABLE_TABLES.map((table) => (
              <Button
                key={table.key}
                variant={order.tableNumber === table.id ? "default" : "outline"}
                className="h-16 flex flex-col items-center justify-center gap-2"
                onClick={() => handleTableChange(table.id)}
              >
                <span className="font-medium">{table.id}</span>
                <div className="flex items-center text-xs text-slate-500">
                  <Users className="mr-1 h-3 w-3" />
                  Up to {table.capacity} people
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bill Dialog */}
      {order && (
        <OrderBill
          isOpen={showBillDialog}
          onClose={() => setShowBillDialog(false)}
          order={order}
        />
      )}
    </AnimatePresence>
  )
}

interface StatusStepProps {
  icon: React.ReactNode
  title: string
  description: string
  isCompleted: boolean
  isActive: boolean
  delay: number
}

function StatusStep({ icon, title, description, isCompleted, isActive, delay }: StatusStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`flex items-start gap-3 rounded-lg p-3 ${
        isActive ? "bg-primary/10" : isCompleted ? "bg-slate-100" : "bg-slate-50"
      }`}
    >
      <div
        className={`mt-1 rounded-full p-1 ${
          isActive ? "bg-primary text-white" : isCompleted ? "bg-slate-400 text-white" : "bg-slate-200"
        }`}
      >
        {icon}
      </div>
      <div>
        <h4 className={`font-medium ${isActive ? "text-primary" : isCompleted ? "text-slate-700" : "text-slate-500"}`}>
          {title}
        </h4>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </motion.div>
  )
}

