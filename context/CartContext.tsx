// import React, { createContext, useState, ReactNode, useContext } from "react"
// import { Product } from "@/types/product"

// interface CartItem {
//   product: Product
//   quantity: number
// }

// interface CartContextType {
//   cartItems: CartItem[]
//   addToCart: (product: Product, quantity?: number) => void
//   removeFromCart: (productId: string) => void
//   updateQuantity: (productId: string, quantity: number) => void
//   clearCart: () => void
//   getTotalItems: () => number
//   getTotalPrice: () => number
// }

// export const CartContext = createContext<CartContextType>({
//   cartItems: [],
//   addToCart: () => {},
//   removeFromCart: () => {},
//   updateQuantity: () => {},
//   clearCart: () => {},
//   getTotalItems: () => 0,
//   getTotalPrice: () => 0
// })

// export const CartProvider = ({ children }: { children: ReactNode }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([])

//   const addToCart = (product: Product, quantity: number = 1) => {
//     setCartItems((prevItems) => {
//       const existingItem = prevItems.find(item => item.product.id === product.id)
      
//       if (existingItem) {
//         return prevItems.map(item =>
//           item.product.id === product.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         )
//       } else {
//         return [...prevItems, { product, quantity }]
//       }
//     })
//   }

//   const removeFromCart = (productId: string) => {
//     setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId))
//   }

//   const updateQuantity = (productId: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeFromCart(productId)
//       return
//     }
    
//     setCartItems(prevItems =>
//       prevItems.map(item =>
//         item.product.id === productId ? { ...item, quantity } : item
//       )
//     )
//   }

//   const clearCart = () => {
//     setCartItems([])
//   }

//   const getTotalItems = () => {
//     return cartItems.reduce((total, item) => total + item.quantity, 0)
//   }

//   const getTotalPrice = () => {
//     return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
//   }

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         getTotalItems,
//         getTotalPrice
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   )
// }

// export const useCart = () => {
//   const context = useContext(CartContext)
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider")
//   }
//   return context
// }




// src/context/CartContext.tsx
import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { Product } from "@/types/product";
import { Alert } from "react-native";
import { db, getAuthInstance } from "@/services/firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData
} from "firebase/firestore";
import { onAuthStateChanged, type User } from "firebase/auth";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  imageUrl?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  loading: boolean;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  getTotalItems: () => 0,
  getTotalPrice: () => 0,
  loading: true,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const auth = getAuthInstance();
  //   let unsubscribeCart: (() => void) | null = null;

    // listen for auth state changes to subscribe/unsubscribe to user cart
    // const unsubAuth = onAuthStateChanged(auth, (user) => {
    //   // clear previous subscription
    //   if (unsubscribeCart) {
    //     unsubscribeCart();
    //     unsubscribeCart = null;
    //   }

    //   if (!user) {
    //     // no user -> clear local cart
    //     setCartItems([]);
    //     setLoading(false);
    //     return;
    //   }

    //   // user logged in -> subscribe to user's cart collection
    //   const cartColRef = collection(db, "users", user.uid, "cart");

    //   unsubscribeCart = onSnapshot(
    //     cartColRef,
    //     (snapshot) => {
    //       const items: CartItem[] = snapshot.docs.map((docSnap: QueryDocumentSnapshot<DocumentData>) => {
    //         const d = docSnap.data();
    //         // stored shape: { product: {...}, quantity: number, createdAt, updatedAt }
    //         return {
    //           product: d.product as Product,
    //           quantity: Number(d.quantity ?? 0),
    //         };
    //       });
    //       setCartItems(items);
    //       setLoading(false);
    //     },
    //     (err) => {
    //       console.warn("Cart snapshot error:", err);
    //       setLoading(false);
    //     }
    //   );
    // });

  //   return () => {
  //     // cleanup
  //     if (unsubscribeCart) unsubscribeCart();
  //     unsubAuth();
  //   };
  // }, []);

  const getUser = (): User | null => {
    const auth = getAuthInstance();
    return auth.currentUser;
  };

  // const addToCart = async (product: Product, quantity = 1) => {
  //   const user = getUser();
  //   if (!user) {
  //     Alert.alert("Please login", "You must be logged in to add items to cart.");
  //     return;
  //   }

  //   try {
  //     const cartDocRef = doc(db, "users", user.uid, "cart", product.id);
  //     const snap = await getDoc(cartDocRef);

  //     if (snap.exists()) {
  //       // increase quantity (upsert)
  //       const existingQty = Number(snap.data().quantity ?? 0);
  //       await updateDoc(cartDocRef, {
  //         quantity: existingQty + quantity,
  //         updatedAt: serverTimestamp(),
  //       });
  //     } else {
  //       // create new cart item
  //       await setDoc(cartDocRef, {
  //         product: {
  //           id: product.id,
  //           name: product.name,
  //           description: product.description,
  //           price: Number(product.price ?? 0),
  //           stock: Number(product.stock ?? 0),
  //           category: product.category ?? "",
  //           condition: product.condition ?? "",
  //           imageUrl: product.imageUrl ?? "",
  //           createdAt: product.createdAt ?? "",
  //           userId: product.userId ?? ""
  //         },
  //         quantity,
  //         createdAt: serverTimestamp(),
  //         updatedAt: serverTimestamp(),
  //       });
  //     }
  //   } catch (error: any) {
  //     console.error("addToCart error:", error);
  //     Alert.alert("Error", "Failed to add item to cart.");
  //   }
  // };

  const addToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === newItem.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = async (productId: string) => {
    const user = getUser();
    if (!user) {
      Alert.alert("Please login", "You must be logged in to modify the cart.");
      return;
    }
    try {
      const cartDocRef = doc(db, "users", user.uid, "cart", productId);
      await deleteDoc(cartDocRef);
    } catch (error) {
      console.error("removeFromCart error:", error);
      Alert.alert("Error", "Failed to remove item from cart.");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const user = getUser();
    if (!user) {
      Alert.alert("Please login", "You must be logged in to modify the cart.");
      return;
    }
    try {
      const cartDocRef = doc(db, "users", user.uid, "cart", productId);
      if (quantity <= 0) {
        await deleteDoc(cartDocRef);
      } else {
        await updateDoc(cartDocRef, {
          quantity,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("updateQuantity error:", error);
      Alert.alert("Error", "Failed to update quantity.");
    }
  };

  const clearCart = async () => {
    const user = getUser();
    if (!user) {
      Alert.alert("Please login", "You must be logged in to clear the cart.");
      return;
    }
    try {
      const cartColRef = collection(db, "users", user.uid, "cart");
      const snapshot = await getDocs(cartColRef);
      const deletions = snapshot.docs.map((docSnap) => deleteDoc(doc(db, "users", user.uid, "cart", docSnap.id)));
      await Promise.all(deletions);
    } catch (error) {
      console.error("clearCart error:", error);
      Alert.alert("Error", "Failed to clear cart.");
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, it) => sum + it.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, it) => sum + (Number(it.price ?? 0) * it.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  console.log("useCart called", "CartContext:", CartContext);
  const context = useContext(CartContext);
  console.log("useCart called, context:", context);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  console.log("useCart context:", context);
  return context;
};






// import React, { createContext, useState, useEffect, useContext } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// type CartItem = {
//   id: string;
//   name: string;
//   price: number;
//   imageUrl: string;
//   qty: number;
// };

// type CartContextType = {
//   cart: CartItem[];
//   addToCart: (product: CartItem) => void;
//   increaseQty: (id: string) => void;
//   decreaseQty: (id: string) => void;
//   removeFromCart: (id: string) => void;
//   clearCart: () => void;
//   totalItems: number;
//   totalPrice: number;
// };

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const [cart, setCart] = useState<CartItem[]>([]);

//   useEffect(() => {
//     loadCart();
//   }, []);

//   const loadCart = async () => {
//     try {
//       const savedCart = await AsyncStorage.getItem('cart');
//       if (savedCart) {
//         setCart(JSON.parse(savedCart));
//       }
//     } catch (error) {
//       console.error('Failed to load cart', error);
//     }
//   };

//   const saveCart = async (newCart: CartItem[]) => {
//     try {
//       await AsyncStorage.setItem('cart', JSON.stringify(newCart));
//       setCart(newCart);
//     } catch (error) {
//       console.error('Failed to save cart', error);
//     }
//   };

//   const addToCart = (product: CartItem) => {
//     const existingItem = cart.find(item => item.id === product.id);
//     let newCart;
//     if (existingItem) {
//       newCart = cart.map(item =>
//         item.id === product.id ? { ...item, qty: item.qty + 1 } : item
//       );
//     } else {
//       newCart = [...cart, { ...product, qty: 1 }];
//     }
//     saveCart(newCart);
//   };

//   const increaseQty = (id: string) => {
//     const newCart = cart.map(item =>
//       item.id === id ? { ...item, qty: item.qty + 1 } : item
//     );
//     saveCart(newCart);
//   };

//   const decreaseQty = (id: string) => {
//     const newCart = cart.map(item =>
//       item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item
//     ).filter(item => item.qty > 0);
//     saveCart(newCart);
//   };

//   const removeFromCart = (id: string) => {
//     const newCart = cart.filter(item => item.id !== id);
//     saveCart(newCart);
//   };

//   const clearCart = () => {
//     saveCart([]);
//   };

//   const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
//   const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

//   return (
//     <CartContext.Provider value={{ cart, addToCart, increaseQty, decreaseQty, removeFromCart, clearCart, totalItems, totalPrice }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };
