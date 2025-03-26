"use client"

import { useState, useEffect } from "react"
import type { Order, CartItem } from "@/lib/sample-data"

// In-memory storage for orders
let orders: Order[] = []

// Event listeners for order updates
const listeners: ((orders: Order[]) => void)[] = []

// Notify all listeners when orders change
const notifyListeners = () => {
  listeners.forEach((listener) => listener([...orders]))
}

// Add a new order
export const addOrder = (items: CartItem[], totalPrice: number, tableNumber: string): Order => {
  const newOrder: Order = {
    id: `order-${Date.now()}`,
    items,
    totalPrice,
    status: "Pending",
    tableNumber,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  orders = [...orders, newOrder]
  notifyListeners()

  // Simulate order status updates
  setTimeout(() => {
    updateOrderStatus(newOrder.id, "Preparing")
  }, 5000)

  setTimeout(() => {
    updateOrderStatus(newOrder.id, "Ready for Delivery")
  }, 10000)

  return newOrder
}

// Update order status
export const updateOrderStatus = (orderId: string, status: Order["status"]): boolean => {
  const orderIndex = orders.findIndex((order) => order.id === orderId)

  if (orderIndex === -1) {
    return false
  }

  orders = orders.map((order) => 
    order.id === orderId 
      ? { 
          ...order, 
          status, 
          updatedAt: new Date(),
          // Ensure createdAt is a Date object
          createdAt: order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt)
        } 
      : order
  )

  notifyListeners()
  return true
}

// Get a specific order
export const getOrder = (orderId: string): Order | undefined => {
  const order = orders.find((order) => order.id === orderId)
  if (!order) return undefined

  // Ensure dates are Date objects
  return {
    ...order,
    createdAt: order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt),
    updatedAt: order.updatedAt ? (order.updatedAt instanceof Date ? order.updatedAt : new Date(order.updatedAt)) : undefined
  }
}

// Custom hook to subscribe to order updates
export const useOrders = () => {
  const [currentOrders, setCurrentOrders] = useState<Order[]>(orders.map(order => ({
    ...order,
    createdAt: order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt),
    updatedAt: order.updatedAt ? (order.updatedAt instanceof Date ? order.updatedAt : new Date(order.updatedAt)) : undefined
  })))

  useEffect(() => {
    const handleOrdersUpdate = (updatedOrders: Order[]) => {
      setCurrentOrders(updatedOrders.map(order => ({
        ...order,
        createdAt: order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt),
        updatedAt: order.updatedAt ? (order.updatedAt instanceof Date ? order.updatedAt : new Date(order.updatedAt)) : undefined
      })))
    }

    listeners.push(handleOrdersUpdate)

    return () => {
      const index = listeners.indexOf(handleOrdersUpdate)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return currentOrders
}

// Custom hook to subscribe to a specific order
export const useOrder = (orderId: string | undefined) => {
  const [order, setOrder] = useState<Order | undefined>(orderId ? getOrder(orderId) : undefined)

  useEffect(() => {
    if (!orderId) return

    const handleOrdersUpdate = (updatedOrders: Order[]) => {
      const updatedOrder = updatedOrders.find((o) => o.id === orderId)
      if (updatedOrder) {
        setOrder({
          ...updatedOrder,
          createdAt: updatedOrder.createdAt instanceof Date ? updatedOrder.createdAt : new Date(updatedOrder.createdAt),
          updatedAt: updatedOrder.updatedAt ? (updatedOrder.updatedAt instanceof Date ? updatedOrder.updatedAt : new Date(updatedOrder.updatedAt)) : undefined
        })
      }
    }

    listeners.push(handleOrdersUpdate)

    return () => {
      const index = listeners.indexOf(handleOrdersUpdate)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
    }
  }, [orderId])

  return order
}

export function updateOrderTable(orderId: string, tableNumber: string) {
  const orderIndex = orders.findIndex((order) => order.id === orderId)
  if (orderIndex === -1) return

  orders[orderIndex] = {
    ...orders[orderIndex],
    tableNumber,
    updatedAt: new Date(),
    createdAt: orders[orderIndex].createdAt instanceof Date ? orders[orderIndex].createdAt : new Date(orders[orderIndex].createdAt)
  }
}

