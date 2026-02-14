import { MaterialIcons } from "@expo/vector-icons"
import { View, Text } from "react-native"

const Confirm = () => {

    return (
        <View className="flex-1 items-center justify-center bg-gray-50">
            <MaterialIcons name="check-circle" size={100} color="#16a34a" />
            <Text className="text-2xl font-bold text-gray-900 mt-4">Order Confirmed!</Text>
            <Text className="text-gray-600 mt-2">Thank you for your purchase. Your order has been placed successfully.</Text>
        </View>
    )
}