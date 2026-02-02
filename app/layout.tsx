import { Slot, Stack } from "expo-router"
import React, { useEffect } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { LoaderProvider } from "@/context/LoaderContext"
import { AuthProvider } from "@/context/AuthContext"
import { getAuthInstance } from '../services/firebase';
import { cssInterop } from "react-native-css-interop";
import "../global.css"
import Cart from "./(user)/(tabs)/cart"
import { CartProvider } from "@/context/CartContext"


export default function RootLayout() {
  useEffect(() => {
    try { getAuthInstance(); } catch (e) { console.warn('Auth init failed', e); }
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <SafeAreaProvider>
      <LoaderProvider>
        <AuthProvider>
          <CartProvider>
            <Slot />
          </CartProvider>
        </AuthProvider>
      </LoaderProvider>
    </SafeAreaProvider>
    </Stack>
    
  )
}

// // export default RootLayout





// import { Slot, Stack } from "expo-router";
// import React, { useEffect } from "react";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { LoaderProvider } from "@/context/LoaderContext";
// import { AuthProvider } from "@/context/AuthContext";
// import { CartProvider } from "@/context/CartContext"; // Add this import (your CartContext file)
// import { getAuthInstance } from '@/services/firebase'; // Your path
// import "../global.css";

// // NativeWind v4 setup (if you're using it)
// import { cssInterop } from "react-native-css-interop";
// import { View, Text, Image, TouchableOpacity, Pressable, ScrollView } from "react-native";

// cssInterop(View, { className: "style" });
// cssInterop(Text, { className: "style" });
// cssInterop(Image, { className: "style" });
// cssInterop(TouchableOpacity, { className: "style" });
// cssInterop(Pressable, { className: "style" });
// cssInterop(ScrollView, { className: "style" });

// export default function RootLayout() {
//   useEffect(() => {
//     try {
//       getAuthInstance(); // Firebase auth init
//     } catch (e) {
//       console.warn('Auth init failed', e);
//     }
//   }, []);

//   return (
//     <SafeAreaProvider>
//       <LoaderProvider>
//         <AuthProvider>
//           <CartProvider> {/* Add this wrapper for cart state */}
//             <Stack>
//               {/* Auth routes - no header */}
//               <Stack.Screen name="(auth)" options={{ headerShown: false }} />

//               {/* User routes - no header */}
//               <Stack.Screen name="(user)" options={{ headerShown: false }} />

//               {/* Optional: other root-level routes */}
//               <Stack.Screen name="index" options={{ headerShown: false }} />

//               {/* Slot for dynamic rendering */}
//               <Slot />
//             </Stack>
//           </CartProvider>
//         </AuthProvider>
//       </LoaderProvider>
//     </SafeAreaProvider>
//   );
// }





// import { AuthProvider } from "@/context/AuthContext";
// import { CartProvider } from "@/context/CartContext";
// import { LoaderProvider } from "@/context/LoaderContext";
// import { getAuthInstance } from '@/services/firebase';
// import { Slot, Stack } from "expo-router";
// import React, { useEffect } from "react";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import "../global.css";

// // NativeWind v4 cssInterop setup
// import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
// import { cssInterop } from "react-native-css-interop";

// cssInterop(View, { className: "style" });
// cssInterop(Text, { className: "style" });
// cssInterop(Image, { className: "style" });
// cssInterop(TouchableOpacity, { className: "style" });
// cssInterop(Pressable, { className: "style" });
// cssInterop(ScrollView, { className: "style" });

// export default function RootLayout() {
//   useEffect(() => {
//     try {
//       getAuthInstance();
//     } catch (e) {
//       console.warn('Auth init failed', e);
//     }
//   }, []);

//   return (
//     <SafeAreaProvider>
//       <CartProvider>
//         <LoaderProvider>
//           <AuthProvider>
//             <Stack>
//               {/* Auth routes */}
//               <Stack.Screen name="(auth)" options={{ headerShown: false }} />

//               {/* User routes */}
//               <Stack.Screen name="(user)" options={{ headerShown: false }} />

//               {/* Optional index */}
//               <Stack.Screen name="index" options={{ headerShown: false }} />

//               {/* Slot for dynamic pages */}
//               <Slot />
//             </Stack>
//           </AuthProvider>
//         </LoaderProvider>
//       </CartProvider>
//     </SafeAreaProvider>
//   );
// }