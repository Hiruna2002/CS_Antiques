export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'other'
  paymentStatus: 'pending' | 'paid' | 'failed'
  shippingAddress?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderSummary {
  id: string
  orderNumber: string
  customerName: string
  totalAmount: number
  status: 'pending' | 'completed' | 'cancelled' // For filter purposes
  createdAt: string
}