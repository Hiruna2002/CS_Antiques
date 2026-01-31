import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native"
import React, { useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useCart } from "@/context/CartContext"

const CheckoutDelivery = () => {
  const router = useRouter()
  const { getTotalPrice } = useCart()
  
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "Sri Lanka",
    saveAddress: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!form.email.trim()) newErrors.email = "Email is required"
    if (!form.phone.trim()) newErrors.phone = "Phone number is required"
    if (!form.address.trim()) newErrors.address = "Address is required"
    if (!form.city.trim()) newErrors.city = "City is required"
    if (!form.zipCode.trim()) newErrors.zipCode = "Zip code is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      // Save delivery details (you can use context or async storage)
      router.push("/(user)/checkout/payment")
    }
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
        <Text className="text-2xl font-bold text-amber-900">Delivery Details</Text>
        <Text className="text-gray-600">Step 1 of 3</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Contact Information */}
        <View className="bg-white rounded-2xl p-6 mb-4 border border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
          </Text>
          
          <View className="mb-4">
            <Text className="text-gray-800 font-medium mb-2">Full Name *</Text>
            <TextInput
              placeholder="Enter your full name"
              className={`border rounded-lg p-3 ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
              value={form.fullName}
              onChangeText={(text) => setForm({...form, fullName: text})}
            />
            {errors.fullName && (
              <Text className="text-red-500 text-sm mt-1">{errors.fullName}</Text>
            )}
          </View>

          <View className="mb-4">
            <Text className="text-gray-800 font-medium mb-2">Email *</Text>
            <TextInput
              placeholder="Enter your email"
              className={`border rounded-lg p-3 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={form.email}
              onChangeText={(text) => setForm({...form, email: text})}
              keyboardType="email-address"
            />
            {errors.email && (
              <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
            )}
          </View>

          <View className="mb-4">
            <Text className="text-gray-800 font-medium mb-2">Phone Number *</Text>
            <TextInput
              placeholder="Enter your phone number"
              className={`border rounded-lg p-3 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              value={form.phone}
              onChangeText={(text) => setForm({...form, phone: text})}
              keyboardType="phone-pad"
            />
            {errors.phone && (
              <Text className="text-red-500 text-sm mt-1">{errors.phone}</Text>
            )}
          </View>
        </View>

        {/* Shipping Address */}
        <View className="bg-white rounded-2xl p-6 mb-4 border border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Shipping Address
          </Text>
          
          <View className="mb-4">
            <Text className="text-gray-800 font-medium mb-2">Address *</Text>
            <TextInput
              placeholder="Enter your address"
              className={`border rounded-lg p-3 ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              value={form.address}
              onChangeText={(text) => setForm({...form, address: text})}
              multiline
            />
            {errors.address && (
              <Text className="text-red-500 text-sm mt-1">{errors.address}</Text>
            )}
          </View>

          <View className="flex-row space-x-4 mb-4">
            <View className="flex-1">
              <Text className="text-gray-800 font-medium mb-2">City *</Text>
              <TextInput
                placeholder="City"
                className={`border rounded-lg p-3 ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
                value={form.city}
                onChangeText={(text) => setForm({...form, city: text})}
              />
              {errors.city && (
                <Text className="text-red-500 text-sm mt-1">{errors.city}</Text>
              )}
            </View>
            
            <View className="flex-1">
              <Text className="text-gray-800 font-medium mb-2">Zip Code *</Text>
              <TextInput
                placeholder="Zip code"
                className={`border rounded-lg p-3 ${
                  errors.zipCode ? "border-red-500" : "border-gray-300"
                }`}
                value={form.zipCode}
                onChangeText={(text) => setForm({...form, zipCode: text})}
              />
              {errors.zipCode && (
                <Text className="text-red-500 text-sm mt-1">{errors.zipCode}</Text>
              )}
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-800 font-medium mb-2">Country</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-gray-100"
              value={form.country}
              editable={false}
            />
          </View>

          <TouchableOpacity
            onPress={() => setForm({...form, saveAddress: !form.saveAddress})}
            className="flex-row items-center"
          >
            <MaterialIcons
              name={form.saveAddress ? "check-box" : "check-box-outline-blank"}
              size={24}
              color="#b45309"
            />
            <Text className="ml-2 text-gray-700">Save this address for future orders</Text>
          </TouchableOpacity>
        </View>

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

      {/* Continue Button */}
      <View className="bg-white border-t border-gray-200 p-4">
        <TouchableOpacity
          onPress={handleNext}
          className="bg-amber-600 py-3 rounded-lg"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Continue to Payment
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CheckoutDelivery