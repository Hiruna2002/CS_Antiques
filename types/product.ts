export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  condition: string
  imageUrl?: string
  createdAt: string
  userId: string
}