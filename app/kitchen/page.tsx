"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { CookingPot, ClipboardList, CheckCircle, Clock } from "lucide-react"
import type { Order } from "@/lib/sample-data"
import { useOrders, updateOrderStatus } from "@/lib/order-service"
import { fadeIn, slideUp, staggerContainer } from "@/lib/animation-variants"

export default function KitchenPage() {
  const orders = useOrders()
  const [activeTab, setActiveTab] = useState("pending")

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    switch (activeTab) {
      case "pending":
        return order.status === "Pending"
      case "preparing":
        return order.status === "Preparing"
      case "ready":
        return order.status === "Ready for Delivery"
      case "delivered":
        return order.status === "Delivered"
      default:
        return true
    }
  })

  // Get status icon
  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "Preparing":
        return <CookingPot className="h-5 w-5 text-blue-500" />
      case "Ready for Delivery":
        return <ClipboardList className="h-5 w-5 text-green-500" />
      case "Delivered":
        return <CheckCircle className="h-5 w-5 text-slate-500" />
    }
  }

  // Get status color
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800"
      case "Preparing":
        return "bg-blue-100 text-blue-800"
      case "Ready for Delivery":
        return "bg-green-100 text-green-800"
      case "Delivered":
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-slate-50 p-4 kitchen-pattern-bg"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <motion.div className="container mx-auto" variants={slideUp}>
        <motion.div
          className="mb-6 flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
            whileHover={{ rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CookingPot className="h-6 w-6 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Kitchen Dashboard</h1>
            <p className="text-slate-500">Manage and update order statuses</p>
          </div>
        </motion.div>

        <Tabs defaultValue="pending" onValueChange={setActiveTab}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <TabsList className="mb-4 bg-white p-1">
              <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <motion.div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Pending</span>
                  {orders.filter((o) => o.status === "Pending").length > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <Badge variant="destructive" className="ml-1">
                        {orders.filter((o) => o.status === "Pending").length}
                      </Badge>
                    </motion.div>
                  )}
                </motion.div>
              </TabsTrigger>
              <TabsTrigger value="preparing" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <motion.div className="flex items-center gap-1">
                  <CookingPot className="h-4 w-4" />
                  <span>Preparing</span>
                  {orders.filter((o) => o.status === "Preparing").length > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <Badge className="ml-1 bg-blue-500">
                        {orders.filter((o) => o.status === "Preparing").length}
                      </Badge>
                    </motion.div>
                  )}
                </motion.div>
              </TabsTrigger>
              <TabsTrigger value="ready" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <motion.div className="flex items-center gap-1">
                  <ClipboardList className="h-4 w-4" />
                  <span>Ready</span>
                  {orders.filter((o) => o.status === "Ready for Delivery").length > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <Badge className="ml-1 bg-green-500">
                        {orders.filter((o) => o.status === "Ready for Delivery").length}
                      </Badge>
                    </motion.div>
                  )}
                </motion.div>
              </TabsTrigger>
              <TabsTrigger value="delivered" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <motion.div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Delivered</span>
                </motion.div>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <AnimatePresence mode="wait">
            <TabsContent value={activeTab} className="space-y-4">
              {filteredOrders.length === 0 ? (
                <motion.div
                  className="rounded-lg border border-dashed p-8 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  >
                    {activeTab === "pending" ? (
                      <Clock className="h-8 w-8 text-slate-400" />
                    ) : activeTab === "preparing" ? (
                      <CookingPot className="h-8 w-8 text-slate-400" />
                    ) : activeTab === "ready" ? (
                      <ClipboardList className="h-8 w-8 text-slate-400" />
                    ) : (
                      <CheckCircle className="h-8 w-8 text-slate-400" />
                    )}
                  </motion.div>
                  <h3 className="text-lg font-medium">No {activeTab} orders</h3>
                  <p className="text-sm text-slate-500">
                    {activeTab === "pending"
                      ? "When new orders come in, they will appear here."
                      : `There are no orders in the ${activeTab} state.`}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredOrders.map((order) => (
                    <motion.div key={order.id} variants={slideUp} layout>
                      <Card
                        className="overflow-hidden border-t-4 transition-all hover:shadow-md"
                        style={{
                          borderTopColor:
                            order.status === "Pending"
                              ? "#f59e0b"
                              : order.status === "Preparing"
                                ? "#3b82f6"
                                : order.status === "Ready for Delivery"
                                  ? "#10b981"
                                  : "#94a3b8",
                        }}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">Order #{order.id.slice(-4)}</CardTitle>
                              <p className="text-sm text-slate-500">
                                {order.tableNumber} •
                                {order.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400 }}>
                              <Badge className={getStatusColor(order.status)}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(order.status)}
                                  {order.status}
                                </span>
                              </Badge>
                            </motion.div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <motion.div
                            className="space-y-2"
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                          >
                            {order.items.map((item) => (
                              <motion.div
                                key={item.id}
                                className="flex justify-between rounded-md bg-slate-50 p-2 text-sm"
                                variants={slideUp}
                                whileHover={{ backgroundColor: "#f1f5f9" }}
                              >
                                <span className="font-medium">
                                  {item.quantity}x {item.name}
                                </span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </motion.div>
                            ))}
                          </motion.div>
                          <motion.div
                            className="mt-4 flex justify-between rounded-md bg-slate-100 p-2 font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <span>Total</span>
                            <span className="text-primary">${order.totalPrice.toFixed(2)}</span>
                          </motion.div>
                        </CardContent>
                        <CardFooter>
                          {order.status === "Pending" && (
                            <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                onClick={() => updateOrderStatus(order.id, "Preparing")}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
                              >
                                <CookingPot className="mr-2 h-4 w-4" />
                                Start Preparing
                              </Button>
                            </motion.div>
                          )}
                          {order.status === "Preparing" && (
                            <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                onClick={() => updateOrderStatus(order.id, "Ready for Delivery")}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600"
                              >
                                <ClipboardList className="mr-2 h-4 w-4" />
                                Mark as Ready
                              </Button>
                            </motion.div>
                          )}
                          {order.status === "Ready for Delivery" && (
                            <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button onClick={() => updateOrderStatus(order.id, "Delivered")} className="w-full">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Delivered
                              </Button>
                            </motion.div>
                          )}
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}

