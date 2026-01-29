import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from "react-native"
import React, { useEffect, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { getProductById, deleteProduct } from "@/services/productServices"
import { Product } from "@/types/product"

const ProductDetail = () => {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { showLoader, hideLoader } = useLoader()
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (id) {
      fetchProduct(id as string)
    }
  }, [id])

  const fetchProduct = async (productId: string) => {
    showLoader()
    try {
      const data = await getProductById(productId)
      setProduct(data)
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load product")
      router.back()
    } finally {
      hideLoader()
    }
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            showLoader()
            try {
              await deleteProduct(id as string)
              Alert.alert("Success", "Product deleted successfully")
              router.back()
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete")
            } finally {
              hideLoader()
            }
          }
        }
      ]
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price)
  }

  if (!product) {
    return null
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <MaterialIcons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Product Details</Text>
        <View className="flex-row ml-auto space-x-3">
          <TouchableOpacity
            onPress={() => router.push(`/products/form?productId=${id}`)}
            className="bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            className="bg-red-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Image */}
      <View className="bg-white p-4 mb-4">
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            className="w-full h-64 rounded-xl"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-64 bg-gray-200 rounded-xl items-center justify-center">
            <MaterialIcons name="photo" size={60} color="#9ca3af" />
            <Text className="text-gray-500 mt-2">No Image</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View className="bg-white rounded-2xl mx-4 p-6 border border-gray-200 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900 mb-2">{product.name}</Text>
        
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-amber-700 text-3xl font-bold">
            {formatPrice(product.price)}
          </Text>
          <View className={`px-3 py-1 rounded-full ${product.stock < 10 ? "bg-red-100" : "bg-green-100"}`}>
            <Text className={`font-semibold ${product.stock < 10 ? "text-red-800" : "text-green-800"}`}>
              Stock: {product.stock}
            </Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-800 font-semibold mb-1">Category</Text>
          <Text className="text-gray-600 bg-gray-100 p-3 rounded-lg">{product.category}</Text>
        </View>

        <View className="mb-6">
          <Text className="text-gray-800 font-semibold mb-1">Condition</Text>
          <Text className="text-gray-600 bg-gray-100 p-3 rounded-lg">{product.condition}</Text>
        </View>

        {product.description ? (
          <View className="mb-6">
            <Text className="text-gray-800 font-semibold mb-1">Description</Text>
            <Text className="text-gray-700 bg-gray-100 p-3 rounded-lg">
              {product.description}
            </Text>
          </View>
        ) : null}

        <View className="pt-4 border-t border-gray-200">
          <Text className="text-gray-500 text-sm">
            Added on: {new Date(product.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="p-4">
        <TouchableOpacity
          className="bg-amber-600 py-3 rounded-xl mb-3"
          onPress={() => Alert.alert("Info", "Order functionality would be implemented here")}
        >
          <Text className="text-white text-center text-lg font-semibold">Create Order</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-gray-200 py-3 rounded-xl"
          onPress={() => router.push("/products")}
        >
          <Text className="text-gray-800 text-center text-lg font-semibold">Back to Products</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default ProductDetail