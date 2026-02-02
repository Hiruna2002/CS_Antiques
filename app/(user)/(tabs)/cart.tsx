import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from "react-native"
import React from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useRouter, usePathname } from "expo-router"
import { useCart } from "@/context/CartContext"

const Cart = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice,
    getTotalItems 
  } = useCart()

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart Empty", "Add items to cart before checkout")
      return
    }
    // router.push("/user/checkout")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price)
  }

  const menuItems = [
      { id: 1, name: "For You", icon: "home", route: "/userHome" },
      { id: 2, name: "Cart", icon: "shopping-cart", route: "/cart" },
      { id: 3, name: "Add", icon: "add", route: "/product" },
      { id: 4, name: "Orders", icon: "receipt", route: "/orders" },
      { id: 5, name: "Profile", icon: "person", route: "/profile" },
    ] as const;
  
    const isActive = (route: string) => pathname === route

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-amber-900">Shopping Cart</Text>
        <Text className="text-gray-600">
          {getTotalItems()} item{getTotalItems() !== 1 ? "s" : ""} in cart
        </Text>
      </View>

      {cartItems.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <MaterialIcons name="shopping-cart" size={80} color="#d1d5db" />
          <Text className="text-gray-500 text-lg mt-4">Your cart is empty</Text>
          <TouchableOpacity
            onPress={() => router.push("/userHome")}
            className="mt-6 bg-amber-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Cart Items */}
          <ScrollView className="flex-1 p-4">
            {cartItems.map((item) => (
              <View
                key={item.productId}
                className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 shadow-sm"
              >
                <View className="flex-row">
                  {/* Product Image */}
                  <View className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mr-4">
                    {item.imageUrl ? (
                      <Image
                        source={{ uri: item.imageUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="flex-1 items-center justify-center">
                        <MaterialIcons name="photo" size={24} color="#9ca3af" />
                      </View>
                    )}
                  </View>

                  {/* Product Info */}
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold text-lg">
                      {item.name}
                    </Text>
                    <Text className="text-gray-600 text-sm mb-2">
                      {item.category}
                    </Text>
                    <Text className="text-amber-700 font-bold">
                      {formatPrice(item.price)}
                    </Text>
                  </View>

                  {/* Remove Button */}
                  <TouchableOpacity
                    onPress={() => removeFromCart(item.productId)}
                    className="ml-2"
                  >
                    <MaterialIcons name="close" size={24} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                {/* Quantity Controls */}
                <View className="flex-row items-center justify-between mt-4">
                  <View className="flex-row items-center bg-gray-100 rounded-lg">
                    <TouchableOpacity
                      onPress={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      className="px-4 py-2"
                    >
                      <MaterialIcons name="remove" size={20} color="#374151" />
                    </TouchableOpacity>
                    
                    <Text className="px-4 py-2 font-semibold text-gray-900">
                      {item.quantity}
                    </Text>
                    
                    <TouchableOpacity
                      onPress={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      className="px-4 py-2"
                    >
                      <MaterialIcons name="add" size={20} color="#374151" />
                    </TouchableOpacity>
                  </View>

                  <Text className="font-bold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Checkout Summary */}
          <View className="bg-white border-t border-gray-200 p-6">
            <View className="flex-row justify-between mb-4">
              <Text className="text-gray-600">Subtotal</Text>
              <Text className="font-semibold">{formatPrice(getTotalPrice())}</Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text className="text-gray-600">Shipping</Text>
              <Text className="font-semibold">$5.00</Text>
            </View>
            <View className="flex-row justify-between mb-6">
              <Text className="text-gray-600">Tax</Text>
              <Text className="font-semibold">
                {formatPrice(getTotalPrice() * 0.08)}
              </Text>
            </View>
            
            <View className="border-t border-gray-200 pt-4 mb-6">
              <View className="flex-row justify-between">
                <Text className="text-lg font-bold text-gray-900">Total</Text>
                <Text className="text-lg font-bold text-amber-700">
                  {formatPrice(getTotalPrice() + 5 + (getTotalPrice() * 0.08))}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={clearCart}
                className="flex-1 border border-gray-300 py-3 rounded-lg"
              >
                <Text className="text-gray-700 text-center font-medium">
                  Clear Cart
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleCheckout}
                className="flex-1 bg-amber-600 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-semibold">
                  Checkout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      
      {/* Fixed Footer Bar at bottom */}
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 px-1 py-2">
            <View className="flex-row">
                {menuItems.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    onPress={() => router.push(item.route)}
                    className="flex-1 items-center py-1"
                >
                    <MaterialIcons
                    name={item.icon}
                    size={32}
                    color={isActive(item.route) ? "#b45309" : "#4b5563"}
                    />
                    <Text
                    className={`text-[10px] mt-1 ${
                        isActive(item.route) ? "text-amber-700" : "text-gray-500"
                    }`}
                    >
                    {item.name}
                    </Text>
                </TouchableOpacity>
                ))}
            </View>
        </View>
    </View>
  )
}

export default Cart







// import { View, Text, FlatList, TouchableOpacity, Image, Alert, Pressable } from "react-native";
// import { useCart } from "@/context/CartContext";
// import { useRouter } from "expo-router";

// const Cart = () => {
//   const { cart, increaseQty, decreaseQty, removeFromCart, totalItems, totalPrice } = useCart();
//   const router = useRouter();

//   if (totalItems === 0) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <Text className="text-xl text-gray-600">Your cart is empty</Text>
//         <TouchableOpacity
//           onPress={() => router.back()}
//           className="mt-4 bg-amber-600 py-3 px-6 rounded-xl"
//         >
//           <Text className="text-white font-bold">Continue Shopping</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-50 p-4">
//       <Text className="text-2xl font-bold mb-4">Your Cart ({totalItems} items)</Text>

//       <FlatList
//         data={cart}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => (
//           <View className="flex-row bg-white rounded-xl p-4 mb-4 shadow-sm">
//             <Image
//               source={{ uri: item.imageUrl }}
//               className="w-20 h-20 rounded-lg mr-4"
//               resizeMode="cover"
//             />
//             <View className="flex-1">
//               <Text className="font-semibold text-gray-900">{item.name}</Text>
//               <Text className="text-amber-600 font-bold">Rs. {item.price * item.qty}</Text>

//               <View className="flex-row items-center mt-2">
//                 <TouchableOpacity
//                   onPress={() => decreaseQty(item.id)}
//                   className="bg-gray-200 px-3 py-1 rounded-l-lg"
//                 >
//                   <Text className="text-lg">-</Text>
//                 </TouchableOpacity>
//                 <Text className="px-4 py-1 bg-gray-100">{item.qty}</Text>
//                 <TouchableOpacity
//                   onPress={() => increaseQty(item.id)}
//                   className="bg-gray-200 px-3 py-1 rounded-r-lg"
//                 >
//                   <Text className="text-lg">+</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             <TouchableOpacity
//               onPress={() => removeFromCart(item.id)}
//               className="ml-4 justify-center"
//             >
//               <Text className="text-red-500 font-bold">Remove</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       />

//       <View className="bg-white p-4 rounded-xl mt-auto shadow-sm">
//         <View className="flex-row justify-between mb-2">
//           <Text className="text-lg font-semibold">Total</Text>
//           <Text className="text-lg font-bold text-amber-600">Rs. {totalPrice}</Text>
//         </View>

//         <Pressable
//           onPress={() => router.push("/place-order")}
//           className="bg-green-600 py-4 rounded-xl items-center"
//         >
//           <Text className="text-white font-bold text-lg">Place Order</Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// };

// export default Cart;