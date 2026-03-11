import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { login, getRole } from "@/services/authService";

const Login = () => {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(24)).current;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Gold Color Constant
  const GOLD = "#D4AF37";

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
          Alert.alert("Error", "Please fill all fields");
          return;
    }

    try {
      const result = await login(email.trim(), password.trim());

    if (result.role === "admin") {
      router.push("/home");
    } else {
      router.push("/(user)/(tabs)/userHome");
    }
          // await login(email.trim(), password.trim(),)

          // // router.push("/home");
          // router.push("/(user)/(tabs)/userHome")
        } catch (error: any) {
          Alert.alert("Registration Failed", error.message || "Something went wrong");
        }
  }

  function createNewAccount() {
    router.push("/register")
  }

  return (
    <View className="flex-1 bg-white justify-center px-8">
      <StatusBar barStyle="dark-content" />
      
      <Animated.View 
        style={{ 
          opacity: fade, 
          transform: [{ translateY: translate }] 
        }}
      >
        {/* Minimalist Gold Logo/Header */}
        <View className="items-center mb-12">
          <View 
            style={{ borderColor: GOLD }} 
            className="w-20 h-20 border-2 rounded-full items-center justify-center mb-6"
          >
            <Image
              source={require("../../assets/images/CS Logo.png")}
              className="w-20 h-20 rounded-full"
              resizeMode="contain"
            />
          </View>
          <Text className="text-3xl font-bold text-gray-900 tracking-tighter">
            CS ANTIQUES
          </Text>
          <View style={{ backgroundColor: GOLD }} className="h-[1px] w-12 mt-2" />
        </View>

        <View className="space-y-5">
          <View>
            <Text className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">
              Email:
            </Text>
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#A1A1AA"
              className="border-b border-gray-200 py-3 px-1 text-lg"
              style={{ borderBottomColor: '#E5E7EB' }}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="mt-4">
            <Text className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">
              Password:
            </Text>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#A1A1AA"
              secureTextEntry
              className="border-b border-gray-200 py-3 px-1 text-lg"
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        {/* Gold Action Button */}
        <Pressable 
          onPress={handleLogin}
          style={{ backgroundColor: GOLD }}
          className="mt-12 py-4 rounded-full items-center shadow-md"
        >
          <Text className="text-white font-bold tracking-[2px] text-sm">
            Login
          </Text>
        </Pressable>

        <TouchableOpacity 
          onPress={createNewAccount}
          className="mt-8 items-center">
          <Text className="text-gray-400 text-xs tracking-widest uppercase">
            Create an Account
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Login;