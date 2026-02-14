import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from "react-native"
import React, { use, useEffect, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useRouter, usePathname } from "expo-router"
import { useCart } from "@/context/CartContext"
import { getCartItems } from "@/services/cartService"
import {Carts} from "@/types/cart"

const Cart = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [items, setItems] = React.useState<any[]>([])
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice,
    getTotalItems 
  } = useCart()

  const [finalPrice, setFinalPrice] = useState(0)

  const [filteredItems, setFilteredItems] = useState<Carts[]>([])
  const [quantity, setQuantity] = useState(1)

  const fetchProducts = async () => {
    try {
      const data = await getCartItems()
      console.log("Fetched cart items:", data)
      setItems(data)
      setFilteredItems(data)

    } catch (error) {
      console.error("Error fetching cart items:", error)
    }
  } 

  const calculateFinalPrice = async () => {
    const data = await getCartItems()
    let price = 0
    for (let i = 0; i < data.length; i++) {
      price += data[i].price * quantity
    }
    setFinalPrice(price)
  }

  useEffect(() => {
    fetchProducts()
    calculateFinalPrice()
  }, [])

  const handleCheckout = async () => {
    const data = await getCartItems()
    if (data.length === 0) {
      Alert.alert("Cart Empty", "Add items to cart before checkout")
      return
    }
    // router.push(`/checkout?total=${finalPrice}&quantity=${quantity}&productId=${id}`)}
    // router.push({pathname: "/checkout/orderDetail", 
    //             params: {
    //               total: finalPrice.toString(),
    //               items: JSON.stringify(items)
    //             }
    //           })
    const checkoutItems = data.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.price
  }))

  const total = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  router.push({
    pathname: "/checkout/orderDetail",
    params: {
      total: total.toString(),
      items: JSON.stringify(checkoutItems)
    }
  })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
      .format(price)
      .replace("LKR", "Rs.");
  }

  const menuItems = [
      { id: 1, name: "For You", icon: "home", route: "/userHome" },
      { id: 2, name: "Cart", icon: "shopping-cart", route: "/cart" },
      { id: 3, name: "Add", icon: "add", route: "/product" },
      { id: 4, name: "Orders", icon: "receipt", route: "/orders" },
      { id: 5, name: "Profile", icon: "person", route: "/profile" },
    ] as const;
  
    const isActive = (route: string) => pathname === route

    console.log("Cart Items:", cartItems)
    
    console.log("Filtered Cart Items:", filteredItems)
  

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-amber-900">Shopping Cart</Text>
        <Text className="text-gray-600">
          {getTotalItems()} item{getTotalItems() !== 1 ? "s" : ""} in cart
        </Text>
      </View>
      {/* <ScrollView className="flex-1"> */}
        {filteredItems.length === 0 ? (
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
              {filteredItems.map((item) => (
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
                        // onPress={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2"
                      >
                        <MaterialIcons name="remove" size={20} color="#374151" />
                      </TouchableOpacity>
                      
                      <Text className="px-4 py-2 font-semibold text-gray-900">
                        {/* {item.quantity} */}
                        {quantity}
                      </Text>
                      
                      <TouchableOpacity
                        // onPress={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        onPress={() => setQuantity(quantity + 1)}
                        className="px-4 py-2"
                      >
                        <MaterialIcons name="add" size={20} color="#374151" />
                      </TouchableOpacity>
                    </View>

                    <Text className="font-bold text-gray-900">
                      {formatPrice(item.price * quantity)}
                      {/* {formatPrice(finalPrice)} */}
                      {/* {finalPrice} */}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Checkout Summary */}
            <View className="bg-white border-t border-gray-200 p-6">              
              <View className="mb-6">
                <View className="flex-row justify-between">
                  <Text className="text-lg font-bold text-gray-900">Total</Text>
                  <Text className="text-lg font-bold text-amber-700">
                    {formatPrice(finalPrice)}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row space-x-3 mb-20 ">
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
      {/* </ScrollView> */}
      
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
