import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import React, { useCallback, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { router, useFocusEffect, usePathname, useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { getAllCategories, addCategory, deleteCategory } from "@/services/categoryService"
import { Category } from "@/types/category"

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const { showLoader, hideLoader } = useLoader()
  const pathname = usePathname()
  

  const fetchCategories = async () => {
    showLoader()
    try {
      const data = await getAllCategories()
      setCategories(data)
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch categories")
    } finally {
      hideLoader()
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchCategories()
    }, [])
  )

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert("Error", "Please enter a category name")
      return
    }

    showLoader()
    try {
      await addCategory(newCategory.trim())
      setNewCategory("")
      fetchCategories()
      Alert.alert("Success", "Category added successfully")
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add category")
    } finally {
      hideLoader()
    }
  }

  const handleDeleteCategory = (id: string, name: string) => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            showLoader()
            try {
              await deleteCategory(id)
              fetchCategories()
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete category")
            } finally {
              hideLoader()
            }
          }
        }
      ]
    )
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
    <View className="flex-1 bg-gray-50 p-4">
      <TouchableOpacity
        className="flex-row items-center mb-6"
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back-ios" size={24} color="#374151" />
        <Text className="text-gray-800 font-medium ml-1">Back</Text>
      </TouchableOpacity>
      <Text className="text-2xl font-bold text-amber-900 mb-6">Product Categories</Text>

      {/* Add Category Form */}
      <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-200 shadow-sm">
        <Text className="text-gray-800 font-semibold mb-3">Add New Category</Text>
        <View className="flex-row">
          <TextInput
            placeholder="Enter category name"
            className="flex-1 border border-gray-300 bg-white p-3 rounded-l-xl"
            value={newCategory}
            onChangeText={setNewCategory}
          />
          <TouchableOpacity
            onPress={handleAddCategory}
            className="bg-amber-600 px-6 rounded-r-xl justify-center"
          >
            <Text className="text-white font-semibold">Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories List */}
      <ScrollView>
        {categories.length === 0 ? (
          <View className="items-center justify-center py-10">
            <MaterialIcons name="category" size={60} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-lg">No categories found</Text>
          </View>
        ) : (
          categories.map((category) => (
            <View
              key={category.id}
              className="bg-white rounded-2xl p-4 mb-3 border border-gray-200 shadow-sm flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View className="bg-amber-100 p-3 rounded-full mr-4">
                  <MaterialIcons name="label" size={24} color="#b45309" />
                </View>
                <View>
                  <Text className="text-lg font-semibold text-gray-900">{category.name}</Text>
                  <Text className="text-gray-500 text-sm">
                    {category.productCount || 0} products
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteCategory(category.id, category.name)}
                className="bg-red-100 p-2 rounded-full"
              >
                <MaterialIcons name="delete" size={20} color="#dc2626" />
              </TouchableOpacity>
            </View>               
          ))
        )}
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

export default Categories




