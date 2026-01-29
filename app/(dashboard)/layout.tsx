import { Tabs } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import React from "react"

const tabs = [
  { name: "home", icon: "home", title: "Home" },
  { name: "products", icon: "inventory", title: "Products" },
  { name: "categories", icon: "category", title: "Categories" },
  { name: "orders", icon: "receipt", title: "Orders" },
  { name: "customers", icon: "people", title: "Customers" },
  { name: "profile", icon: "person", title: "Profile" }
] as const

const DashboardLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={tab.icon} color={color} size={size} />
            ),
            tabBarActiveTintColor: "#b45309",
            tabBarInactiveTintColor: "#6b7280",
          }}
        />
      ))}
    </Tabs>
  )
}

export default DashboardLayout