// import { getAuth } from 'firebase/auth'
// import {
//   addDoc,
//   collection,
//   deleteDoc,
//   doc,
//   getDoc,
//   getDocs,
//   query,
//   where
// } from 'firebase/firestore'
// import { db } from './firebase'

// const auth = getAuth()
// const categoriesCollection = collection(db, 'categories')

// export const addCategory = async (name: string) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   // Check if category already exists
//   const q = query(
//     categoriesCollection,
//     where('userId', '==', user.uid),
//     where('name', '==', name.toLowerCase())
//   )
  
//   const existing = await getDocs(q)
//   if (!existing.empty) {
//     throw new Error('Category already exists')
//   }

//   await addDoc(categoriesCollection, {
//     name: name.toLowerCase(),
//     displayName: name,
//     userId: user.uid,
//     createdAt: new Date().toISOString()
//   })
// }

// export const getAllCategories = async () => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   const q = query(
//     categoriesCollection,
//     where('userId', '==', user.uid)
//   )

//   const snapshot = await getDocs(q)
//   return snapshot.docs.map(docSnap => {
//     const data = docSnap.data()
//     return {
//       id: docSnap.id,
//       name: data.displayName || data.name,
//       createdAt: data.createdAt,
//       userId: data.userId
//     }
//   })
// }

// export const deleteCategory = async (id: string) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   const ref = doc(db, 'categories', id)
//   const snap = await getDoc(ref)

//   if (!snap.exists()) throw new Error('Category not found')
//   if (snap.data().userId !== user.uid) throw new Error('Unauthorized')

//   await deleteDoc(ref)
// }








// services/categoryService.ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, getAuthInstance } from "./firebase";

/**
 * Always get auth at runtime
 */
const auth = () => getAuthInstance();

/**
 * Get collection lazily (safe)
 */
const categoriesCollection = () => collection(db, "categories");

/* ---------------- ADD CATEGORY ---------------- */

export const addCategory = async (name: string) => {
  const user = auth().currentUser;
  if (!user) throw new Error("User not authenticated.");

  const normalizedName = name.trim().toLowerCase();

  // Check if category already exists
  const q = query(
    categoriesCollection(),
    where("userId", "==", user.uid),
    where("name", "==", normalizedName)
  );

  const existing = await getDocs(q);
  if (!existing.empty) {
    throw new Error("Category already exists");
  }

  await addDoc(categoriesCollection(), {
    name: normalizedName,
    displayName: name.trim(),
    userId: user.uid,
    createdAt: new Date().toISOString(),
  });
};

/* ---------------- GET ALL ---------------- */

export const getAllCategories = async () => {
  const user = auth().currentUser;
  if (!user) throw new Error("User not authenticated.");

  const q = query(
    categoriesCollection(),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.displayName ?? data.name,
      createdAt: data.createdAt,
      userId: data.userId,
    };
  });
};

/* ---------------- DELETE ---------------- */

export const deleteCategory = async (id: string) => {
  const user = auth().currentUser;
  if (!user) throw new Error("User not authenticated.");

  const ref = doc(db, "categories", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Category not found");
  }

  if (snap.data().userId !== user.uid) {
    throw new Error("Unauthorized");
  }

  await deleteDoc(ref);
};
