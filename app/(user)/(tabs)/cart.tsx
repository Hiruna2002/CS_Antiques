// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Alert
// } from "react-native"
// import React from "react"
// import { MaterialIcons } from "@expo/vector-icons"
// import { useRouter } from "expo-router"
// import { useCart } from "@/context/CartContext"

// const Cart = () => {
//   const router = useRouter()
//   const { 
//     cartItems, 
//     removeFromCart, 
//     updateQuantity, 
//     clearCart, 
//     getTotalPrice,
//     getTotalItems 
//   } = useCart()

//   const handleUpdateQuantity = (productId: string, newQuantity: number) => {
//     if (newQuantity < 1) {
//       removeFromCart(productId)
//     } else {
//       updateQuantity(productId, newQuantity)
//     }
//   }

//   const handleCheckout = () => {
//     if (cartItems.length === 0) {
//       Alert.alert("Cart Empty", "Add items to cart before checkout")
//       return
//     }
//     // router.push("/user/checkout")
//   }

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD"
//     }).format(price)
//   }

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
//         <Text className="text-2xl font-bold text-amber-900">Shopping Cart</Text>
//         <Text className="text-gray-600">
//           {getTotalItems()} item{getTotalItems() !== 1 ? "s" : ""} in cart
//         </Text>
//       </View>

//       {cartItems.length === 0 ? (
//         <View className="flex-1 items-center justify-center">
//           <MaterialIcons name="shopping-cart" size={80} color="#d1d5db" />
//           <Text className="text-gray-500 text-lg mt-4">Your cart is empty</Text>
//           <TouchableOpacity
//             onPress={() => router.push("/userHome")}
//             className="mt-6 bg-amber-600 px-6 py-3 rounded-lg"
//           >
//             <Text className="text-white font-semibold">Browse Products</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <>
//           {/* Cart Items */}
//           <ScrollView className="flex-1 p-4">
//             {cartItems.map((item) => (
//               <View
//                 key={item.product.id}
//                 className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 shadow-sm"
//               >
//                 <View className="flex-row">
//                   {/* Product Image */}
//                   <View className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mr-4">
//                     {item.product.imageUrl ? (
//                       <Image
//                         source={{ uri: item.product.imageUrl }}
//                         className="w-full h-full"
//                         resizeMode="cover"
//                       />
//                     ) : (
//                       <View className="flex-1 items-center justify-center">
//                         <MaterialIcons name="photo" size={24} color="#9ca3af" />
//                       </View>
//                     )}
//                   </View>

//                   {/* Product Info */}
//                   <View className="flex-1">
//                     <Text className="text-gray-900 font-semibold text-lg">
//                       {item.product.name}
//                     </Text>
//                     <Text className="text-gray-600 text-sm mb-2">
//                       {item.product.category}
//                     </Text>
//                     <Text className="text-amber-700 font-bold">
//                       {formatPrice(item.product.price)}
//                     </Text>
//                   </View>

//                   {/* Remove Button */}
//                   <TouchableOpacity
//                     onPress={() => removeFromCart(item.product.id)}
//                     className="ml-2"
//                   >
//                     <MaterialIcons name="close" size={24} color="#ef4444" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Quantity Controls */}
//                 <View className="flex-row items-center justify-between mt-4">
//                   <View className="flex-row items-center bg-gray-100 rounded-lg">
//                     <TouchableOpacity
//                       onPress={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
//                       className="px-4 py-2"
//                     >
//                       <MaterialIcons name="remove" size={20} color="#374151" />
//                     </TouchableOpacity>
                    
//                     <Text className="px-4 py-2 font-semibold text-gray-900">
//                       {item.quantity}
//                     </Text>
                    
//                     <TouchableOpacity
//                       onPress={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
//                       className="px-4 py-2"
//                     >
//                       <MaterialIcons name="add" size={20} color="#374151" />
//                     </TouchableOpacity>
//                   </View>

//                   <Text className="font-bold text-gray-900">
//                     {formatPrice(item.product.price * item.quantity)}
//                   </Text>
//                 </View>
//               </View>
//             ))}
//           </ScrollView>

//           {/* Checkout Summary */}
//           <View className="bg-white border-t border-gray-200 p-6">
//             <View className="flex-row justify-between mb-4">
//               <Text className="text-gray-600">Subtotal</Text>
//               <Text className="font-semibold">{formatPrice(getTotalPrice())}</Text>
//             </View>
//             <View className="flex-row justify-between mb-4">
//               <Text className="text-gray-600">Shipping</Text>
//               <Text className="font-semibold">$5.00</Text>
//             </View>
//             <View className="flex-row justify-between mb-6">
//               <Text className="text-gray-600">Tax</Text>
//               <Text className="font-semibold">
//                 {formatPrice(getTotalPrice() * 0.08)}
//               </Text>
//             </View>
            
//             <View className="border-t border-gray-200 pt-4 mb-6">
//               <View className="flex-row justify-between">
//                 <Text className="text-lg font-bold text-gray-900">Total</Text>
//                 <Text className="text-lg font-bold text-amber-700">
//                   {formatPrice(getTotalPrice() + 5 + (getTotalPrice() * 0.08))}
//                 </Text>
//               </View>
//             </View>

//             {/* Action Buttons */}
//             <View className="flex-row space-x-3">
//               <TouchableOpacity
//                 onPress={clearCart}
//                 className="flex-1 border border-gray-300 py-3 rounded-lg"
//               >
//                 <Text className="text-gray-700 text-center font-medium">
//                   Clear Cart
//                 </Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 onPress={handleCheckout}
//                 className="flex-1 bg-amber-600 py-3 rounded-lg"
//               >
//                 <Text className="text-white text-center font-semibold">
//                   Checkout
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </>
//       )}
//       {/* Fixed Footer Bar at bottom */}
//                   <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 px-1 py-2">
//                     <View className="flex-row">
//                       {menuItems.map((item) => (
//                         <TouchableOpacity
//                           key={item.id}
//                           onPress={() => router.push(item.route)}
//                           className="flex-1 items-center py-1"
//                         >
//                           <MaterialIcons
//                             name={item.icon}
//                             size={32}
//                             color={isActive(item.route) ? "#b45309" : "#4b5563"}
//                           />
//                           <Text
//                             className={`text-[10px] mt-1 ${
//                               isActive(item.route) ? "text-amber-700" : "text-gray-500"
//                             }`}
//                           >
//                             {item.name}
//                           </Text>
//                         </TouchableOpacity>
//                       ))}
//                     </View>
//                   </View>
//     </View>
//   )
// }

// export default Cart