import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

const ThankYou = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-green-50 justify-center items-center p-6">
      <Text className="text-5xl font-bold text-green-600 mb-4">Thank You!</Text>
      <Text className="text-xl text-gray-700 text-center mb-8">
        Your order has been placed successfully. We'll notify you when it's on the way.
      </Text>
      <Pressable
        onPress={() => router.replace("/userHome")}
        className="bg-green-600 py-4 px-8 rounded-xl"
      >
        <Text className="text-white font-bold text-lg">Continue Shopping</Text>
      </Pressable>
    </View>
  );
};

export default ThankYou;