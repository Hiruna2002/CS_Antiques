// import { View, Text, ScrollView, TouchableOpacity } from "react-native"
// import React, { useEffect, useState } from "react"
// import { MaterialIcons } from "@expo/vector-icons"
// import { useRouter, usePathname } from "expo-router"
// import { useAuth } from "@/hooks/useAuth"
// import { useLoader } from "@/hooks/useLoader"
// import { getProductStats } from "@/services/productServices"
// import { getOrderStats } from "@/services/orderService"
// import { getCustomerStats } from "@/services/customerService"

// const Home = () => {
//   const router = useRouter()
//   const { user } = useAuth()
//   const { showLoader, hideLoader } = useLoader()
//   const [stats, setStats] = useState({
//     totalProducts: 0,
//     lowStock: 0,
//     pendingOrders: 0,
//     totalCustomers: 0
//   })

//   useEffect(() => {
//     fetchStats()
//   }, [])

//   const fetchStats = async () => {
//     showLoader()
//     try {
//       const productStats = await getProductStats()
//       const orderStats = await getOrderStats()
//       const customerStats = await getCustomerStats()
//       setStats({
//         totalProducts: productStats.total,
//         lowStock: productStats.lowStock,
//         pendingOrders: orderStats.pendingOrders,
//         totalCustomers: customerStats.totalCustomers
//       })
//     } catch (error) {
//       console.error(error)
//       try {
//         const productStats = await getProductStats()
//         const orderStats = await getOrderStats()
        
//         setStats({
//           totalProducts: productStats.total,
//           lowStock: productStats.lowStock,
//           pendingOrders: orderStats.pendingOrders,
//           totalCustomers: 0 // Default value if customer service fails
//         })
//       } catch (fallbackError) {
//         console.error(fallbackError)
//       }
//     } finally {
//       hideLoader()
//     }
//   }

//   const StatCard = ({ title, value, icon, color, onPress }: any) => (
//     <TouchableOpacity
//       onPress={onPress}
//       className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 shadow-sm flex-row items-center"
//     >
//       <View className={`p-3 rounded-full ${color} mr-4`}>
//         <MaterialIcons name={icon} size={24} color="#fff" />
//       </View>
//       <View>
//         <Text className="text-2xl font-bold text-gray-900">{value}</Text>
//         <Text className="text-gray-600">{title}</Text>
//       </View>
//     </TouchableOpacity>
//   )

//   const router = useRouter()
//   const pathname = usePathname()

//   const menuItems = [
//     { id: 1, name: "Home", icon: "home", route: "/(tabs)/home" },
//     { id: 2, name: "Categories", icon: "category", route: "/(tabs)/categories" },
//     { id: 3, name: "Add", icon: "add", route: "/(tabs)/add-product" },
//     { id: 4, name: "Orders", icon: "receipt", route: "/(tabs)/orders" },
//     { id: 5, name: "More", icon: "menu", route: "/(tabs)/settings" },
//   ]

//   const isActive = (route: string) => pathname === route

//   return (
//     <ScrollView className="flex-1 bg-gray-50 p-4">
//       <View className="mb-6">
//         <Text className="text-2xl font-bold text-amber-900">
//           Welcome, {user?.displayName || "Shop Owner"}!
//         </Text>
//         <Text className="text-gray-600">Manage your antique shop</Text>
//       </View>

//       <View className="mb-6">
//         <Text className="text-lg font-semibold text-gray-800 mb-3">Quick Stats</Text>
//         <StatCard
//           title="Total Products"
//           value={stats.totalProducts}
//           icon="inventory"
//           color="bg-blue-500"
//           onPress={() => router.push("/product")}
//         />
//         <StatCard
//           title="Low Stock Items"
//           value={stats.lowStock}
//           icon="warning"
//           color="bg-red-500"
//           onPress={() => router.push("/product")}
//         />
//         <StatCard
//           title="Pending Orders"
//           value={stats.pendingOrders}
//           icon="receipt"
//           color="bg-yellow-500"
//           onPress={() => router.push("/orders")}
//         />
//         <StatCard
//           title="Total Customers"
//           value={stats.totalCustomers}
//           icon="people"
//           color="bg-green-500"
//           onPress={() => router.push("/customers")}
//         />
//       </View>

//       {/* <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
//         <Text className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</Text>
//         <View className="flex-row flex-wrap justify-between">
//           <TouchableOpacity
//             onPress={() => router.push("/products/form")}
//             className="bg-amber-100 p-4 rounded-xl mb-3 w-[48%] items-center"
//           >
//             <MaterialIcons name="add" size={24} color="#b45309" />
//             <Text className="text-amber-900 font-medium mt-2">Add Product</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             onPress={() => router.push("/categories")}
//             className="bg-blue-100 p-4 rounded-xl mb-3 w-[48%] items-center"
//           >
//             <MaterialIcons name="category" size={24} color="#1d4ed8" />
//             <Text className="text-blue-900 font-medium mt-2">Categories</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             onPress={() => router.push("/orders")}
//             className="bg-green-100 p-4 rounded-xl w-[48%] items-center"
//           >
//             <MaterialIcons name="local-shipping" size={24} color="#15803d" />
//             <Text className="text-green-900 font-medium mt-2">Orders</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             onPress={() => router.push("/profile")}
//             className="bg-purple-100 p-4 rounded-xl w-[48%] items-center"
//           >
//             <MaterialIcons name="settings" size={24} color="#7c3aed" />
//             <Text className="text-purple-900 font-medium mt-2">Settings</Text>
//           </TouchableOpacity>
//         </View>
//       </View> */}

//       <View className="flex-row bg-white border-t border-gray-300 px-1 py-2">
//       {menuItems.map((item) => (
//         <TouchableOpacity
//           key={item.id}
//           onPress={() => router.push(item.route)}
//           className="flex-1 items-center py-1"
//         >
//           <MaterialIcons
//             name={item.icon}
//             size={26}
//             color={isActive(item.route) ? "#b45309" : "#4b5563"}
//           />
//           <Text
//             className={`text-[10px] mt-1 ${
//               isActive(item.route) ? "text-amber-700" : "text-gray-500"
//             }`}
//           >
//             {item.name}
//           </Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//     </ScrollView>
//   )
// }

// export default Home








import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import React, { useEffect, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useRouter, usePathname } from "expo-router"
import { useAuth } from "@/hooks/useAuth"
import { useLoader } from "@/hooks/useLoader"
import { getProductStats } from "@/services/productServices"
import { getOrderStats } from "@/services/orderService"

const Home = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const { showLoader, hideLoader } = useLoader()
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    pendingOrders: 0,
    totalCustomers: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    showLoader()
    try {
      const productStats = await getProductStats()
      const orderStats = await getOrderStats()
      
      setStats({
        totalProducts: productStats.total || 0,
        lowStock: productStats.lowStock || 0,
        pendingOrders: orderStats.pendingOrders || 0,
        totalCustomers: 0 
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      hideLoader()
    }
  }

  const StatCard = ({ title, value, icon, color, onPress }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 shadow-sm flex-row items-center"
    >
      <View className={`p-3 rounded-full ${color} mr-4`}>
        <MaterialIcons name={icon} size={24} color="#fff" />
      </View>
      <View>
        <Text className="text-2xl font-bold text-gray-900">{value}</Text>
        <Text className="text-gray-600">{title}</Text>
      </View>
    </TouchableOpacity>
  )

  const menuItems = [
    { id: 1, name: "Home", icon: "home", route: "/home" },
    { id: 2, name: "Category", icon: "inventory", route: "/categories" },
    { id: 3, name: "Add", icon: "add", route: "/product" },
    { id: 4, name: "Orders", icon: "receipt", route: "/orders" },
    { id: 5, name: "Settings", icon: "settings", route: "/" },
  ] as const;

  const isActive = (route: string) => pathname === route

  return (
    <View className="flex-1">
      {/* Main Content - Scrollable */}
      <ScrollView 
        className="flex-1 bg-gray-50 p-4"
        contentContainerStyle={{ paddingBottom: 70 }} // Add padding for footer
      >
        <View className="mb-6">
          <Text className="text-2xl font-bold text-amber-900">
            Welcome, {user?.displayName || "Shop Owner"}!
          </Text>
          <Text className="text-gray-600">Manage your antique shop</Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Quick Stats</Text>
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon="inventory"
            color="bg-blue-500"
            onPress={() => router.push("/products")}
          />
          <StatCard
            title="Low Stock Items"
            value={stats.lowStock}
            icon="warning"
            color="bg-red-500"
            onPress={() => router.push("/products")}
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon="receipt"
            color="bg-yellow-500"
            onPress={() => router.push("/orders")}
          />
          <StatCard
            title="Customers"
            value={stats.totalCustomers}
            icon="person"
            color="bg-yellow-500"
            onPress={() => router.push("/customers")}
          />
        </View>

        {/* <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity
              onPress={() => router.push("/products/form")}
              className="bg-amber-100 p-4 rounded-xl mb-3 w-[48%] items-center"
            >
              <MaterialIcons name="add" size={24} color="#b45309" />
              <Text className="text-amber-900 font-medium mt-2">Add Product</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => router.push("/products")}
              className="bg-blue-100 p-4 rounded-xl mb-3 w-[48%] items-center"
            >
              <MaterialIcons name="category" size={24} color="#1d4ed8" />
              <Text className="text-blue-900 font-medium mt-2">View Products</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => router.push("/orders")}
              className="bg-green-100 p-4 rounded-xl w-[48%] items-center"
            >
              <MaterialIcons name="local-shipping" size={24} color="#15803d" />
              <Text className="text-green-900 font-medium mt-2">Orders</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => router.push("/")}
              className="bg-purple-100 p-4 rounded-xl w-[48%] items-center"
            >
              <MaterialIcons name="settings" size={24} color="#7c3aed" />
              <Text className="text-purple-900 font-medium mt-2">Settings</Text>
            </TouchableOpacity>
          </View>
        </View> */}
      </ScrollView>

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
                size={26}
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

export default Home