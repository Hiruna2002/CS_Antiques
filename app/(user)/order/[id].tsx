import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native"
import React, { useEffect, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { getOrderById } from "@/services/orderService"
import { Order, OrderItem } from "@/types/order"

const OrderDetail = () => {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { showLoader, hideLoader } = useLoader()
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchOrder(id)
    }
  }, [id])

  const fetchOrder = async (orderId: string) => {
    showLoader()
    setLoading(true)
    try {
      const data = await getOrderById(orderId)
      setOrder(data)
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load order details")
      router.back()
    } finally {
      hideLoader()
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "processing": return "bg-blue-100 text-blue-800"
      case "completed": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-red-100 text-red-800"
      case "refunded": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return "pending"
      case "processing": return "autorenew"
      case "completed": return "check-circle"
      case "cancelled": return "cancel"
      case "refunded": return "currency-exchange"
      default: return "receipt"
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#b45309" />
      </View>
    )
  }

  if (!order) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <MaterialIcons name="error" size={60} color="#dc2626" />
        <Text className="text-gray-700 mt-4 text-lg">Order not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-amber-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <MaterialIcons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900">Order Details</Text>
          <Text className="text-gray-600">Order #{order.orderNumber}</Text>
        </View>
      </View>

      {/* Order Status Card */}
      <View className="bg-white mx-4 mt-4 p-5 rounded-2xl border border-gray-200 shadow-sm">
        <View className="flex-row items-center mb-4">
          <View className={`p-3 rounded-full ${getStatusColor(order.status)} mr-3`}>
            <MaterialIcons name={getStatusIcon(order.status)} size={24} color="currentColor" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">Order Status</Text>
            <Text className={`font-semibold capitalize ${getStatusColor(order.status)}`}>
              {order.status}
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
            <Text className="font-bold capitalize">{order.status}</Text>
          </View>
        </View>

        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Order Date:</Text>
            <Text className="text-gray-900 font-medium">{formatDate(order.createdAt)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Payment Status:</Text>
            <Text className={`font-medium ${
              order.paymentStatus === 'paid' ? 'text-green-600' : 
              order.paymentStatus === 'pending' ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {order.paymentStatus?.toUpperCase()}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Payment Method:</Text>
            <Text className="text-gray-900 font-medium">{order.paymentMethod}</Text>
          </View>
        </View>
      </View>

      {/* Customer Info */}
      <View className="bg-white mx-4 mt-4 p-5 rounded-2xl border border-gray-200 shadow-sm">
        <Text className="text-lg font-bold text-gray-900 mb-3">Customer Information</Text>
        <View className="space-y-2">
          <View className="flex-row items-center">
            <MaterialIcons name="person" size={20} color="#6b7280" className="mr-2" />
            <Text className="text-gray-900">{order.customerName}</Text>
          </View>
          <View className="flex-row items-center">
            <MaterialIcons name="email" size={20} color="#6b7280" className="mr-2" />
            <Text className="text-gray-900">{order.customerEmail}</Text>
          </View>
          <View className="flex-row items-center">
            <MaterialIcons name="phone" size={20} color="#6b7280" className="mr-2" />
            <Text className="text-gray-900">{order.customerPhone}</Text>
          </View>
          {order.shippingAddress && (
            <View className="flex-row items-start">
              <MaterialIcons name="location-on" size={20} color="#6b7280" className="mr-2 mt-1" />
              <Text className="text-gray-900 flex-1">{order.shippingAddress}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Order Items */}
      <View className="bg-white mx-4 mt-4 p-5 rounded-2xl border border-gray-200 shadow-sm">
        <Text className="text-lg font-bold text-gray-900 mb-3">Order Items</Text>
        {order.items.map((item: OrderItem, index: number) => (
          <View 
            key={`${item.productId}-${index}`}
            className="flex-row py-3 border-b border-gray-100 last:border-b-0"
          >
            <View className="flex-1">
              <Text className="font-medium text-gray-900">{item.productName}</Text>
              <Text className="text-gray-600 text-sm">Qty: {item.quantity}</Text>
              <Text className="text-gray-600 text-sm">
                {formatPrice(item.price)} each
              </Text>
            </View>
            <View className="justify-center">
              <Text className="font-bold text-amber-700">
                {formatPrice(item.total)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Order Summary */}
      <View className="bg-white mx-4 my-4 p-5 rounded-2xl border border-gray-200 shadow-sm">
        <Text className="text-lg font-bold text-gray-900 mb-3">Order Summary</Text>
        <View className="space-y-2">
          {/* <View className="flex-row justify-between">
            <Text className="text-gray-600">Subtotal</Text>
            <Text className="text-gray-900">{formatPrice(order.subtotal)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Tax</Text>
            <Text className="text-gray-900">{formatPrice(order.tax)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Shipping</Text>
            <Text className="text-gray-900">{formatPrice(order.shipping)}</Text>
          </View> */}
          <View className="flex-row justify-between border-t border-gray-200 pt-2 mt-2">
            <Text className="text-lg font-bold text-gray-900">Total</Text>
            <Text className="text-xl font-bold text-amber-700">
              {formatPrice(order.totalAmount)}
            </Text>
          </View>
        </View>
      </View>

      {/* Notes (if any) */}
      {order.notes && (
        <View className="bg-white mx-4 mb-4 p-5 rounded-2xl border border-gray-200 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-2">Additional Notes</Text>
          <Text className="text-gray-700 bg-gray-50 p-3 rounded-lg">
            {order.notes}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View className="p-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-200 py-3 rounded-xl mb-3"
        >
          <Text className="text-gray-800 text-center text-lg font-semibold">
            Back to Orders
          </Text>
        </TouchableOpacity>
        
        {(order.status === "pending" || order.status === "processing") && (
          <TouchableOpacity
            onPress={() => Alert.alert(
              "Contact Support",
              "Please contact our support team for order modifications."
            )}
            className="bg-amber-600 py-3 rounded-xl"
          >
            <Text className="text-white text-center text-lg font-semibold">
              Contact Support
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  )
}

export default OrderDetail