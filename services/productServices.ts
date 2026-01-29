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
//   serverTimestamp
// } from 'firebase/firestore'
// import { db } from './firebase'
// import { Product } from '@/types/product'

// const auth = getAuth()
// const productsCollection = collection(db, 'products')

// export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'userId'>) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   await addDoc(productsCollection, {
//     ...product,
//     userId: user.uid,
//     createdAt: serverTimestamp()
//   })
// }

// export const getAllProducts = async () => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   const q = query(
//     productsCollection,
//     where('userId', '==', user.uid),
//     orderBy('createdAt', 'desc')
//   )

//   const snapshot = await getDocs(q)
//   return snapshot.docs.map(docSnap => {
//     const data = docSnap.data()
//     return {
//       id: docSnap.id,
//       name: data.name as string,
//       description: data.description as string,
//       price: data.price as number,
//       stock: data.stock as number,
//       category: data.category as string,
//       condition: data.condition as string,
//       imageUrl: data.imageUrl as string,
//       createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
//       userId: data.userId as string
//     }
//   })
// }

// export const getProductById = async (id: string) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   const ref = doc(db, 'products', id)
//   const productDoc = await getDoc(ref)

//   if (!productDoc.exists()) throw new Error('Product not found')
  
//   const data = productDoc.data()
//   if (data.userId !== user.uid) throw new Error('Unauthorized')

//   return {
//     id: productDoc.id,
//     name: data.name || '',
//     description: data.description || '',
//     price: data.price || 0,
//     stock: data.stock || 0,
//     category: data.category || '',
//     condition: data.condition || 'Good',
//     imageUrl: data.imageUrl || '',
//     createdAt: data.createdAt?.toDate().toISOString() || '',
//     userId: data.userId as string
//   }
// }

// export const updateProduct = async (
//   id: string,
//   product: Partial<Omit<Product, 'id' | 'createdAt' | 'userId'>>
// ) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   const ref = doc(db, 'products', id)
//   const snap = await getDoc(ref)

//   if (!snap.exists()) throw new Error('Product not found')
//   if (snap.data().userId !== user.uid) throw new Error('Unauthorized')

//   await updateDoc(ref, product)
// }

// export const deleteProduct = async (id: string) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   const ref = doc(db, 'products', id)
//   const snap = await getDoc(ref)

//   if (!snap.exists()) throw new Error('Product not found')
//   if (snap.data().userId !== user.uid) throw new Error('Unauthorized')

//   await deleteDoc(ref)
// }

// export const searchProducts = async (queryText: string) => {
//   const user = auth.currentUser
//   if (!user) throw new Error('User not authenticated.')

//   const q = query(
//     productsCollection,
//     where('userId', '==', user.uid),
//     orderBy('name')
//   )

//   const snapshot = await getDocs(q)
//   const allProducts = snapshot.docs.map(docSnap => {
//     const data = docSnap.data()
//     return {
//       id: docSnap.id,
//       name: data.name as string,
//       description: data.description as string,
//       price: data.price as number,
//       stock: data.stock as number,
//       category: data.category as string,
//       condition: data.condition as string,
//       imageUrl: data.imageUrl as string,
//       createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
//       userId: data.userId as string
//     }
//   })

//   return allProducts.filter(product =>
//     product.name.toLowerCase().includes(queryText.toLowerCase()) ||
//     product.category.toLowerCase().includes(queryText.toLowerCase()) ||
//     product.description?.toLowerCase().includes(queryText.toLowerCase())
//   )
// }

// export const getProductStats = async () => {
//   const products = await getAllProducts()
//   const total = products.length
//   const lowStock = products.filter(p => p.stock < 10).length
//   return { total, lowStock }
// }



//--------------------------------------------------------------------------------------------


// productService.ts
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
  updateDoc,
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { Product } from '@/types/product'

const productsCollection = collection(db, 'products')

const CLOUD_NAME = 'dod3xppgl';
const UPLOAD_PRESET = 'cs_antiques';

const getCurrentUser = () => {
  const auth = getAuthInstance()
  return auth.currentUser
}

export const uploadImage = async (uri: string): Promise<string> => {
  try {
    const formData = new FormData();

    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: `food-${Date.now()}.jpg`,
    } as any);

    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (data.secure_url) {
      console.log('Cloudinary success:', data.secure_url);
      return data.secure_url;
    } else {
      throw new Error(data.error?.message || 'Upload failed');
    }
  } catch (error: any) {
    console.error('Cloudinary error:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

const formatTimestampToISO = (value: any): string => {
  if (!value) return ''
  if (typeof value?.toDate === 'function') {
    try {
      return (value as Timestamp).toDate().toISOString()
    } catch {
      return ''
    }
  }
  if (typeof value === 'string') return value
  if (typeof value === 'number') return new Date(value).toISOString()
  return ''
}

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'userId'>) => {
  const user = getCurrentUser()
  if (!user) throw new Error('User not authenticated.')

  await addDoc(productsCollection, {
    ...product,
    userId: user.uid,
    createdAt: serverTimestamp()
  })
}

export const getAllProducts = async () => {
  const user = getCurrentUser()
  if (!user) throw new Error('User not authenticated.')

  const q = query(
    productsCollection,
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      name: (data.name as string) || '',
      description: (data.description as string) || '',
      price: Number(data.price ?? 0),
      stock: Number(data.stock ?? 0),
      category: (data.category as string) || '',
      condition: (data.condition as string) || '',
      imageUrl: (data.imageUrl as string) || '',
      createdAt: formatTimestampToISO(data.createdAt) || new Date().toISOString(),
      userId: (data.userId as string) || ''
    }
  })
}

export const getProductById = async (id: string) => {
  const user = getCurrentUser()
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'products', id)
  const productDoc = await getDoc(ref)

  if (!productDoc.exists()) throw new Error('Product not found')

  const data = productDoc.data()
  if (data.userId !== user.uid) throw new Error('Unauthorized')

  return {
    id: productDoc.id,
    name: data.name || '',
    description: data.description || '',
    price: Number(data.price ?? 0),
    stock: Number(data.stock ?? 0),
    category: data.category || '',
    condition: data.condition || 'Good',
    imageUrl: data.imageUrl || '',
    createdAt: formatTimestampToISO(data.createdAt) || '',
    userId: data.userId as string
  }
}

export const updateProduct = async (
  id: string,
  product: Partial<Omit<Product, 'id' | 'createdAt' | 'userId'>>
) => {
  const user = getCurrentUser()
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'products', id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error('Product not found')
  if (snap.data().userId !== user.uid) throw new Error('Unauthorized')

  await updateDoc(ref, {
    ...product,
    // optional: update timestamp if you want
    updatedAt: serverTimestamp()
  } as any)
}

export const deleteProduct = async (id: string) => {
  const user = getCurrentUser()
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'products', id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error('Product not found')
  if (snap.data().userId !== user.uid) throw new Error('Unauthorized')

  await deleteDoc(ref)
}

export const searchProducts = async (queryText: string) => {
  const user = getCurrentUser()
  if (!user) throw new Error('User not authenticated.')

  const q = query(
    productsCollection,
    where('userId', '==', user.uid),
    orderBy('name')
  )

  const snapshot = await getDocs(q)
  const allProducts = snapshot.docs.map(docSnap => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      name: (data.name as string) || '',
      description: (data.description as string) || '',
      price: Number(data.price ?? 0),
      stock: Number(data.stock ?? 0),
      category: (data.category as string) || '',
      condition: (data.condition as string) || '',
      imageUrl: (data.imageUrl as string) || '',
      createdAt: formatTimestampToISO(data.createdAt) || new Date().toISOString(),
      userId: (data.userId as string) || ''
    }
  })

  const term = queryText.toLowerCase()
  return allProducts.filter(product =>
    product.name.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term) ||
    (product.description || '').toLowerCase().includes(term)
  )
}

export const getProductStats = async () => {
  const products = await getAllProducts()
  const total = products.length
  const lowStock = products.filter(p => (p.stock ?? 0) < 10).length
  return { total, lowStock }
}
