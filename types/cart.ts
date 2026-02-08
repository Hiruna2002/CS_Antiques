export interface Carts {
  id: string;
  productId: string;
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}