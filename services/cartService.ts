import { addDoc, serverTimestamp, collection } from "firebase/firestore"
import { getCurrentUser } from "./authService"
import { Product } from "@/types/product"
import { db } from "@/services/firebase"

const cartsCollection = collection(db, "carts")

export const saveCartItems = async (cart: Omit<Product, 'id' | 'createdAt' | 'userId'>) => {
  const user = getCurrentUser()
  if (!user) throw new Error('User not authenticated.')

  await addDoc(cartsCollection, {
    ...cart,
    userId: user.uid,
    createdAt: serverTimestamp()
  })
}