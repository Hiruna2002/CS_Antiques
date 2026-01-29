import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native"
import React, { useCallback, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useFocusEffect, useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { getAllProducts, deleteProduct, searchProducts } from "@/services/productServices"
import { Product } from "@/types/product"

const Products = () => {
  const router = useRouter()
  const { showLoader, hideLoader } = useLoader()
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const fetchProducts = async (query = "") => {
    showLoader()
    try {
      let data: Product[]
      if (query.trim()) {
        data = await searchProducts(query)
      } else {
        data = await getAllProducts()
      }
      setProducts(data)
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch products")
    } finally {
      hideLoader()
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchProducts(searchQuery)
    }, [searchQuery])
  )

  const handleDelete = (id: string) => {
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
              await deleteProduct(id)
              fetchProducts(searchQuery)
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

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="p-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
          <MaterialIcons name="search" size={20} color="#6b7280" />
          <TextInput
            placeholder="Search products by name or category..."
            className="flex-1 ml-2 text-gray-800"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialIcons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Add Product Button */}
      <TouchableOpacity
        className="bg-amber-600 rounded-full shadow-lg absolute bottom-6 right-6 p-4 z-50"
        onPress={() => router.push("/products/form")}
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Products List */}
      <ScrollView className="flex-1 p-4">
        {products.length === 0 ? (
          <View className="items-center justify-center py-10">
            <MaterialIcons name="inventory" size={60} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-lg">No products found</Text>
          </View>
        ) : (
          products.map((product) => (
            <TouchableOpacity
              key={product.id}
              onPress={() => router.push(`/products/${product.id}`)}
              className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 shadow-sm"
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </Text>
                  <Text className="text-gray-600 text-sm mb-1">
                    {product.category}
                  </Text>
                  <Text className="text-amber-700 font-bold">
                    {formatPrice(product.price)}
                  </Text>
                </View>
                <View className="items-end">
                  <View className={`px-2 py-1 rounded-full ${product.stock < 10 ? "bg-red-100" : "bg-green-100"}`}>
                    <Text className={`text-sm font-medium ${product.stock < 10 ? "text-red-800" : "text-green-800"}`}>
                      Stock: {product.stock}
                    </Text>
                  </View>
                  <Text className="text-gray-500 text-xs mt-1">
                    Added: {new Date(product.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {product.description ? (
                <Text className="text-gray-700 mb-3" numberOfLines={2}>
                  {product.description}
                </Text>
              ) : null}

              <View className="flex-row justify-end space-x-2">
                <TouchableOpacity
                  onPress={() => router.push(`/products/form?productId=${product.id}`)}
                  className="bg-blue-500 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white font-medium">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(product.id)}
                  className="bg-red-500 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white font-medium">Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default Products