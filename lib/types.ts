export interface Order {
  id: string;
  status: "Pending" | "Preparing" | "Ready for Delivery" | "Delivered";
  createdAt: Date;
  tableNumber: string;
  items: OrderItem[];
  total: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
} 