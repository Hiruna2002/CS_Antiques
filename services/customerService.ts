// import { getAuth } from 'firebase/auth'
// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   query,
//   where,
//   orderBy,
//   updateDoc,
//   serverTimestamp,
//   addDoc
// } from 'firebase/firestore'
// import { db } from './firebase'

// const auth = getAuth()
// const customersCollection = collection(db, 'customers')
// const ordersCollection = collection(db, 'orders')

// export interface Customer {
//   id: string
//   name: string
//   email: string
//   phone: string
//   address?: string
//   city?: string
//   country?: string
//   notes?: string
//   createdAt: string
//   updatedAt: string
//   userId: string
//   orderCount: number
//   totalSpent: number
//   lastOrderDate?: string
// }

// export const getAllCustomers = async () => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   try {
//     const q = query(
//       customersCollection,
//       where('userId', '==', user.uid),
//       orderBy('createdAt', 'desc')
//     )

//     const snapshot = await getDocs(q)
    
//     return snapshot.docs.map(docSnap => {
//       const data = docSnap.data()
//       return {
//         id: docSnap.id,
//         name: data.name as string,
//         email: data.email as string,
//         phone: data.phone as string,
//         address: data.address as string,
//         city: data.city as string,
//         country: data.country as string,
//         notes: data.notes as string,
//         createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
//         updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
//         userId: data.userId as string,
//         orderCount: data.orderCount as number || 0,
//         totalSpent: data.totalSpent as number || 0,
//         lastOrderDate: data.lastOrderDate as string
//       }
//     })
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to fetch customers.')
//   }
// }

// export const getCustomerById = async (id: string) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   try {
//     const ref = doc(db, 'customers', id)
//     const customerDoc = await getDoc(ref)

//     if (!customerDoc.exists()) throw new Error('Customer not found')
    
//     const data = customerDoc.data()
//     if (data.userId !== user.uid) throw new Error('Unauthorized access')

//     return {
//       id: customerDoc.id,
//       name: data.name as string,
//       email: data.email as string,
//       phone: data.phone as string,
//       address: data.address as string,
//       city: data.city as string,
//       country: data.country as string,
//       notes: data.notes as string,
//       createdAt: data.createdAt?.toDate().toISOString() || '',
//       updatedAt: data.updatedAt?.toDate().toISOString() || '',
//       userId: data.userId as string,
//       orderCount: data.orderCount as number || 0,
//       totalSpent: data.totalSpent as number || 0,
//       lastOrderDate: data.lastOrderDate as string
//     }
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to fetch customer.')
//   }
// }

// export const createCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'orderCount' | 'totalSpent'>) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   try {
//     // Check if customer already exists with same email or phone
//     const emailQuery = query(
//       customersCollection,
//       where('userId', '==', user.uid),
//       where('email', '==', customerData.email)
//     )
    
//     const phoneQuery = query(
//       customersCollection,
//       where('userId', '==', user.uid),
//       where('phone', '==', customerData.phone)
//     )

//     const [emailSnapshot, phoneSnapshot] = await Promise.all([
//       getDocs(emailQuery),
//       getDocs(phoneQuery)
//     ])

//     if (!emailSnapshot.empty) {
//       throw new Error('Customer with this email already exists')
//     }

//     if (!phoneSnapshot.empty) {
//       throw new Error('Customer with this phone number already exists')
//     }

//     const docRef = await addDoc(customersCollection, {
//       ...customerData,
//       userId: user.uid,
//       orderCount: 0,
//       totalSpent: 0,
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp()
//     })
    
//     return docRef.id
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to create customer.')
//   }
// }

// export const updateCustomer = async (
//   id: string,
//   updates: Partial<Omit<Customer, 'id' | 'createdAt' | 'userId' | 'orderCount' | 'totalSpent'>>
// ) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   try {
//     const ref = doc(db, 'customers', id)
//     const snap = await getDoc(ref)

//     if (!snap.exists()) throw new Error('Customer not found')
//     if (snap.data().userId !== user.uid) throw new Error('Unauthorized access')

//     await updateDoc(ref, {
//       ...updates,
//       updatedAt: serverTimestamp()
//     })
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to update customer.')
//   }
// }

// export const deleteCustomer = async (id: string) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   try {
//     const ref = doc(db, 'customers', id)
//     const snap = await getDoc(ref)

//     if (!snap.exists()) throw new Error('Customer not found')
//     if (snap.data().userId !== user.uid) throw new Error('Unauthorized access')

//     // Check if customer has orders
//     const ordersQuery = query(
//       ordersCollection,
//       where('userId', '==', user.uid),
//       where('customerId', '==', id)
//     )
//     const ordersSnapshot = await getDocs(ordersQuery)
    
//     if (ordersSnapshot.size > 0) {
//       throw new Error('Cannot delete customer with existing orders.')
//     }

//     await updateDoc(ref, {
//       isDeleted: true,
//       deletedAt: serverTimestamp()
//     })
    
//     // Soft delete - just mark as deleted
//     return true
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to delete customer.')
//   }
// }

// export const searchCustomers = async (searchTerm: string) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   try {
//     const customers = await getAllCustomers()
    
//     return customers.filter(customer =>
//       customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customer.phone.includes(searchTerm) ||
//       customer.address?.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to search customers.')
//   }
// }

// export const getTopCustomers = async (limitCount: number = 10) => {
//   try {
//     const customers = await getAllCustomers()
    
//     // Sort by total spent descending
//     return customers
//       .sort((a, b) => b.totalSpent - a.totalSpent)
//       .slice(0, limitCount)
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to fetch top customers.')
//   }
// }

// export const getCustomerStats = async () => {
//   try {
//     const customers = await getAllCustomers()
    
//     const totalCustomers = customers.length
//     const newThisMonth = customers.filter(customer => {
//       const customerDate = new Date(customer.createdAt)
//       const now = new Date()
//       return customerDate.getMonth() === now.getMonth() && 
//              customerDate.getFullYear() === now.getFullYear()
//     }).length
    
//     const topSpender = customers.reduce((max, customer) => 
//       customer.totalSpent > max.totalSpent ? customer : max, 
//       { totalSpent: 0 } as Customer
//     )
    
//     const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0)
//     const averageOrderValue = totalCustomers > 0 
//       ? totalRevenue / totalCustomers 
//       : 0
    
//     return {
//       totalCustomers,
//       newThisMonth,
//       topSpender: topSpender.totalSpent > 0 ? {
//         name: topSpender.name,
//         amount: topSpender.totalSpent
//       } : null,
//       totalRevenue,
//       averageOrderValue
//     }
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to get customer stats.')
//   }
// }

// export const getCustomerOrders = async (customerId: string) => {
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
//         status: data.status as string,
//         paymentStatus: data.paymentStatus as string,
//         createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
//       }
//     })
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to fetch customer orders.')
//   }
// }






// services/customerService.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db, getAuthInstance } from "./firebase";

/* ---------------- HELPERS ---------------- */

const auth = () => getAuthInstance();
const customersCollection = () => collection(db, "customers");
const ordersCollection = () => collection(db, "orders");

/* ---------------- TYPES ---------------- */

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate?: string;
}

/* ---------------- GET ALL ---------------- */

export const getAllCustomers = async () => {
  const user = auth().currentUser;
  if (!user) throw new Error("User not authenticated.");

  const q = query(
    customersCollection(),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    return {
      id: docSnap.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      country: data.country,
      notes: data.notes,
      createdAt: data.createdAt?.toDate().toISOString() ?? "",
      updatedAt: data.updatedAt?.toDate().toISOString() ?? "",
      userId: data.userId,
      orderCount: data.orderCount ?? 0,
      totalSpent: data.totalSpent ?? 0,
      lastOrderDate: data.lastOrderDate,
    };
  });
};

/* ---------------- GET BY ID ---------------- */

export const getCustomerById = async (id: string) => {
  const user = auth().currentUser;
  if (!user) throw new Error("User not authenticated.");

  const ref = doc(db, "customers", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error("Customer not found");
  if (snap.data().userId !== user.uid) throw new Error("Unauthorized access");

  const data = snap.data();

  return {
    id: snap.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    city: data.city,
    country: data.country,
    notes: data.notes,
    createdAt: data.createdAt?.toDate().toISOString() ?? "",
    updatedAt: data.updatedAt?.toDate().toISOString() ?? "",
    userId: data.userId,
    orderCount: data.orderCount ?? 0,
    totalSpent: data.totalSpent ?? 0,
    lastOrderDate: data.lastOrderDate,
  };
};

/* ---------------- CREATE ---------------- */

export const createCustomer = async (
  customerData: Omit<
    Customer,
    "id" | "createdAt" | "updatedAt" | "userId" | "orderCount" | "totalSpent"
  >
) => {
  const user = auth().currentUser;
  if (!user) throw new Error("User not authenticated.");

  const emailQuery = query(
    customersCollection(),
    where("userId", "==", user.uid),
    where("email", "==", customerData.email)
  );

  const phoneQuery = query(
    customersCollection(),
    where("userId", "==", user.uid),
    where("phone", "==", customerData.phone)
  );

  const [emailSnap, phoneSnap] = await Promise.all([
    getDocs(emailQuery),
    getDocs(phoneQuery),
  ]);

  if (!emailSnap.empty) throw new Error("Customer with this email already exists");
  if (!phoneSnap.empty) throw new Error("Customer with this phone already exists");

  const ref = await addDoc(customersCollection(), {
    ...customerData,
    userId: user.uid,
    orderCount: 0,
    totalSpent: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
};

/* ---------------- UPDATE ---------------- */

export const updateCustomer = async (
  id: string,
  updates: Partial<
    Omit<Customer, "id" | "createdAt" | "userId" | "orderCount" | "totalSpent">
  >
) => {
  const user = auth().currentUser;
  if (!user) throw new Error("User not authenticated.");

  const ref = doc(db, "customers", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error("Customer not found");
  if (snap.data().userId !== user.uid) throw new Error("Unauthorized access");

  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

/* ---------------- DELETE (SOFT) ---------------- */

export const deleteCustomer = async (id: string) => {
  const user = auth().currentUser;
  if (!user) throw new Error("User not authenticated.");

  const ref = doc(db, "customers", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error("Customer not found");
  if (snap.data().userId !== user.uid) throw new Error("Unauthorized access");

  const ordersQuery = query(
    ordersCollection(),
    where("userId", "==", user.uid),
    where("customerId", "==", id)
  );

  const ordersSnap = await getDocs(ordersQuery);
  if (!ordersSnap.empty) {
    throw new Error("Cannot delete customer with existing orders.");
  }

  await updateDoc(ref, {
    isDeleted: true,
    deletedAt: serverTimestamp(),
  });

  return true;
};



/* ---------------- GET CUSTOMER STATS ---------------- */

export const getCustomerStats = async () => {
  const user = auth().currentUser;
  if (!user) throw new Error("User not authenticated.");

  try {
    const customersQuery = query(
      customersCollection(),
      where("userId", "==", user.uid),
      where("isDeleted", "==", false) 
    );
    const customersSnap = await getDocs(customersQuery);
    const totalCustomers = customersSnap.size;

    let totalSpent = 0;
    let totalOrders = 0;
    customersSnap.forEach((doc) => {
      const data = doc.data();
      totalSpent += data.totalSpent || 0;
      totalOrders += data.orderCount || 0;
    });

    // 4. New customers this month (optional)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newThisMonthQuery = query(
      customersCollection(),
      where("userId", "==", user.uid),
      where("createdAt", ">=", startOfMonth)
    );
    const newThisMonthSnap = await getDocs(newThisMonthQuery);
    const newThisMonth = newThisMonthSnap.size;

    return {
      totalCustomers,
      totalSpent,
      totalOrders,
      newThisMonth,
    };
  } catch (error) {
    console.error("Error fetching customer stats:", error);
    throw error;
  }
};
