// import { addDoc, serverTimestamp, collection } from "firebase/firestore"
// import { getCurrentUser } from "./authService"
// import { Product } from "@/types/product"
// import { db } from "@/services/firebase"

import { doc, orderBy, query, setDoc, where, collection, getDocs } from "firebase/firestore";
import { db, getAuthInstance } from "./firebase";

// const cartsCollection = collection(db, "carts")

// export const saveCartItems = async (cart: Omit<Product, 'id' | 'createdAt' | 'userId'>) => {
//   const user = getCurrentUser()
//   if (!user) throw new Error('User not authenticated.')

//   await addDoc(cartsCollection, {
//     ...cart,
//     userId: user.uid,
//     createdAt: serverTimestamp()
//   })
// }

const CLOUD_NAME = 'dod3xppgl';
const UPLOAD_PRESET = 'cs_antiques';

export interface CartItem {
    userId: string;
    productId: string;
    name: string;
    category: string;
    description: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

const getCurrentUser = () => {
    const auth = getAuthInstance();
    return auth.currentUser;
}

export const addToCart = async (
    productId: string,
    name: string,
    category: string,
    description: string,
    price: number,
    quantity: number,
    imageUrl: string | undefined
) => {
    try {
        const cartItem: CartItem = {
            userId: getCurrentUser()?.uid,
            productId,
            name,
            category,
            description,
            price,
            quantity,
            imageUrl,
        }

        await setDoc(doc(db, "carts", `${productId}_${Date.now()}`), cartItem)
    } catch (error) {}
}

export const getCartItems = async () => {
    const user = getCurrentUser()
    console.log("getCartItems - currentUser:", user?.uid ?? user);
    if (!user) throw new Error('User not authenticated.')
    
    const q = query(
        collection(db, "carts"),
        where('userId', '==', user.uid)
    )
    
    const snapshot = await getDocs(q)

    // const cartColRef = collection(db, "users", user.uid, "cart");
    // const snapshot = await getDocs(cartColRef);

    return snapshot.docs.map(docSnap => {
        const data = docSnap.data()
        console.log("Cart Item Data:", data)
        return {
            id: docSnap.id,
            productId: (data.productId as string) || '',
            name: (data.name as string) || '',
            category: (data.category as string) || '',
            description: (data.description as string) || '',
            price: (data.price as number) || 0,
            quantity: (data.quantity as number) || 1,
            imageUrl: (data.imageUrl as string) || undefined,
        }
    })
}