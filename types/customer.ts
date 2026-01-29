export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  createdAt: string
  orderCount?: number
  totalSpent?: number
}