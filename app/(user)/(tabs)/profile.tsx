import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert
} from "react-native"
import React from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useRouter, usePathname } from "expo-router"
import { useAuth } from "@/hooks/useAuth"
import { logoutUser } from "@/services/authService"

const UserProfile = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logoutUser()
              router.replace("/login")
            } catch (error) {
              Alert.alert("Error", "Failed to logout")
            }
          }
        }
      ]
    )
  }

  const menuItems = [
    { 
      icon: "person", 
      label: "Personal Info", 
    //   onPress: () => router.push("/(user)/profile/edit") 
    },
    { 
      icon: "location-on", 
      label: "Address Book", 
    //   onPress: () => router.push("/(user)/profile/addresses") 
    },
    { 
      icon: "payment", 
      label: "Payment Methods", 
    //   onPress: () => router.push("/(user)/profile/payments") 
    },
    { 
      icon: "favorite", 
      label: "Wishlist", 
    //   onPress: () => router.push("/(user)/profile/wishlist") 
    },
    { 
      icon: "notifications", 
      label: "Notifications", 
      onPress: () => Alert.alert("Notifications", "Notification settings") 
    },
    { 
      icon: "help", 
      label: "Help & Support", 
      onPress: () => Alert.alert("Help", "Help & support center") 
    },
    { 
      icon: "logout", 
      label: "Logout", 
      onPress: handleLogout,
      color: "text-red-600" 
    },
  ]

  const tabBarItems = [
      { id: 1, name: "For You", icon: "home", route: "/userHome" },
      { id: 2, name: "Cart", icon: "shopping-cart", route: "/cart" },
      { id: 3, name: "Add", icon: "add", route: "/product" },
      { id: 4, name: "Orders", icon: "receipt", route: "/orders" },
      { id: 5, name: "Profile", icon: "person", route: "/profile" },
    ] as const;
  
    const isActive = (route: string) => pathname === route

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView>
        {/* Profile Header */}
        <View className="bg-white p-6 items-center border-b border-gray-200">
          <View className="bg-amber-100 p-6 rounded-full mb-4">
            <MaterialIcons name="person" size={60} color="#b45309" />
          </View>
          <Text className="text-2xl font-bold text-gray-900">
            {user?.displayName || "Guest User"}
          </Text>
          <Text className="text-gray-600">{user?.email}</Text>
          <TouchableOpacity
          //   onPress={() => router.push("/(user)/profile/edit")}
            className="mt-4 border border-amber-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-amber-600 font-medium">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="bg-white mx-4 my-6 rounded-2xl p-6 border border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Account Summary</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-amber-700">0</Text>
              <Text className="text-gray-600">Orders</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-amber-700">0</Text>
              <Text className="text-gray-600">Wishlist</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-amber-700">$0</Text>
              <Text className="text-gray-600">Spent</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="p-4">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              className="flex-row items-center bg-white p-4 mb-3 rounded-xl border border-gray-200"
            >
              <MaterialIcons 
                name={item.icon as any} 
                size={24} 
                color="#374151" 
                className="mr-4" 
              />
              <Text className={`flex-1 text-lg ${item.color || "text-gray-800"}`}>
                {item.label}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>
        

        {/* App Info */}
        <View className="p-6 items-center">
          <Text className="text-gray-500">Antique Shop v1.0</Text>
          <Text className="text-gray-400 text-sm mt-1">
            © 2026 All rights reserved
          </Text>
        </View>

        {/* just blank */}
        <View className="p-6 items-center">
          <Text className="text-gray-500"></Text>
          <Text className="text-gray-400 text-sm mt-1">
            
          </Text>
        </View>
      </ScrollView>
      {/* Fixed Footer Bar at bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 px-1 py-2">
        <View className="flex-row">
            {tabBarItems.map((item) => (
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

export default UserProfile