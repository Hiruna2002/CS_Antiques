// import { useState } from "react";
// import { View, Text, TextInput, ScrollView, Pressable, Alert } from "react-native";
// import { useCart } from "@/context/CartContext";
// import { useRouter } from "expo-router";

// const PlaceOrder = () => {
//   const { cart, totalPrice, clearCart } = useCart();
//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [address, setAddress] = useState("");
//   const [city, setCity] = useState("");
//   const [cardNumber, setCardNumber] = useState("");
//   const [expiry, setExpiry] = useState("");
//   const [cvv, setCvv] = useState("");

//   const handlePlaceOrder = () => {
//     if (!name || !address || !city || !cardNumber || !expiry || !cvv) {
//       Alert.alert("Error", "Please fill all fields");
//       return;
//     }

//     // Simulate payment
//     Alert.alert("Success", "Order placed successfully!");
//     clearCart();
//     router.push("/thankyou");
//   };

//   return (
//     <ScrollView className="flex-1 bg-gray-50 p-4">
//       <Text className="text-2xl font-bold mb-6">Place Your Order</Text>

//       {/* Shipping Address */}
//       <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
//         <Text className="text-xl font-semibold mb-4">Shipping Address</Text>
//         <TextInput
//           placeholder="Full Name"
//           className="border border-gray-300 p-3 rounded-xl mb-4"
//           value={name}
//           onChangeText={setName}
//         />
//         <TextInput
//           placeholder="Address"
//           className="border border-gray-300 p-3 rounded-xl mb-4"
//           value={address}
//           onChangeText={setAddress}
//           multiline
//         />
//         <TextInput
//           placeholder="City"
//           className="border border-gray-300 p-3 rounded-xl"
//           value={city}
//           onChangeText={setCity}
//         />
//       </View>

//       {/* Product Details */}
//       <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
//         <Text className="text-xl font-semibold mb-4">Order Summary</Text>
//         {cart.map(item => (
//           <View key={item.id} className="flex-row justify-between mb-2">
//             <Text>{item.name} x {item.qty}</Text>
//             <Text>Rs. {item.price * item.qty}</Text>
//           </View>
//         ))}
//         <View className="border-t border-gray-200 pt-4 mt-2 flex-row justify-between">
//           <Text className="font-bold">Total</Text>
//           <Text className="font-bold text-amber-600">Rs. {totalPrice}</Text>
//         </View>
//       </View>

//       {/* Payment Method */}
//       <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
//         <Text className="text-xl font-semibold mb-4">Payment Method</Text>
//         <Text className="text-gray-600 mb-4">Credit/Debit Card</Text>
//         <TextInput
//           placeholder="Card Number"
//           keyboardType="number-pad"
//           className="border border-gray-300 p-3 rounded-xl mb-4"
//           value={cardNumber}
//           onChangeText={setCardNumber}
//           maxLength={16}
//         />
//         <View className="flex-row space-x-4">
//           <TextInput
//             placeholder="MM/YY"
//             className="flex-1 border border-gray-300 p-3 rounded-xl"
//             value={expiry}
//             onChangeText={setExpiry}
//             maxLength={5}
//           />
//           <TextInput
//             placeholder="CVV"
//             keyboardType="number-pad"
//             className="flex-1 border border-gray-300 p-3 rounded-xl"
//             value={cvv}
//             onChangeText={setCvv}
//             maxLength={3}
//             secureTextEntry
//           />
//         </View>
//       </View>

//       <Pressable
//         onPress={handlePlaceOrder}
//         className="bg-green-600 py-5 rounded-xl items-center"
//       >
//         <Text className="text-white font-bold text-lg">Place Order</Text>
//       </Pressable>
//     </ScrollView>
//   );
// };

// export default PlaceOrder;