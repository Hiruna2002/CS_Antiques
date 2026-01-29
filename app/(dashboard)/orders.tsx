import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native"
import React, { useCallback, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useFocusEffect } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { getAllOrders, updateOrderStatus } from "@/services/orderService"
import { Order } from "@/types/order"

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all")
  const { showLoader, hideLoader } = useLoader()

  const fetchOrders = async () => {
    showLoader()
    try {
      const data = await getAllOrders()
      setOrders(data)
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch orders")
    } finally {
      hideLoader()
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchOrders()
    }, [])
  )

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true
    return order.status === filter
  })

  const handleUpdateStatus = async (orderId: string, newStatus: Order["status"]) => {
    showLoader()
    try {
      await updateOrderStatus(orderId, newStatus)
      fetchOrders()
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update order")
    } finally {
      hideLoader()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
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
      {/* Filter Tabs */}
      <View className="flex-row bg-white border-b border-gray-200">
        {(["all", "pending", "completed", "cancelled"] as const).map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setFilter(status)}
            className={`flex-1 py-3 items-center ${filter === status ? "border-b-2 border-amber-600" : ""}`}
          >
            <Text className={`font-medium ${filter === status ? "text-amber-600" : "text-gray-600"}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      <ScrollView className="flex-1 p-4">
        {filteredOrders.length === 0 ? (
          <View className="items-center justify-center py-10">
            <MaterialIcons name="receipt" size={60} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-lg">No orders found</Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <View
              key={order.id}
              className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 shadow-sm"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View>
                  <Text className="text-lg font-semibold text-gray-900">
                    Order #{order.orderNumber}
                  </Text>
                  <Text className="text-gray-600">{order.customerName}</Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  <Text className="font-semibold capitalize">{order.status}</Text>
                </View>
              </View>

              <View className="mb-3">
                <Text className="text-gray-700">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </Text>
                <Text className="text-amber-700 font-bold text-lg">
                  Total: {formatPrice(order.totalAmount)}
                </Text>
              </View>

              <Text className="text-gray-500 text-sm mb-4">
                Ordered: {new Date(order.createdAt).toLocaleDateString()}
              </Text>

              {/* Status Actions */}
              {order.status === "pending" && (
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={() => handleUpdateStatus(order.id, "completed")}
                    className="flex-1 bg-green-600 py-2 rounded-lg"
                  >
                    <Text className="text-white text-center font-medium">Complete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleUpdateStatus(order.id, "cancelled")}
                    className="flex-1 bg-red-600 py-2 rounded-lg"
                  >
                    <Text className="text-white text-center font-medium">Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default Orders