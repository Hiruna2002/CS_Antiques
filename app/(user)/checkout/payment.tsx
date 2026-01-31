import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native"
import React, { useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useCart } from "@/context/CartContext"

const CheckoutPayment = () => {
  const router = useRouter()
  const { getTotalPrice, clearCart } = useCart()
  
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card")
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    if (paymentMethod === "cash") return true
    
    const newErrors: Record<string, string> = {}
    
    if (!cardDetails.cardNumber.trim() || cardDetails.cardNumber.length < 16) {
      newErrors.cardNumber = "Valid card number is required"
    }
    if (!cardDetails.cardName.trim()) {
      newErrors.cardName = "Cardholder name is required"
    }
    if (!cardDetails.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required"
    }
    if (!cardDetails.cvv.trim() || cardDetails.cvv.length < 3) {
      newErrors.cvv = "Valid CVV is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return
    
    // Simulate order processing
    Alert.alert(
      "Confirm Order",
      "Are you sure you want to place this order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              // Here you would create the order in your backend
              // await createOrder({ items, total, deliveryDetails, paymentMethod })
              
              clearCart()
            //   router.push("/(user)/checkout/confirm")
            } catch (error) {
              Alert.alert("Error", "Failed to place order. Please try again.")
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

  const subtotal = getTotalPrice()
  const shipping = 5.00
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center mb-4"
        >
          <MaterialIcons name="arrow-back-ios" size={20} color="#374151" />
          <Text className="text-gray-800 font-medium">Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-amber-900">Payment</Text>
        <Text className="text-gray-600">Step 2 of 3</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Payment Methods */}
        <View className="bg-white rounded-2xl p-6 mb-4 border border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Select Payment Method
          </Text>
          
          <TouchableOpacity
            onPress={() => setPaymentMethod("card")}
            className={`flex-row items-center p-4 rounded-xl mb-3 ${
              paymentMethod === "card" 
                ? "bg-amber-50 border border-amber-200" 
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <MaterialIcons
              name={paymentMethod === "card" ? "radio-button-checked" : "radio-button-unchecked"}
              size={24}
              color="#b45309"
            />
            <View className="ml-4 flex-1">
              <Text className="font-semibold text-gray-900">Credit/Debit Card</Text>
              <Text className="text-gray-600 text-sm">Pay with your card</Text>
            </View>
            <MaterialIcons name="credit-card" size={24} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPaymentMethod("cash")}
            className={`flex-row items-center p-4 rounded-xl ${
              paymentMethod === "cash" 
                ? "bg-amber-50 border border-amber-200" 
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <MaterialIcons
              name={paymentMethod === "cash" ? "radio-button-checked" : "radio-button-unchecked"}
              size={24}
              color="#b45309"
            />
            <View className="ml-4 flex-1">
              <Text className="font-semibold text-gray-900">Cash on Delivery</Text>
              <Text className="text-gray-600 text-sm">Pay when you receive</Text>
            </View>
            <MaterialIcons name="local-atm" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Card Details (only shown if card selected) */}
        {paymentMethod === "card" && (
          <View className="bg-white rounded-2xl p-6 mb-4 border border-gray-200">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Card Details
            </Text>
            
            <View className="mb-4">
              <Text className="text-gray-800 font-medium mb-2">Card Number *</Text>
              <TextInput
                placeholder="1234 5678 9012 3456"
                className={`border rounded-lg p-3 ${
                  errors.cardNumber ? "border-red-500" : "border-gray-300"
                }`}
                value={cardDetails.cardNumber}
                onChangeText={(text) => setCardDetails({...cardDetails, cardNumber: text})}
                keyboardType="number-pad"
                maxLength={16}
              />
              {errors.cardNumber && (
                <Text className="text-red-500 text-sm mt-1">{errors.cardNumber}</Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-gray-800 font-medium mb-2">Cardholder Name *</Text>
              <TextInput
                placeholder="John Doe"
                className={`border rounded-lg p-3 ${
                  errors.cardName ? "border-red-500" : "border-gray-300"
                }`}
                value={cardDetails.cardName}
                onChangeText={(text) => setCardDetails({...cardDetails, cardName: text})}
              />
              {errors.cardName && (
                <Text className="text-red-500 text-sm mt-1">{errors.cardName}</Text>
              )}
            </View>

            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-gray-800 font-medium mb-2">Expiry Date *</Text>
                <TextInput
                  placeholder="MM/YY"
                  className={`border rounded-lg p-3 ${
                    errors.expiryDate ? "border-red-500" : "border-gray-300"
                  }`}
                  value={cardDetails.expiryDate}
                  onChangeText={(text) => setCardDetails({...cardDetails, expiryDate: text})}
                  maxLength={5}
                />
                {errors.expiryDate && (
                  <Text className="text-red-500 text-sm mt-1">{errors.expiryDate}</Text>
                )}
              </View>
              
              <View className="flex-1">
                <Text className="text-gray-800 font-medium mb-2">CVV *</Text>
                <TextInput
                  placeholder="123"
                  className={`border rounded-lg p-3 ${
                    errors.cvv ? "border-red-500" : "border-gray-300"
                  }`}
                  value={cardDetails.cvv}
                  onChangeText={(text) => setCardDetails({...cardDetails, cvv: text})}
                  keyboardType="number-pad"
                  maxLength={3}
                  secureTextEntry
                />
                {errors.cvv && (
                  <Text className="text-red-500 text-sm mt-1">{errors.cvv}</Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Order Summary */}
        <View className="bg-white rounded-2xl p-6 border border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Order Summary
          </Text>
          
          <View className="space-y-2 mb-4">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Subtotal</Text>
              <Text className="font-medium">{formatPrice(subtotal)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Shipping</Text>
              <Text className="font-medium">{formatPrice(shipping)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Tax (8%)</Text>
              <Text className="font-medium">{formatPrice(tax)}</Text>
            </View>
          </View>
          
          <View className="border-t border-gray-200 pt-4">
            <View className="flex-row justify-between">
              <Text className="text-lg font-bold text-gray-900">Total</Text>
              <Text className="text-lg font-bold text-amber-700">
                {formatPrice(total)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View className="bg-white border-t border-gray-200 p-4">
        <TouchableOpacity
          onPress={handlePlaceOrder}
          className="bg-amber-600 py-3 rounded-lg"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Place Order
          </Text>
        </TouchableOpacity>
        
        <Text className="text-gray-500 text-center text-sm mt-2">
          By placing your order, you agree to our Terms & Conditions
        </Text>
      </View>
    </View>
  )
}

export default CheckoutPayment