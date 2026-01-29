import { Slot, Stack } from "expo-router"
import React, { useEffect } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { LoaderProvider } from "@/context/LoaderContext"
import { AuthProvider } from "@/context/AuthContext"
import { getAuthInstance } from '../services/firebase';
import { cssInterop } from "react-native-css-interop";
import "../global.css"


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
          <Slot />
        </AuthProvider>
      </LoaderProvider>
    </SafeAreaProvider>
    </Stack>
    
  )
}

// export default RootLayout