import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  TouchableOpacity,
  Alert
} from "react-native"
import React, { useEffect, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { addProduct, getProductById, updateProduct } from "@/services/productServices"
import { getAllCategories } from "@/services/categoryService"
import { Category } from "@/types/category"

const ProductForm = () => {
  const router = useRouter()
  const { productId } = useLocalSearchParams()
  const { showLoader, hideLoader, isLoading } = useLoader()
  
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [category, setCategory] = useState("")
  const [condition, setCondition] = useState("Good")
  const [categories, setCategories] = useState<Category[]>([])
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    fetchCategories()
    if (productId) {
      fetchProduct(productId as string)
    }
  }, [productId])

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories()
      setCategories(data)
      if (data.length > 0 && !category) {
        setCategory(data[0].name)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchProduct = async (id: string) => {
    showLoader()
    try {
      const product = await getProductById(id)
      setName(product.name)
      setDescription(product.description)
      setPrice(product.price.toString())
      setStock(product.stock.toString())
      setCategory(product.category)
      setCondition(product.condition)
      setImageUrl(product.imageUrl || "")
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load product")
    } finally {
      hideLoader()
    }
  }

  const handleSubmit = async () => {
    if (!name.trim() || !price.trim() || !stock.trim() || !category.trim()) {
      Alert.alert("Error", "Please fill all required fields")
      return
    }

    const priceNum = parseFloat(price)
    const stockNum = parseInt(stock)
    
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Error", "Please enter a valid price")
      return
    }
    
    if (isNaN(stockNum) || stockNum < 0) {
      Alert.alert("Error", "Please enter a valid stock quantity")
      return
    }

    showLoader()
    try {
      if (productId) {
        await updateProduct(productId as string, {
          name,
          description,
          price: priceNum,
          stock: stockNum,
          category,
          condition,
          imageUrl
        })
        Alert.alert("Success", "Product updated successfully")
      } else {
        await addProduct({
          name,
          description,
          price: priceNum,
          stock: stockNum,
          category,
          condition,
          imageUrl
        })
        Alert.alert("Success", "Product added successfully")
      }
      router.back()
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong")
    } finally {
      hideLoader()
    }
  }

  const conditions = ["Excellent", "Very Good", "Good", "Fair", "Poor"]

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <TouchableOpacity
        className="flex-row items-center mb-6"
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back-ios" size={24} color="#374151" />
        <Text className="text-gray-800 font-medium ml-1">Back</Text>
      </TouchableOpacity>

      <View className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <Text className="text-2xl font-bold text-amber-900 mb-6">
          {productId ? "Edit Product" : "Add New Product"}
        </Text>

        <Text className="text-gray-800 font-semibold mb-2">Product Name *</Text>
        <TextInput
          placeholder="Enter product name"
          className="border border-gray-300 bg-white p-3 mb-4 rounded-xl"
          value={name}
          onChangeText={setName}
        />

        <Text className="text-gray-800 font-semibold mb-2">Description</Text>
        <TextInput
          placeholder="Enter product description"
          className="border border-gray-300 bg-white p-3 mb-4 rounded-xl h-24"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <View className="flex-row space-x-4 mb-4">
          <View className="flex-1">
            <Text className="text-gray-800 font-semibold mb-2">Price ($) *</Text>
            <TextInput
              placeholder="0.00"
              className="border border-gray-300 bg-white p-3 rounded-xl"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>
          <View className="flex-1">
            <Text className="text-gray-800 font-semibold mb-2">Stock *</Text>
            <TextInput
              placeholder="0"
              className="border border-gray-300 bg-white p-3 rounded-xl"
              value={stock}
              onChangeText={setStock}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <Text className="text-gray-800 font-semibold mb-2">Category *</Text>
        <View className="border border-gray-300 bg-white rounded-xl mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-2">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategory(cat.name)}
                className={`px-4 py-2 mr-2 rounded-lg ${category === cat.name ? "bg-amber-600" : "bg-gray-100"}`}
              >
                <Text className={category === cat.name ? "text-white font-medium" : "text-gray-800"}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text className="text-gray-800 font-semibold mb-2">Condition</Text>
        <View className="flex-row flex-wrap mb-6">
          {conditions.map((cond) => (
            <TouchableOpacity
              key={cond}
              onPress={() => setCondition(cond)}
              className={`px-4 py-2 mr-2 mb-2 rounded-lg ${condition === cond ? "bg-amber-600" : "bg-gray-100"}`}
            >
              <Text className={condition === cond ? "text-white font-medium" : "text-gray-800"}>
                {cond}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-gray-800 font-semibold mb-2">Image URL (Optional)</Text>
        <TextInput
          placeholder="https://example.com/image.jpg"
          className="border border-gray-300 bg-white p-3 mb-6 rounded-xl"
          value={imageUrl}
          onChangeText={setImageUrl}
        />

        <Pressable
          className={`bg-amber-600 px-6 py-4 rounded-2xl ${isLoading ? "opacity-70" : ""}`}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text className="text-white text-lg text-center font-semibold">
            {isLoading ? "Please wait..." : (productId ? "Update Product" : "Add Product")}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default ProductForm