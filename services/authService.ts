// import {
//   createUserWithEmailAndPassword,
//   updateProfile,
//   signInWithEmailAndPassword,
//   signOut,
//   sendPasswordResetEmail
// } from "firebase/auth"
// import { auth, db } from "./firebase"
// import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"
// import AsyncStorage from "@react-native-async-storage/async-storage"

// export interface ShopData {
//   shopName: string
//   email: string
//   phone: string
//   address?: string
//   description?: string
//   openingHours?: string
//   createdAt: string
// }

// export const login = async (email: string, password: string) => {
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password)
//     return userCredential.user
//   } catch (error: any) {
//     throw new Error(error.message || "Login failed. Please check your credentials.")
//   }
// }

// export const registerUser = async (
//   shopName: string,
//   email: string,
//   password: string,
//   phone: string,
//   address?: string
// ) => {
//   try {
//     // Create user account
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
//     // Update profile with shop name
//     await updateProfile(userCredential.user, { displayName: shopName })
    
//     // Save shop details to Firestore
//     const shopData: ShopData = {
//       shopName,
//       email,
//       phone,
//       address,
//       createdAt: new Date().toISOString()
//     }
    
//     await setDoc(doc(db, "shops", userCredential.user.uid), shopData)
    
//     return userCredential.user
//   } catch (error: any) {
//     throw new Error(error.message || "Registration failed. Please try again.")
//   }
// }

// export const logoutUser = async () => {
//   try {
//     await signOut(auth)
//     await AsyncStorage.clear()
//   } catch (error: any) {
//     throw new Error(error.message || "Logout failed.")
//   }
// }

// export const getShopProfile = async (userId: string) => {
//   try {
//     const shopDoc = await getDoc(doc(db, "shops", userId))
//     if (shopDoc.exists()) {
//       return shopDoc.data() as ShopData
//     }
//     return null
//   } catch (error: any) {
//     throw new Error(error.message || "Failed to fetch shop profile.")
//   }
// }

// export const updateShopProfile = async (
//   userId: string,
//   updates: Partial<ShopData>
// ) => {
//   try {
//     await updateDoc(doc(db, "shops", userId), updates)
//   } catch (error: any) {
//     throw new Error(error.message || "Failed to update profile.")
//   }
// }

// export const resetPassword = async (email: string) => {
//   try {
//     await sendPasswordResetEmail(auth, email)
//   } catch (error: any) {
//     throw new Error(error.message || "Failed to send password reset email.")
//   }
// }

// export const getCurrentUser = () => {
//   return auth.currentUser
// }







// services/authService.ts
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { db, getAuthInstance } from "./firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ShopData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  address?: string;
  description?: string;
  openingHours?: string;
  createdAt: string;
}

const auth = () => getAuthInstance();

/* ---------------- AUTH ACTIONS ---------------- */

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth(),
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(
      error?.message || "Login failed. Please check your credentials."
    );
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
) => {
  try {
    // Create user
    const userCredential = await createUserWithEmailAndPassword(
      auth(),
      email,
      password
    );

    // Update display name
    await updateProfile(userCredential.user, {
      displayName: name,
    });

    // Store shop info
    const shopData: ShopData = {
      name,
      email,
      password,
      confirmPassword,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "User", userCredential.user.uid), shopData);
    console.log(userCredential)

    return userCredential.user;
  } catch (error: any) {
    throw new Error(
      error?.message || "Registration failed. Please try again."
    );
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth());
    await AsyncStorage.clear();
  } catch (error: any) {
    throw new Error(error?.message || "Logout failed.");
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth(), email);
  } catch (error: any) {
    throw new Error(
      error?.message || "Failed to send password reset email."
    );
  }
};

/* ---------------- SHOP PROFILE ---------------- */

export const getShopProfile = async (userId: string) => {
  try {
    const shopDoc = await getDoc(doc(db, "shops", userId));
    return shopDoc.exists() ? (shopDoc.data() as ShopData) : null;
  } catch (error: any) {
    throw new Error(
      error?.message || "Failed to fetch shop profile."
    );
  }
};

export const updateShopProfile = async (
  userId: string,
  updates: Partial<ShopData>
) => {
  try {
    await updateDoc(doc(db, "shops", userId), updates);
  } catch (error: any) {
    throw new Error(
      error?.message || "Failed to update profile."
    );
  }
};

/* ---------------- HELPERS ---------------- */

export const getCurrentUser = () => {
  return auth().currentUser;
};
