import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  TouchableOpacity,
  Alert,
  Image
} from "react-native"
import React, { useEffect, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { addProduct, getProductById, updateProduct, uploadImage } from "@/services/productServices"
import { getAllCategories } from "@/services/categoryService"
import { Category } from "@/types/category"
import * as ImagePicker from 'expo-image-picker'

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

  const [image, setImage] = useState<string | null>(null) // local uri
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined) // stored download URL
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchCategories()
    if (productId) {
      fetchProduct(productId as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission denied", "We need permission to access your gallery")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled) {
        const uri = result.assets[0].uri
        setImage(uri)
      }
    } catch (err: any) {
      console.error("pickImage error", err)
      Alert.alert("Error", "Could not pick image")
    }
  }

  const handleSubmit = async () => {
    // validation
    if (!name.trim() || !price.trim() || !stock.trim() || !category.trim()) {
      Alert.alert("Error", "Please fill all required fields")
      return
    }

    const priceNum = parseFloat(price)
    const stockNum = parseInt(stock, 10)
    
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
      // ensure image upload (if user selected a local image)
      let finalImageUrl = imageUrl

      if (image) {
        setUploading(true)
        try {
          const uploadedUrl = await uploadImage(image) // uploadImage must return the download URL
          finalImageUrl = uploadedUrl
          setImageUrl(uploadedUrl)
        } catch (err: any) {
          console.error("Image upload failed", err)
          Alert.alert("Upload failed", err.message || "Could not upload image")
          // decide: continue without image or abort. Here we abort save.
          return
        } finally {
          setUploading(false)
        }
      }

      const payload = {
        name,
        description,
        price: priceNum,
        stock: stockNum,
        category,
        condition,
        imageUrl: finalImageUrl
      }

      if (productId) {
        await updateProduct(productId as string, payload)
        Alert.alert("Success", "Product updated successfully")
      } else {
        await addProduct(payload)
        Alert.alert("Success", "Product added successfully")
      }

      router.back()
    } catch (error: any) {
      console.error("handleSubmit error", error)
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
            <Text className="text-gray-800 font-semibold mb-2">Price (Rs.) *</Text>
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

        <Text className="text-gray-800 font-semibold mb-2">Product Image (Optional)</Text>
        <TouchableOpacity
          onPress={pickImage}
          className="bg-gray-50 p-4 rounded-xl border border-gray-200 items-center mb-4"
        >
          {image || imageUrl ? (
            <Image source={{ uri: image || imageUrl }} className="w-32 h-32 rounded-xl" resizeMode="cover" />
          ) : (
            <MaterialIcons name="add-photo-alternate" size={48} color="#9CA3AF" />
          )}
          <Text className="mt-2 text-gray-600">Tap to select image</Text>
        </TouchableOpacity>

        <Pressable
          className={`bg-amber-600 px-6 py-4 rounded-2xl ${isLoading || uploading ? "opacity-70" : ""}`}
          onPress={handleSubmit}
          disabled={isLoading || uploading}
        >
          <Text className="text-white text-lg text-center font-semibold">
            {isLoading || uploading ? "Please wait..." : (productId ? "Update Product" : "Add Product")}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default ProductForm

