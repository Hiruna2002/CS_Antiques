import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import React, { useCallback, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useFocusEffect } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { getAllCustomers } from "@/services/customerService"
import { Customer } from "@/types/customer"

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const { showLoader, hideLoader } = useLoader()

  const fetchCustomers = async () => {
    showLoader()
    try {
      const data = await getAllCustomers()
      setCustomers(data)
    } catch (error) {
      console.error(error)
    } finally {
      hideLoader()
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchCustomers()
    }, [])
  )

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-amber-900 mb-6">Customers</Text>

      <ScrollView>
        {customers.length === 0 ? (
          <View className="items-center justify-center py-10">
            <MaterialIcons name="people" size={60} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-lg">No customers found</Text>
          </View>
        ) : (
          customers.map((customer) => (
            <TouchableOpacity
              key={customer.id}
              className="bg-white rounded-2xl p-4 mb-3 border border-gray-200 shadow-sm"
            >
              <View className="flex-row items-center">
                <View className="bg-blue-100 p-3 rounded-full mr-4">
                  <MaterialIcons name="person" size={24} color="#1d4ed8" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">{customer.name}</Text>
                  <Text className="text-gray-600">{customer.email}</Text>
                  <Text className="text-gray-500">{customer.phone}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-gray-800 font-semibold">
                    {customer.orderCount || 0} orders
                  </Text>
                  <Text className="text-amber-700 font-bold">
                    ${customer.totalSpent?.toFixed(2) || "0.00"}
                  </Text>
                </View>
              </View>
              
              {customer.address ? (
                <Text className="text-gray-500 text-sm mt-3">
                  <MaterialIcons name="location-on" size={14} color="#6b7280" /> {customer.address}
                </Text>
              ) : null}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default Customers