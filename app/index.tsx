import { useAuth } from "@/hooks/useAuth"
import { Redirect } from "expo-router"
import { ActivityIndicator, Text, View } from "react-native"
import "../global.css"


const Index = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      // <View className="flex-1 justify-center items-center bg-amber-50">
      //   <ActivityIndicator size="large" color="#b45309" />
      // </View>

      <View>
        <Text className="font-bold ">Sample</Text>
      </View>
    )
  }

  if (user) {
    return <Redirect href="/home" />
  } else {
    return <Redirect href="/login" />
  }
}

export default Index