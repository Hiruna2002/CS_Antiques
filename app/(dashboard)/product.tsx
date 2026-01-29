import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    TextInput, 
    Alert, 
    RefreshControl, 
    ActivityIndicator,
    Image
} from "react-native"
import React, { useCallback, useEffect, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { router, useFocusEffect, useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { getAllProducts, addProduct, deleteProduct, searchProducts } from "@/services/productServices"
import { Product } from "@/types/product"
// import { useCart } from "@/hooks/useCart"

const Products = () => {
    const router = useRouter()
//   const { addToCart } = useCart()
  const { showLoader, hideLoader } = useLoader()
  
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [categories, setCategories] = useState<string[]>(["All"])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await getAllProducts()
      console.log(data)
      setProducts(data)
      setFilteredProducts(data)
      
      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(data.map(p => p.category))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchProducts().finally(() => setRefreshing(false))
  }, [])

  const handleSearch = async (text: string) => {
    setSearchQuery(text)
    if (text.trim() === "") {
      applyCategoryFilter(selectedCategory, products)
    } else {
      try {
        const results = await searchProducts(text)
        setFilteredProducts(results)
      } catch (error) {
        console.error("Search error:", error)
      }
    }
  }

  const applyCategoryFilter = (category: string, productList: Product[]) => {
    if (category === "All") {
      setFilteredProducts(productList)
    } else {
      const filtered = productList.filter(p => p.category === category)
      setFilteredProducts(filtered)
    }
    setSelectedCategory(category)
  }

//   const handleAddToCart = (product: Product) => {
//     addToCart(product, 1)
//     // Show success message
//     alert(`${product.name} added to cart!`)
//   }

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("sl-Rs.", {
//       style: "currency",
//       currency: "Rs."
//     }).format(price)
//   }

    const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",               // ISO 4217 code for Sri Lankan rupee
        currencyDisplay: "narrowSymbol", // show compact symbol if available ("Rs")
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })
        .format(price)
        .replace("LKR", "Rs.");

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#b45309" />
        <Text className="mt-4 text-gray-600">Loading products...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
        <TouchableOpacity
            className="flex-row items-center mb-6"
            onPress={() => router.back()}
        >
            <MaterialIcons name="arrow-back-ios" size={24} color="#374151" />
            <Text className="text-gray-800 font-medium ml-1">Back</Text>
        </TouchableOpacity>
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-amber-900">CS Antiques</Text>
        <Text className="text-gray-600">Discover unique antique items</Text>
        
        {/* Search Bar */}
        <View className="mt-4 flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
          <MaterialIcons name="search" size={20} color="#6b7280" />
          <TextInput
            placeholder="Search antiques..."
            className="flex-1 ml-2 text-gray-800"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="px-4 py-1 bg-white border-b border-gray-200 h-5"
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => applyCategoryFilter(category, products)}
            className={`px-4 py-2 mr-2 rounded-full h-10 ${
              selectedCategory === category 
                ? "bg-amber-600" 
                : "bg-gray-100"
            }`}
          >
            <Text className={`${
              selectedCategory === category 
                ? "text-white font-semibold" 
                : "text-gray-700"
            }`}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      <ScrollView 
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-row flex-wrap justify-between">
          {filteredProducts.length === 0 ? (
            <View className="w-full items-center justify-center py-10">
              <MaterialIcons name="inventory" size={60} color="#d1d5db" />
              <Text className="text-gray-500 mt-4 text-lg">No products found</Text>
            </View>
          ) : (
            filteredProducts.map((product) => (
              <View 
                key={product.id} 
                className="w-[48%] bg-white rounded-2xl mb-4 border border-gray-200 shadow-sm overflow-hidden"
              >
                <TouchableOpacity
                //   onPress={() => router.push(`/(dashboard)/product/${product.id}`)}
                //   onPress={() => router.push(`/user/product/${product.id}`)}
                >
                  {/* Product Image */}
                  <View className="h-40 bg-gray-100">
                    {product.imageUrl ? (
                      <Image
                        source={{ uri: product.imageUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="flex-1 items-center justify-center">
                        <MaterialIcons name="photo" size={40} color="#9ca3af" />
                      </View>
                    )}
                  </View>

                  {/* Product Info */}
                  <View className="p-3">
                    <Text 
                      className="text-gray-900 font-semibold mb-1"
                      numberOfLines={1}
                    >
                      {product.name}
                    </Text>
                    <Text 
                      className="text-gray-600 text-xs mb-2"
                      numberOfLines={2}
                    >
                      {product.description}
                    </Text>
                    
                    <View className="flex-row justify-between items-center">
                      <Text className="text-amber-700 font-bold">
                        {formatPrice(product.price)}
                      </Text>
                      <View className={`px-2 py-1 rounded ${
                        product.stock < 10 
                          ? "bg-red-100" 
                          : product.stock < 20 
                            ? "bg-yellow-100" 
                            : "bg-green-100"
                      }`}>
                        <Text className={`text-xs ${
                          product.stock < 10 
                            ? "text-red-800" 
                            : product.stock < 20 
                              ? "text-yellow-800" 
                              : "text-green-800"
                        }`}>
                          {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default Products