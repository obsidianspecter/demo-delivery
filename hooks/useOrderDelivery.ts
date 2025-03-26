import { useEffect, useState } from 'react';
import { Order } from '@/lib/types';

const DELIVERY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useOrderDelivery(order: Order) {
  const [deliveryStatus, setDeliveryStatus] = useState<Order['status']>(order.status);

  useEffect(() => {
    if (order.status === 'Ready for Delivery') {
      const timer = setTimeout(() => {
        setDeliveryStatus('Delivered');
        // Here you would typically also update the order in your database
        // updateOrderStatus(order.id, 'Delivered');
      }, DELIVERY_TIME);

      return () => clearTimeout(timer);
    }
  }, [order.status, order.id]);

  return deliveryStatus;
} 