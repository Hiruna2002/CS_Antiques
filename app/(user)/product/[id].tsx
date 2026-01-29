// import {
//   View,
//   Text,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator
// } from "react-native"
// import React, { useEffect, useState } from "react"
// import { MaterialIcons } from "@expo/vector-icons"
// import { useLocalSearchParams, useRouter } from "expo-router"
// import { useCart } from "@/context/CartContext"
// import { useLoader } from "@/hooks/useLoader"
// import { getProductById } from "@/services/productServices"
// import { Product } from "@/types/product"

// const ProductDetail = () => {
//   const router = useRouter()
//   const { id } = useLocalSearchParams()
//   const { addToCart } = useCart()
//   const { showLoader, hideLoader } = useLoader()
  
//   const [product, setProduct] = useState<Product | null>(null)
//   const [quantity, setQuantity] = useState(1)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     if (id) {
//       fetchProduct(id as string)
//     }
//   }, [id])

//   const fetchProduct = async (productId: string) => {
//     setLoading(true)
//     try {
//       const data = await getProductById(productId)
//       setProduct(data)
//     } catch (error: any) {
//       Alert.alert("Error", error.message || "Failed to load product")
//       router.back()
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleAddToCart = () => {
//     if (!product) return
    
//     if (product.stock < quantity) {
//       Alert.alert("Insufficient Stock", `Only ${product.stock} items available`)
//       return
//     }
    
//     addToCart(product, quantity)
//     Alert.alert("Success", `${quantity} × ${product.name} added to cart!`)
//   }

//   const handleBuyNow = () => {
//     if (!product) return
    
//     if (product.stock < quantity) {
//       Alert.alert("Insufficient Stock", `Only ${product.stock} items available`)
//       return
//     }
    
//     addToCart(product, quantity)
//     router.push("/user/checkout")
//   }

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD"
//     }).format(price)
//   }

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <ActivityIndicator size="large" color="#b45309" />
//       </View>
//     )
//   }

//   if (!product) {
//     return null
//   }

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="bg-white p-4 border-b border-gray-200 flex-row items-center">
//         <TouchableOpacity onPress={() => router.back()} className="mr-4">
//           <MaterialIcons name="arrow-back" size={24} color="#374151" />
//         </TouchableOpacity>
//         <Text className="text-xl font-bold text-gray-900 flex-1">
//           Product Details
//         </Text>
//         <TouchableOpacity onPress={() => router.push("/user/cart")}>
//           <MaterialIcons name="shopping-cart" size={24} color="#374151" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView>
//         {/* Product Image */}
//         <View className="bg-white p-4">
//           {product.imageUrl ? (
//             <Image
//               source={{ uri: product.imageUrl }}
//               className="w-full h-80 rounded-xl"
//               resizeMode="cover"
//             />
//           ) : (
//             <View className="w-full h-80 bg-gray-200 rounded-xl items-center justify-center">
//               <MaterialIcons name="photo" size={60} color="#9ca3af" />
//               <Text className="text-gray-500 mt-2">No Image Available</Text>
//             </View>
//           )}
//         </View>

//         {/* Product Info */}
//         <View className="bg-white rounded-2xl mx-4 mt-4 p-6 border border-gray-200">
//           <Text className="text-2xl font-bold text-gray-900 mb-2">
//             {product.name}
//           </Text>
          
//           <View className="flex-row items-center mb-4">
//             <View className={`px-3 py-1 rounded-full ${
//               product.stock > 20 ? "bg-green-100" : 
//               product.stock > 10 ? "bg-yellow-100" : 
//               "bg-red-100"
//             }`}>
//               <Text className={`font-semibold ${
//                 product.stock > 20 ? "text-green-800" : 
//                 product.stock > 10 ? "text-yellow-800" : 
//                 "text-red-800"
//               }`}>
//                 {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
//               </Text>
//             </View>
//             <Text className="text-gray-500 ml-4">{product.category}</Text>
//           </View>

//           <Text className="text-amber-700 text-3xl font-bold mb-6">
//             {formatPrice(product.price)}
//           </Text>

//           <View className="mb-6">
//             <Text className="text-gray-800 font-semibold mb-2">Condition</Text>
//             <Text className="text-gray-600 bg-gray-100 p-3 rounded-lg">
//               {product.condition}
//             </Text>
//           </View>

//           {product.description && (
//             <View className="mb-6">
//               <Text className="text-gray-800 font-semibold mb-2">Description</Text>
//               <Text className="text-gray-700 bg-gray-100 p-3 rounded-lg">
//                 {product.description}
//               </Text>
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* Bottom Action Bar */}
//       <View className="bg-white border-t border-gray-200 p-4">
//         {/* Quantity Selector */}
//         <View className="flex-row items-center justify-between mb-4">
//           <Text className="text-gray-800 font-semibold">Quantity</Text>
//           <View className="flex-row items-center bg-gray-100 rounded-lg">
//             <TouchableOpacity
//               onPress={() => setQuantity(Math.max(1, quantity - 1))}
//               className="px-4 py-2"
//               disabled={quantity <= 1}
//             >
//               <MaterialIcons 
//                 name="remove" 
//                 size={20} 
//                 color={quantity <= 1 ? "#9ca3af" : "#374151"} 
//               />
//             </TouchableOpacity>
            
//             <Text className="px-4 py-2 font-semibold text-gray-900">
//               {quantity}
//             </Text>
            
//             <TouchableOpacity
//               onPress={() => setQuantity(quantity + 1)}
//               className="px-4 py-2"
//               disabled={quantity >= product.stock}
//             >
//               <MaterialIcons 
//                 name="add" 
//                 size={20} 
//                 color={quantity >= product.stock ? "#9ca3af" : "#374151"} 
//               />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Action Buttons */}
//         <View className="flex-row space-x-3">
//           <TouchableOpacity
//             onPress={handleAddToCart}
//             disabled={product.stock === 0}
//             className={`flex-1 py-3 rounded-lg ${
//               product.stock === 0 ? "bg-gray-300" : "bg-amber-600"
//             }`}
//           >
//             <Text className={`text-center font-semibold ${
//               product.stock === 0 ? "text-gray-600" : "text-white"
//             }`}>
//               Add to Cart
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             onPress={handleBuyNow}
//             disabled={product.stock === 0}
//             className={`flex-1 py-3 rounded-lg ${
//               product.stock === 0 ? "bg-gray-300" : "bg-amber-900"
//             }`}
//           >
//             <Text className={`text-center font-semibold ${
//               product.stock === 0 ? "text-gray-600" : "text-white"
//             }`}>
//               Buy Now
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   )
// }

// export default ProductDetail