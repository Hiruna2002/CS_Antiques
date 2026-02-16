import { Picker } from '@react-native-picker/picker'
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Button,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { registerUser } from "@/services/authService";

const Register = () => {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(24)).current;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"customer" | "admin" | "">("")
  const [showPicker, setShowPicker] = useState(false)

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

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword || !role) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!email.trim()) {
    //   Alert.alert("Email is required");
    // } else if (!emailRegex.test(email)) {
    //   Alert.alert("Please enter a valid email");
    // }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Call registerUser with dynamic values
      await registerUser(name.trim(), email.trim(), password.trim(), confirmPassword.trim(), role.trim());

      Alert.alert("Success", "Account created successfully!");
      router.push("/login");
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar barStyle="dark-content" />
        
        <Animated.View 
          style={{ 
            opacity: fade, 
            transform: [{ translateY: translate }] 
          }}
        >
          {/* Brand Header */}
          <View className="items-center mb-10">
            <View 
              style={{ borderColor: GOLD }} 
              className="w-16 h-16 border-2 rounded-full items-center justify-center mb-4"
            >
              <Image
                source={require("../../assets/images/CS Logo.png")}
                className="w-16 h-16 rounded-full"
                resizeMode="contain"
              />
            </View>
            <Text className="text-2xl font-bold text-gray-900 tracking-tighter">
              JOIN THE HERITAGE
            </Text>
            <View style={{ backgroundColor: GOLD }} className="h-[1px] w-12 mt-2" />
          </View>

          {/* Form Fields */}
          <View className="space-y-6">
            <View>
              <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1 mt-3" id="name">
                Full Name
              </Text>
              <TextInput
                placeholder="Ex: John Doe"
                placeholderTextColor="#A1A1AA"
                className="border-b border-gray-200 py-2 px-1 text-lg"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View className="mt-4">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1 mt-3">
                Email Address
              </Text>
              <TextInput
                placeholder="email@example.com"
                placeholderTextColor="#A1A1AA"
                keyboardType="email-address"
                autoCapitalize="none"
                className="border-b border-gray-200 py-2 px-1 text-lg"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="mt-4">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1 mt-3">
                Password
              </Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#A1A1AA"
                secureTextEntry
                className="border-b border-gray-200 py-2 px-1 text-lg"
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View className="mt-4">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1 mt-3">
                Confirm Password
              </Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#A1A1AA"
                secureTextEntry
                className="border-b border-gray-200 py-2 px-1 text-lg"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
            {/* <View style={{ zIndex: 10 }}>
              <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1">
                Role
              </Text>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue as "customer" | "admin")}
                style={{ height:50, position:'relative', top:-70, color: "#111827" }}
                
                dropdownIconColor="#111827"
              >
              <Picker.Item label="Select Role" value="" />
              <Picker.Item label="Customer" value="customer" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>
              
            </View> */}
          </View>

          {/* <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={{
              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 8,
              padding: 15,
            }}
          >
            <Text style={{ color: role ? "#111827" : "#111827" }}>
              {role ? role : "Select Role"}
            </Text>
          </TouchableOpacity> */}

          <View className="mt-4">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1 mt-3">
              Role
            </Text>

            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              className="border-b border-gray-200 py-2 px-1"
            >
              <Text
                className="text-lg"
                style={{ color: role ? "#111827" : "#A1A1AA" }}
              >
                {role
                  ? role.charAt(0).toUpperCase() + role.slice(1)
                  : "Select Role"}
              </Text>
            </TouchableOpacity>
          </View>

          <Modal visible={showPicker} transparent animationType="slide">
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <View
                style={{
                  backgroundColor: "black",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  paddingBottom: 30,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 16,
                  }}
                >
                  <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Text style={{ color: "#999" }}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Text style={{ color: "#D4AF37", fontWeight: "600" }}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>

                <Picker
                  selectedValue={role}
                  onValueChange={(itemValue) =>
                    setRole(itemValue as "customer" | "admin")
                  }
                >
                  <Picker.Item label="Customer" value="customer" />
                  <Picker.Item label="Admin" value="admin" />
                </Picker>
              </View>
            </View>
          </Modal>



          {/* Action Button */}
          <Pressable 
            onPress={handleRegister}
            style={{ backgroundColor: GOLD }}
            className="mt-10 py-4 rounded-full items-center shadow-lg active:opacity-90"
          >
            <Text className="text-white font-bold tracking-[2px] text-sm">
              CREATE ACCOUNT
            </Text>
          </Pressable>

          {/* Navigation Back */}
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mt-8 items-center mb-10"
          >
            <Text className="text-gray-400 text-[10px] tracking-widest uppercase">
              Already a member? <Text style={{ color: GOLD, fontWeight: 'bold' }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;