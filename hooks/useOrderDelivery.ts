"use client"

import { useEffect, useState } from 'react';
import type { Order } from '@/lib/sample-data';

const DELIVERY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useOrderDelivery(order: Order | undefined) {
  const [deliveryStatus, setDeliveryStatus] = useState<Order['status'] | undefined>(order?.status);

  useEffect(() => {
    if (!order) return;

    // If order is already delivered, no need to update
    if (order.status === 'Delivered') {
      setDeliveryStatus('Delivered');
      return;
    }

    // If order is ready for delivery, start the delivery timer
    if (order.status === 'Ready for Delivery') {
      const timer = setTimeout(() => {
        setDeliveryStatus('Delivered');
        // Here you would typically also update the order in your database
        // updateOrderStatus(order.id, 'Delivered');
      }, DELIVERY_TIME);

      return () => clearTimeout(timer);
    }

    // For other statuses, just reflect the current status
    setDeliveryStatus(order.status);
  }, [order]);

  return deliveryStatus;
} 