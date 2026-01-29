// import { getAuth } from 'firebase/auth'
// import {
//   addDoc,
//   collection,
//   deleteDoc,
//   doc,
//   getDoc,
//   getDocs,
//   orderBy,
//   query,
//   updateDoc,
//   where,
//   serverTimestamp,
//   Timestamp
// } from 'firebase/firestore'
// import { db } from './firebase'

// const auth = getAuth()
// const ordersCollection = collection(db, 'orders')
// const customersCollection = collection(db, 'customers')

// export interface OrderItem {
//   productId: string
//   productName: string
//   quantity: number
//   price: number
//   total: number
// }

// export interface Order {
//   id: string
//   orderNumber: string
//   customerId: string
//   customerName: string
//   customerEmail: string
//   customerPhone: string
//   items: OrderItem[]
//   subtotal: number
//   tax: number
//   shipping: number
//   totalAmount: number
//   status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
//   paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'other'
//   paymentStatus: 'pending' | 'paid' | 'failed'
//   shippingAddress?: string
//   billingAddress?: string
//   notes?: string
//   createdAt: string
//   updatedAt: string
//   userId: string
// }

// export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'orderNumber'>) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   try {
//     // Generate order number
//     const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
//     const docRef = await addDoc(ordersCollection, {
//       ...orderData,
//       orderNumber,
//       userId: user.uid,
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp()
//     })
    
//     // Update or create customer
//     await updateOrCreateCustomer(orderData.customerId, {
//       name: orderData.customerName,
//       email: orderData.customerEmail,
//       phone: orderData.customerPhone,
//       lastOrderDate: new Date().toISOString(),
//       totalSpent: orderData.totalAmount
//     })
    
//     return { id: docRef.id, orderNumber }
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to create order.')
//   }
// }

// export const getAllOrders = async () => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   try {
//     const q = query(
//       ordersCollection,
//       where('userId', '==', user.uid),
//       orderBy('createdAt', 'desc')
//     )

//     const snapshot = await getDocs(q)
    
//     return snapshot.docs.map(docSnap => {
//       const data = docSnap.data()
//       return {
//         id: docSnap.id,
//         orderNumber: data.orderNumber as string,
//         customerId: data.customerId as string,
//         customerName: data.customerName as string,
//         customerEmail: data.customerEmail as string,
//         customerPhone: data.customerPhone as string,
//         items: data.items as OrderItem[],
//         subtotal: data.subtotal as number,
//         tax: data.tax as number,
//         shipping: data.shipping as number,
//         totalAmount: data.totalAmount as number,
//         status: data.status as Order['status'],
//         paymentMethod: data.paymentMethod as Order['paymentMethod'],
//         paymentStatus: data.paymentStatus as Order['paymentStatus'],
//         shippingAddress: data.shippingAddress as string,
//         billingAddress: data.billingAddress as string,
//         notes: data.notes as string,
//         createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
//         updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
//         userId: data.userId as string
//       }
//     })
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to fetch orders.')
//   }
// }

// export const getOrderById = async (id: string) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   try {
//     const ref = doc(db, 'orders', id)
//     const orderDoc = await getDoc(ref)

//     if (!orderDoc.exists()) throw new Error('Order not found')
    
//     const data = orderDoc.data()
//     if (data.userId !== user.uid) throw new Error('Unauthorized access')

//     return {
//       id: orderDoc.id,
//       orderNumber: data.orderNumber as string,
//       customerId: data.customerId as string,
//       customerName: data.customerName as string,
//       customerEmail: data.customerEmail as string,
//       customerPhone: data.customerPhone as string,
//       items: data.items as OrderItem[],
//       subtotal: data.subtotal as number,
//       tax: data.tax as number,
//       shipping: data.shipping as number,
//       totalAmount: data.totalAmount as number,
//       status: data.status as Order['status'],
//       paymentMethod: data.paymentMethod as Order['paymentMethod'],
//       paymentStatus: data.paymentStatus as Order['paymentStatus'],
//       shippingAddress: data.shippingAddress as string,
//       billingAddress: data.billingAddress as string,
//       notes: data.notes as string,
//       createdAt: data.createdAt?.toDate().toISOString() || '',
//       updatedAt: data.updatedAt?.toDate().toISOString() || '',
//       userId: data.userId as string
//     }
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to fetch order.')
//   }
// }

// export const updateOrderStatus = async (
//   id: string,
//   status: Order['status'],
//   notes?: string
// ) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   try {
//     const ref = doc(db, 'orders', id)
//     const snap = await getDoc(ref)

//     if (!snap.exists()) throw new Error('Order not found')
//     if (snap.data().userId !== user.uid) throw new Error('Unauthorized access')

//     const updateData: any = {
//       status,
//       updatedAt: serverTimestamp()
//     }

//     if (notes) {
//       updateData.notes = notes
//     }

//     await updateDoc(ref, updateData)
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to update order status.')
//   }
// }

// export const updatePaymentStatus = async (
//   id: string,
//   paymentStatus: Order['paymentStatus']
// ) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   try {
//     const ref = doc(db, 'orders', id)
//     const snap = await getDoc(ref)

//     if (!snap.exists()) throw new Error('Order not found')
//     if (snap.data().userId !== user.uid) throw new Error('Unauthorized access')

//     await updateDoc(ref, {
//       paymentStatus,
//       updatedAt: serverTimestamp()
//     })
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to update payment status.')
//   }
// }

// export const deleteOrder = async (id: string) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   try {
//     const ref = doc(db, 'orders', id)
//     const snap = await getDoc(ref)

//     if (!snap.exists()) throw new Error('Order not found')
//     if (snap.data().userId !== user.uid) throw new Error('Unauthorized access')

//     await deleteDoc(ref)
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to delete order.')
//   }
// }

// export const getOrdersByStatus = async (status: Order['status']) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   try {
//     const q = query(
//       ordersCollection,
//       where('userId', '==', user.uid),
//       where('status', '==', status),
//       orderBy('createdAt', 'desc')
//     )

//     const snapshot = await getDocs(q)
//     return snapshot.docs.map(docSnap => {
//       const data = docSnap.data()
//       return {
//         id: docSnap.id,
//         orderNumber: data.orderNumber as string,
//         customerName: data.customerName as string,
//         totalAmount: data.totalAmount as number,
//         status: data.status as Order['status'],
//         createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
//         updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
//       }
//     })
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to fetch orders by status.')
//   }
// }

// export const getOrdersByCustomer = async (customerId: string) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   try {
//     const q = query(
//       ordersCollection,
//       where('userId', '==', user.uid),
//       where('customerId', '==', customerId),
//       orderBy('createdAt', 'desc')
//     )

//     const snapshot = await getDocs(q)
//     return snapshot.docs.map(docSnap => {
//       const data = docSnap.data()
//       return {
//         id: docSnap.id,
//         orderNumber: data.orderNumber as string,
//         totalAmount: data.totalAmount as number,
//         status: data.status as Order['status'],
//         paymentStatus: data.paymentStatus as Order['paymentStatus'],
//         createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
//       }
//     })
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to fetch customer orders.')
//   }
// }

// export const getOrderStats = async () => {
//   try {
//     const orders = await getAllOrders()
    
//     const pendingOrders = orders.filter(o => o.status === 'pending').length
//     const completedOrders = orders.filter(o => o.status === 'completed').length
//     const cancelledOrders = orders.filter(o => o.status === 'cancelled').length
    
//     const totalRevenue = orders
//       .filter(o => o.status === 'completed')
//       .reduce((sum, order) => sum + order.totalAmount, 0)
    
//     const averageOrderValue = completedOrders > 0 
//       ? totalRevenue / completedOrders 
//       : 0
    
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)
    
//     const todayOrders = orders.filter(o => {
//       const orderDate = new Date(o.createdAt)
//       return orderDate >= today
//     }).length
    
//     return {
//       totalOrders: orders.length,
//       pendingOrders,
//       completedOrders,
//       cancelledOrders,
//       totalRevenue,
//       averageOrderValue,
//       todayOrders
//     }
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to get order stats.')
//   }
// }

// export const searchOrders = async (searchTerm: string) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   try {
//     const orders = await getAllOrders()
    
//     return orders.filter(order =>
//       order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.customerPhone.includes(searchTerm)
//     )
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to search orders.')
//   }
// }

// // Helper function to update or create customer
// const updateOrCreateCustomer = async (
//   customerId: string,
//   customerData: any
// ) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   try {
//     const customerRef = doc(db, 'customers', customerId)
//     const customerSnap = await getDoc(customerRef)
    
//     if (customerSnap.exists()) {
//       // Update existing customer
//       const existingData = customerSnap.data()
//       await updateDoc(customerRef, {
//         name: customerData.name || existingData.name,
//         email: customerData.email || existingData.email,
//         phone: customerData.phone || existingData.phone,
//         lastOrderDate: customerData.lastOrderDate,
//         totalSpent: (existingData.totalSpent || 0) + (customerData.totalSpent || 0),
//         orderCount: (existingData.orderCount || 0) + 1,
//         updatedAt: serverTimestamp()
//       })
//     } else {
//       // Create new customer
//       await updateDoc(customerRef, {
//         ...customerData,
//         userId: user.uid,
//         orderCount: 1,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp()
//       })
//     }
//   } catch (error) {
//     console.error('Failed to update/create customer:', error)
//   }
// }




// orderService.ts
import { getAuthInstance } from './firebase'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'

const ordersCollection = collection(db, 'orders')
const customersCollection = collection(db, 'customers')

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
  subtotal: number
  tax: number
  shipping: number
  totalAmount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'other'
  paymentStatus: 'pending' | 'paid' | 'failed'
  shippingAddress?: string
  billingAddress?: string
  notes?: string
  createdAt: string
  updatedAt: string
  userId: string
}

const getCurrentUser = () => {
  const auth = getAuthInstance()
  return auth.currentUser
}

const formatTimestampToISO = (value: any): string => {
  if (!value) return ''
  // Firestore Timestamp
  if (typeof value?.toDate === 'function') {
    try {
      return (value as Timestamp).toDate().toISOString()
    } catch {
      return ''
    }
  }
  // string already
  if (typeof value === 'string') return value
  // number (ms)
  if (typeof value === 'number') return new Date(value).toISOString()
  return ''
}

/**
 * Create order.
 * If orderData.customerId is falsy, a new customer document will be created and its id used.
 */
export const createOrder = async (
  orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'orderNumber'>
) => {
  const user = getCurrentUser()
  if (!user) throw new Error('User not authenticated.')

  try {
    // Ensure customer exists (create if missing)
    let customerIdToUse = orderData.customerId
    if (!customerIdToUse) {
      const newCustomerRef = doc(customersCollection) // auto id
      await setDoc(newCustomerRef, {
        name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone,
        lastOrderDate: new Date().toISOString(),
        totalSpent: orderData.totalAmount || 0,
        userId: user.uid,
        orderCount: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      customerIdToUse = newCustomerRef.id
    } else {
      // If caller provided customerId, update or create if missing
      await updateOrCreateCustomer(orderData.customerId, {
        name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone,
        lastOrderDate: new Date().toISOString(),
        totalSpent: orderData.totalAmount || 0
      })
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    const payload: any = {
      ...orderData,
      customerId: customerIdToUse,
      orderNumber,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = await addDoc(ordersCollection, payload)

    return { id: docRef.id, orderNumber }
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to create order.')
  }
}

export const getAllOrders = async () => {
  const user = getCurrentUser()
  if (!user) throw new Error('User not authenticated.')

  try {
    const q = query(
      ordersCollection,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        orderNumber: data.orderNumber as string,
        customerId: data.customerId as string,
        customerName: data.customerName as string,
        customerEmail: data.customerEmail as string,
        customerPhone: data.customerPhone as string,
        items: (data.items || []) as OrderItem[],
        subtotal: Number(data.subtotal || 0),
        tax: Number(data.tax || 0),
        shipping: Number(data.shipping || 0),
        totalAmount: Number(data.totalAmount || 0),
        status: data.status as Order['status'],
        paymentMethod: data.paymentMethod as Order['paymentMethod'],
        paymentStatus: data.paymentStatus as Order['paymentStatus'],
        shippingAddress: data.shippingAddress as string,
        billingAddress: data.billingAddress as string,
        notes: data.notes as string,
        createdAt: formatTimestampToISO(data.createdAt) || new Date().toISOString(),
        updatedAt: formatTimestampToISO(data.updatedAt) || new Date().toISOString(),
        userId: data.userId as string
      }
    })
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to fetch orders.')
  }
}

export const getOrderById = async (id: string) => {
  const user = getCurrentUser()
  if (!user) throw new Error('User not authenticated.')

  try {
    const ref = doc(db, 'orders', id)
    const orderDoc = await getDoc(ref)

    if (!orderDoc.exists()) throw new Error('Order not found')

    const data = orderDoc.data()
    if (data.userId !== user.uid) throw new Error('Unauthorized access')

    return {
      id: orderDoc.id,
      orderNumber: data.orderNumber as string,
      customerId: data.customerId as string,
      customerName: data.customerName as string,
      customerEmail: data.customerEmail as string,
      customerPhone: data.customerPhone as string,
      items: (data.items || []) as OrderItem[],
      subtotal: Number(data.subtotal || 0),
      tax: Number(data.tax || 0),
      shipping: Number(data.shipping || 0),
      totalAmount: Number(data.totalAmount || 0),
      status: data.status as Order['status'],
      paymentMethod: data.paymentMethod as Order['paymentMethod'],
      paymentStatus: data.paymentStatus as Order['paymentStatus'],
      shippingAddress: data.shippingAddress as string,
      billingAddress: data.billingAddress as string,
      notes: data.notes as string,
      createdAt: formatTimestampToISO(data.createdAt) || '',
      updatedAt: formatTimestampToISO(data.updatedAt) || '',
      userId: data.userId as string
    }
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to fetch order.')
  }
}

export const updateOrderStatus = async (
  id: string,
  status: Order['status'],
  notes?: string
) => {
  const user = getCurrentUser()
  if (!user) throw new Error('User not authenticated.')

  try {
    const ref = doc(db, 'orders', id)
    const snap = await getDoc(ref)

    if (!snap.exists()) throw new Error('Order not found')
    if (snap.data().userId !== user.uid) throw new Error('Unauthorized access')

    const updateData: any = {
      status,
      updatedAt: serverTimestamp()
    }

    if (notes) updateData.notes = notes

    await updateDoc(ref, updateData)
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to update order status.')
  }
}

export const updatePaymentStatus = async (
  id: string,
  paymentStatus: Order['paymentStatus']
) => {
  const user = getCurrentUser()
  if (!user) throw new Error('User not authenticated.')

  try {
    const ref = doc(db, 'orders', id)
    const snap = await getDoc(ref)

    if (!snap.exists()) throw new Error('Order not found')
    if (snap.data().userId !== user.uid) throw new Error('Unauthorized access')

    await updateDoc(ref, {
      paymentStatus,
      updatedAt: serverTimestamp()
    })
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to update payment status.')
  }
}

export const deleteOrder = async (id: string) => {
  const user = getCurrentUser()
  if (!user) throw new Error('User not authenticated.')

  try {
    const ref = doc(db, 'orders', id)
    const snap = await getDoc(ref)

    if (!snap.exists()) throw new Error('Order not found')
    if (snap.data().userId !== user.uid) throw new Error('Unauthorized access')

    await deleteDoc(ref)
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to delete order.')
  }
}

export const getOrdersByStatus = async (status: Order['status']) => {
  const user = getCurrentUser()
  if (!user) throw new Error('User not authenticated.')

  try {
    const q = query(
      ordersCollection,
      where('userId', '==', user.uid),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        orderNumber: data.orderNumber as string,
        customerName: data.customerName as string,
        totalAmount: Number(data.totalAmount || 0),
        status: data.status as Order['status'],
        createdAt: formatTimestampToISO(data.createdAt) || new Date().toISOString(),
        updatedAt: formatTimestampToISO(data.updatedAt) || new Date().toISOString()
      }
    })
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to fetch orders by status.')
  }
}

export const getOrdersByCustomer = async (customerId: string) => {
  const user = getCurrentUser()
  if (!user) throw new Error('User not authenticated.')

  try {
    const q = query(
      ordersCollection,
      where('userId', '==', user.uid),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        orderNumber: data.orderNumber as string,
        totalAmount: Number(data.totalAmount || 0),
        status: data.status as Order['status'],
        paymentStatus: data.paymentStatus as Order['paymentStatus'],
        createdAt: formatTimestampToISO(data.createdAt) || new Date().toISOString()
      }
    })
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to fetch customer orders.')
  }
}

export const getOrderStats = async () => {
  try {
    const orders = await getAllOrders()

    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const completedOrders = orders.filter(o => o.status === 'completed').length
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length

    const totalRevenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0)

    const averageOrderValue = completedOrders > 0
      ? totalRevenue / completedOrders
      : 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt)
      return orderDate >= today
    }).length

    return {
      totalOrders: orders.length,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      averageOrderValue,
      todayOrders
    }
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to get order stats.')
  }
}

export const searchOrders = async (searchTerm: string) => {
  const user = getCurrentUser()
  if (!user) throw new Error('User not authenticated.')

  try {
    const orders = await getAllOrders()

    return orders.filter(order =>
      (order.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerPhone || '').includes(searchTerm)
    )
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to search orders.')
  }
}

// Helper function to update or create customer
const updateOrCreateCustomer = async (
  customerId: string | null | undefined,
  customerData: any
) => {
  const user = getCurrentUser()
  if (!user) throw new Error('User not authenticated.')

  try {
    const customerRef = customerId
      ? doc(db, 'customers', customerId)
      : doc(customersCollection) // auto id

    const customerSnap = await getDoc(customerRef)

    if (customerSnap.exists()) {
      const existingData = customerSnap.data()
      await updateDoc(customerRef, {
        name: customerData.name || existingData.name,
        email: customerData.email || existingData.email,
        phone: customerData.phone || existingData.phone,
        lastOrderDate: customerData.lastOrderDate || existingData.lastOrderDate,
        totalSpent: (existingData.totalSpent || 0) + (customerData.totalSpent || 0),
        orderCount: (existingData.orderCount || 0) + 1,
        updatedAt: serverTimestamp()
      })
    } else {
      await setDoc(customerRef, {
        ...customerData,
        userId: user.uid,
        orderCount: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    }
  } catch (error) {
    console.error('Failed to update/create customer:', error)
    // swallow or rethrow depending on desired behavior; currently we just log
  }
}
