import { Stack } from "expo-router"
import React from "react"

const ProductsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="form" />
      <Stack.Screen name="[id]" />
    </Stack>
  )
}

export default ProductsLayout