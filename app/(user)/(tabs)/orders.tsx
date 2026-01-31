import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from "react-native"
import React, { useState, useEffect, useCallback } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useAuth } from "@/hooks/useAuth"
import { useLoader } from "@/hooks/useLoader"
import { getOrdersByCustomer } from "@/services/orderService"

const UserOrders = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { showLoader, hideLoader } = useLoader()
  
  const [orders, setOrders] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all")

  const fetchOrders = async () => {
    if (!user) return
    
    showLoader()
    try {
      // Assuming we have a function to get orders by user ID
      const data = await getOrdersByCustomer(user.uid)
      setOrders(data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      hideLoader()
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [user])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchOrders().finally(() => setRefreshing(false))
  }, [])

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true
    return order.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "processing": return "bg-blue-100 text-blue-800"
      case "completed": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price)
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-amber-900">My Orders</Text>
        <Text className="text-gray-600">Track your purchases</Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="bg-white border-b border-gray-200"
      >
        {(["all", "pending", "completed", "cancelled"] as const).map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setFilter(status)}
            className={`px-4 py-3 ${filter === status ? "border-b-2 border-amber-600" : ""}`}
          >
            <Text className={`font-medium ${filter === status ? "text-amber-600" : "text-gray-600"}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Orders List */}
      <ScrollView 
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredOrders.length === 0 ? (
          <View className="items-center justify-center py-10">
            <MaterialIcons name="receipt" size={60} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-lg">No orders found</Text>
            <TouchableOpacity
              onPress={() => router.push("/(user)/(tabs)/userHome")}
              className="mt-6 bg-amber-600 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => router.push({
                pathname: "/(user)/order/[id]",
                params: { id: order.id }
              })}
              className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 shadow-sm"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View>
                  <Text className="text-lg font-semibold text-gray-900">
                    Order #{order.orderNumber}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  <Text className="font-semibold capitalize text-sm">
                    {order.status}
                  </Text>
                </View>
              </View>

              <View className="mb-3">
                <Text className="text-gray-700">
                  {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
                </Text>
                <Text className="text-amber-700 font-bold text-lg">
                  Total: {formatPrice(order.totalAmount || 0)}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 text-sm">
                  Payment: {order.paymentStatus || "pending"}
                </Text>
                <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default UserOrders



