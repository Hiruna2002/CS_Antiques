// import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
// import { auth, storage } from "./firebase"
// import { Platform } from "react-native"
// import * as ImagePicker from "expo-image-picker"

// // Initialize storage
// // import { getStorage } from "firebase/storage"
// // export const storage = getStorage()

// export const pickImage = async (): Promise<string | null> => {
//   try {
//     // Request permissions
//     if (Platform.OS !== "web") {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
//       if (status !== "granted") {
//         throw new Error("Sorry, we need camera roll permissions to make this work!")
//       }
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 0.8,
//     })

//     if (!result.canceled && result.assets[0].uri) {
//       return result.assets[0].uri
//     }

//     return null
//   } catch (error: any) {
//     throw new Error(error.message || "Failed to pick image.")
//   }
// }

// export const uploadImage = async (
//   uri: string,
//   path: string = "products"
// ): Promise<string> => {
//   try {
//     const user = auth.currentUser
//     if (!user) throw new Error("User not authenticated.")

//     // Convert URI to blob
//     const response = await fetch(uri)
//     const blob = await response.blob()

//     // Create unique filename
//     const filename = `${user.uid}/${path}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
//     const storageRef = ref(storage, filename)

//     // Upload to Firebase Storage
//     await uploadBytes(storageRef, blob)

//     // Get download URL
//     const downloadURL = await getDownloadURL(storageRef)
//     return downloadURL
//   } catch (error: any) {
//     throw new Error(error.message || "Failed to upload image.")
//   }
// }

// export const deleteImage = async (url: string) => {
//   try {
//     // Extract path from URL
//     const urlParts = url.split("/")
//     const filename = urlParts[urlParts.length - 1]
//     const filePath = urlParts.slice(urlParts.indexOf("o") + 1).join("/").split("?")[0]
    
//     const storageRef = ref(storage, decodeURIComponent(filePath))
//     await deleteObject(storageRef)
//   } catch (error: any) {
//     console.error("Failed to delete image:", error)
//     // Don't throw error for image deletion failures
//   }
// }

// export const uploadProductImage = async (productId: string, imageUri: string) => {
//   try {
//     const url = await uploadImage(imageUri, `products/${productId}`)
//     return url
//   } catch (error: any) {
//     throw new Error(error.message || "Failed to upload product image.")
//   }
// }

// export const uploadShopLogo = async (imageUri: string) => {
//   try {
//     const user = auth.currentUser
//     if (!user) throw new Error("User not authenticated.")

//     const url = await uploadImage(imageUri, `shops/${user.uid}/logo`)
//     return url
//   } catch (error: any) {
//     throw new Error(error.message || "Failed to upload shop logo.")
//   }
// }







import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage, getAuthInstance } from "./firebase";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

/* ---------------- HELPERS ---------------- */

const auth = () => getAuthInstance();

/* ---------------- IMAGE PICKER ---------------- */

export const pickImage = async (): Promise<string | null> => {
  try {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        throw new Error("Media library permission is required.");
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error: any) {
    throw new Error(error.message || "Failed to pick image.");
  }
};

/* ---------------- UPLOAD ---------------- */

export const uploadImage = async (
  uri: string,
  path: string = "products"
): Promise<string> => {
  const user = auth().currentUser;
  if (!user) throw new Error("User not authenticated.");

  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const filename = `${user.uid}/${path}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.jpg`;

    const storageRef = ref(storage, filename);

    await uploadBytes(storageRef, blob);

    return await getDownloadURL(storageRef);
  } catch (error: any) {
    throw new Error(error.message || "Failed to upload image.");
  }
};

/* ---------------- DELETE ---------------- */

export const deleteImage = async (url: string) => {
  try {
    const decodedPath = decodeURIComponent(
      url.split("/o/")[1].split("?")[0]
    );

    const storageRef = ref(storage, decodedPath);
    await deleteObject(storageRef);
  } catch (error) {
    console.warn("Image delete failed (ignored)", error);
  }
};

/* ---------------- HELPERS ---------------- */

export const uploadProductImage = async (
  productId: string,
  imageUri: string
) => {
  return uploadImage(imageUri, `products/${productId}`);
};

export const uploadShopLogo = async (imageUri: string) => {
  const user = auth().currentUser;
  if (!user) throw new Error("User not authenticated.");

  return uploadImage(imageUri, `shops/${user.uid}/logo`);
};
