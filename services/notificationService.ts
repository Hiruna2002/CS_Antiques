// import * as Notifications from "expo-notifications"
// import * as Device from "expo-device"
// import { Platform } from "react-native"
// import AsyncStorage from "@react-native-async-storage/async-storage"

// // Configure notifications
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//     shouldShowBanner: true,
//     shouldShowList: true
//   }),
// })

// export const registerForPushNotificationsAsync = async () => {
//   try {
//     let token

//     if (Device.isDevice) {
//       const { status: existingStatus } = await Notifications.getPermissionsAsync()
//       let finalStatus = existingStatus

//       if (existingStatus !== "granted") {
//         const { status } = await Notifications.requestPermissionsAsync()
//         finalStatus = status
//       }

//       if (finalStatus !== "granted") {
//         throw new Error("Failed to get push token for push notification!")
//       }

//       token = (await Notifications.getExpoPushTokenAsync()).data
      
//       // Save token to AsyncStorage
//       await AsyncStorage.setItem("expoPushToken", token)
//     } else {
//       console.log("Must use physical device for Push Notifications")
//     }

//     if (Platform.OS === "android") {
//       Notifications.setNotificationChannelAsync("default", {
//         name: "default",
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: "#FF231F7C",
//       })
//     }

//     return token
//   } catch (error: any) {
//     console.error("Failed to register for push notifications:", error)
//     return null
//   }
// }

// export const scheduleOrderNotification = async (
//   orderNumber: string,
//   customerName: string,
//   delayInSeconds: number = 5
// ) => {
//   try {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "New Order Received!",
//         body: `Order #${orderNumber} from ${customerName}`,
//         data: { orderNumber, customerName },
//         sound: "default",
//       },
//       trigger: { seconds: delayInSeconds },
//     })
//   } catch (error) {
//     console.error("Failed to schedule notification:", error)
//   }
// }

// export const scheduleLowStockNotification = async (
//   productName: string,
//   currentStock: number
// ) => {
//   try {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "Low Stock Alert",
//         body: `${productName} is running low (${currentStock} left)`,
//         data: { productName, currentStock },
//         sound: "default",
//       },
//       trigger: { seconds: 2 },
//     })
//   } catch (error) {
//     console.error("Failed to schedule low stock notification:", error)
//   }
// }

// export const sendDailySummaryNotification = async (
//   totalOrders: number,
//   totalRevenue: number,
//   newCustomers: number
// ) => {
//   try {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "Daily Summary",
//         body: `Today: ${totalOrders} orders, $${totalRevenue} revenue, ${newCustomers} new customers`,
//         data: { totalOrders, totalRevenue, newCustomers },
//         sound: "default",
//       },
//       trigger: {
//         hour: 20,
//         minute: 0,
//         repeats: true,
//       },
//     })
//   } catch (error) {
//     console.error("Failed to schedule daily summary:", error)
//   }
// }

// export const cancelAllNotifications = async () => {
//   try {
//     await Notifications.cancelAllScheduledNotificationsAsync()
//   } catch (error) {
//     console.error("Failed to cancel notifications:", error)
//   }
// }

// export const getScheduledNotifications = async () => {
//   try {
//     const scheduled = await Notifications.getAllScheduledNotificationsAsync()
//     return scheduled
//   } catch (error) {
//     console.error("Failed to get scheduled notifications:", error)
//     return []
//   }
// }



// notificationService.ts
import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Configure notifications — include all NotificationBehavior props
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true
  }),
})

export const registerForPushNotificationsAsync = async () => {
  try {
    let token: string | undefined

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== "granted") {
        throw new Error("Failed to get push token for push notification!")
      }

      token = (await Notifications.getExpoPushTokenAsync()).data

      // Save token to AsyncStorage
      await AsyncStorage.setItem("expoPushToken", token)
    } else {
      console.log("Must use physical device for Push Notifications")
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    }

    return token
  } catch (error: any) {
    console.error("Failed to register for push notifications:", error)
    return null
  }
}

/**
 * Schedule a short time-interval notification.
 * NOTE: include `type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL`
 */
export const scheduleOrderNotification = async (
  orderNumber: string,
  customerName: string,
  delayInSeconds: number = 5
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Order Received!",
        body: `Order #${orderNumber} from ${customerName}`,
        data: { orderNumber, customerName },
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delayInSeconds,
        repeats: false,
      },
    })
  } catch (error) {
    console.error("Failed to schedule notification:", error)
  }
}

/**
 * Low stock alert after a short delay (example).
 */
export const scheduleLowStockNotification = async (
  productName: string,
  currentStock: number
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Low Stock Alert",
        body: `${productName} is running low (${currentStock} left)`,
        data: { productName, currentStock },
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
        repeats: false,
      },
    })
  } catch (error) {
    console.error("Failed to schedule low stock notification:", error)
  }
}

/**
 * Daily summary at a fixed hour/minute.
 * Use the DAILY trigger type (or CALENDAR-based triggers) — test on device & platform.
 * On Android some calendar-like triggers have historically had platform limitations;
 * if you need cross-platform exact scheduling, consider a server push or verify behavior in release builds.
 */
export const sendDailySummaryNotification = async (
  totalOrders: number,
  totalRevenue: number,
  newCustomers: number
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Summary",
        body: `Today: ${totalOrders} orders, $${totalRevenue} revenue, ${newCustomers} new customers`,
        data: { totalOrders, totalRevenue, newCustomers },
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 20,
        minute: 0,
      },
    })
  } catch (error) {
    console.error("Failed to schedule daily summary:", error)
  }
}

export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync()
  } catch (error) {
    console.error("Failed to cancel notifications:", error)
  }
}

export const getScheduledNotifications = async () => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync()
    return scheduled
  } catch (error) {
    console.error("Failed to get scheduled notifications:", error)
    return []
  }
}
