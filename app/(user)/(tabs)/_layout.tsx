// import { Tabs } from "expo-router"
// import { MaterialIcons } from "@expo/vector-icons"
// import { useCart, CartProvider } from "@/context/CartContext"
// import { View, Text } from "react-native"

// const UserTabsLayout = () => {

//   return (
//     <CartProvider>
//       <Tabs
//         screenOptions={{
//           headerShown: false,
//           tabBarActiveTintColor: "#b45309",
//           tabBarInactiveTintColor: "#6b7280",
//           tabBarStyle: {
//             backgroundColor: "#ffffff",
//             borderTopColor: "#e5e7eb",
//             height: 60,
//             paddingBottom: 8,
//             paddingTop: 8,
//             display: "none"
//           },
//         }}
//       >
//         <Tabs.Screen
//           name="home"
//           options={{
//             title: "Home",
//             tabBarIcon: ({ color, size }) => (
//               <MaterialIcons name="home" color={color} size={size} />
//             ),
//           }}
//         />
        
//         <Tabs.Screen
//           name="cart"
//           options={{
//             title: "Cart",
//             tabBarIcon: ({ color, size }) => {
//               //@ts-ignore
//               const { totalItems } = useCart();
//               return (
//                 <View>
//                 <MaterialIcons name="shopping-cart" color={color} size={size} />
//                 {totalItems > 0 && (
//                   <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
//                     <Text className="text-white text-xs font-bold">
//                       {totalItems}
//                     </Text>
//                   </View>
//                 )}
//               </View>
//               )
//             }
//           }}
//         />
        
//         <Tabs.Screen
//           name="orders"
//           options={{
//             title: "Orders",
//             tabBarIcon: ({ color, size }) => (
//               <MaterialIcons name="receipt" color={color} size={size} />
//             ),
//           }}
//         />
        
//         <Tabs.Screen
//           name="profile"
//           options={{
//             title: "Profile",
//             tabBarIcon: ({ color, size }) => (
//               <MaterialIcons name="person" color={color} size={size} />
//             ),
//           }}
//         />
//       </Tabs>
//     </CartProvider>
//   )
// }

// export default UserTabsLayout



import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";

const tabs = [
  { name: "home", icon: "home", title: "Home" },
  { name: "foods", icon: "restaurant-menu", title: "Foods" },
  { name: "cart", icon: "shopping-cart", title: "Cart" },
  { name: "orders", icon: "receipt-long", title: "Orders" }, 
  {name: "checkout", icon: "payment", title: "Checkout" },
  { name: "profile", icon: "person", title: "Profile" },
  {name:"order-confirmation", icon:"check-circle", title:"Confirm"}
] as const;

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          display: "none"
        },
        tabBarIcon: ({ focused, color, size }) => {
          const tab = tabs.find(t => t.name === route.name);
          const iconName = tab?.icon || 'circle';
          
          return (
            <MaterialIcons 
              name={iconName as any} 
              size={size} 
              color={focused ? '#4F46E5' : color} 
            />
          );
        },
        tabBarLabel: ({ focused }) => {
          const tab = tabs.find(t => t.name === route.name);
          return (
            <Text 
              className={`text-xs mt-1 ${focused ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}
            >
              {tab?.title || route.name}
            </Text>
          );
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
      })}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
          }}
        />
      ))}
    </Tabs>
  );
};

export default DashboardLayout;