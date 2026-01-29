// import { doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore"
// import { db, getAuthInstance } from "./firebase"
// // import { getAuth } from "firebase/auth"

// const auth = getAuth()

// export interface AnalyticsData {
//   totalViews: number
//   uniqueVisitors: number
//   totalSales: number
//   conversionRate: number
//   popularProducts: string[]
//   peakHours: number[]
// }

// export const trackProductView = async (productId: string) => {
//   try {
//     const user = auth.currentUser
//     if (!user) return

//     const today = new Date().toISOString().split("T")[0]
//     const analyticsRef = doc(db, "analytics", user.uid, "products", productId)
//     const dateRef = doc(db, "analytics", user.uid, "dates", today)

//     // Update product views
//     await updateDoc(analyticsRef, {
//       views: increment(1),
//       lastViewed: new Date().toISOString()
//     }).catch(async () => {
//       // Create if doesn't exist
//       await setDoc(analyticsRef, {
//         productId,
//         views: 1,
//         lastViewed: new Date().toISOString()
//       })
//     })

//     // Update daily stats
//     await updateDoc(dateRef, {
//       date: today,
//       productViews: increment(1),
//       lastUpdated: new Date().toISOString()
//     }).catch(async () => {
//       await setDoc(dateRef, {
//         date: today,
//         productViews: 1,
//         orders: 0,
//         revenue: 0,
//         lastUpdated: new Date().toISOString()
//       })
//     })
//   } catch (error) {
//     console.error("Failed to track product view:", error)
//   }
// }

// export const trackOrderCompleted = async (
//   orderId: string,
//   amount: number,
//   productIds: string[]
// ) => {
//   try {
//     const user = auth.currentUser
//     if (!user) return

//     const today = new Date().toISOString().split("T")[0]
//     const dateRef = doc(db, "analytics", user.uid, "dates", today)

//     // Update daily stats
//     await updateDoc(dateRef, {
//       orders: increment(1),
//       revenue: increment(amount),
//       lastUpdated: new Date().toISOString()
//     }).catch(async () => {
//       await setDoc(dateRef, {
//         date: today,
//         productViews: 0,
//         orders: 1,
//         revenue: amount,
//         lastUpdated: new Date().toISOString()
//       })
//     })

//     // Update product sales
//     for (const productId of productIds) {
//       const productRef = doc(db, "analytics", user.uid, "products", productId)
//       await updateDoc(productRef, {
//         sales: increment(1),
//         revenue: increment(amount / productIds.length)
//       }).catch(async () => {
//         await setDoc(productRef, {
//           productId,
//           sales: 1,
//           revenue: amount / productIds.length,
//           views: 0
//         })
//       })
//     }
//   } catch (error) {
//     console.error("Failed to track order:", error)
//   }
// }

// export const getProductAnalytics = async (productId: string) => {
//   try {
//     const user = auth.currentUser
//     if (!user) throw new Error("User not authenticated.")

//     const productRef = doc(db, "analytics", user.uid, "products", productId)
//     const snapshot = await getDoc(productRef)

//     if (snapshot.exists()) {
//       return snapshot.data()
//     }

//     return {
//       views: 0,
//       sales: 0,
//       revenue: 0,
//       conversionRate: 0
//     }
//   } catch (error: any) {
//     throw new Error(error.message || "Failed to get product analytics.")
//   }
// }

// export const getDailyAnalytics = async (date?: string) => {
//   try {
//     const user = auth.currentUser
//     if (!user) throw new Error("User not authenticated.")

//     const targetDate = date || new Date().toISOString().split("T")[0]
//     const dateRef = doc(db, "analytics", user.uid, "dates", targetDate)
//     const snapshot = await getDoc(dateRef)

//     if (snapshot.exists()) {
//       const data = snapshot.data()
//       const conversionRate = data.productViews > 0 
//         ? (data.orders / data.productViews) * 100 
//         : 0
      
//       return {
//         ...data,
//         conversionRate: parseFloat(conversionRate.toFixed(2))
//       }
//     }

//     return {
//       date: targetDate,
//       productViews: 0,
//       orders: 0,
//       revenue: 0,
//       conversionRate: 0
//     }
//   } catch (error: any) {
//     throw new Error(error.message || "Failed to get daily analytics.")
//   }
// }

// export const getMonthlyAnalytics = async (year: number, month: number) => {
//   try {
//     const user = auth.currentUser
//     if (!user) throw new Error("User not authenticated.")

//     // This would require a more complex query in a real app
//     // For simplicity, we'll return mock data
//     return {
//       year,
//       month,
//       totalViews: 0,
//       totalOrders: 0,
//       totalRevenue: 0,
//       averageOrderValue: 0,
//       topProducts: []
//     }
//   } catch (error: any) {
//     throw new Error(error.message || "Failed to get monthly analytics.")
//   }
// }

// export const getPopularProducts = async (limit: number = 5) => {
//   try {
//     const user = auth.currentUser
//     if (!user) throw new Error("User not authenticated.")

//     // In a real app, you would query the analytics collection
//     // For now, return mock data
//     return [
//       { id: "1", name: "Vintage Clock", views: 150, sales: 12 },
//       { id: "2", name: "Antique Vase", views: 120, sales: 8 },
//       { id: "3", name: "Old Book Collection", views: 90, sales: 5 },
//       { id: "4", name: "Classic Camera", views: 85, sales: 4 },
//       { id: "5", name: "Retro Telephone", views: 70, sales: 3 },
//     ]
//   } catch (error: any) {
//     throw new Error(error.message || "Failed to get popular products.")
//   }
// }






// services/analyticsService.ts
import { doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";
import { db, getAuthInstance } from "./firebase";

export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  totalSales: number;
  conversionRate: number;
  popularProducts: string[];
  peakHours: number[];
}

const nowIso = () => new Date().toISOString();
const todayKey = () => new Date().toISOString().split("T")[0];

async function getCurrentUserOrThrow() {
  const auth = getAuthInstance(); // runtime-safe
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated.");
  return user;
}

/**
 * Safely track a product view for the currently authenticated user.
 */
export const trackProductView = async (productId: string) => {
  try {
    const user = await getCurrentUserOrThrow();

    const today = todayKey();
    const analyticsRef = doc(db, "analytics", user.uid, "products", productId);
    const dateRef = doc(db, "analytics", user.uid, "dates", today);

    // Update product views (create if missing)
    await updateDoc(analyticsRef, {
      views: increment(1),
      lastViewed: nowIso(),
    }).catch(async () => {
      await setDoc(analyticsRef, {
        productId,
        views: 1,
        lastViewed: nowIso(),
      });
    });

    // Update daily stats (create if missing)
    await updateDoc(dateRef, {
      date: today,
      productViews: increment(1),
      lastUpdated: nowIso(),
    }).catch(async () => {
      await setDoc(dateRef, {
        date: today,
        productViews: 1,
        orders: 0,
        revenue: 0,
        lastUpdated: nowIso(),
      });
    });
  } catch (error) {
    // keep same behaviour as before: log but don't crash app
    console.error("Failed to track product view:", error);
  }
};

/**
 * Track completed order: update daily stats and product sales.
 */
export const trackOrderCompleted = async (
  orderId: string,
  amount: number,
  productIds: string[]
) => {
  try {
    const user = await getCurrentUserOrThrow();

    const today = todayKey();
    const dateRef = doc(db, "analytics", user.uid, "dates", today);

    // Update daily stats (create if missing)
    await updateDoc(dateRef, {
      orders: increment(1),
      revenue: increment(amount),
      lastUpdated: nowIso(),
    }).catch(async () => {
      await setDoc(dateRef, {
        date: today,
        productViews: 0,
        orders: 1,
        revenue: amount,
        lastUpdated: nowIso(),
      });
    });

    // Update per-product sales
    for (const productId of productIds) {
      const productRef = doc(db, "analytics", user.uid, "products", productId);
      await updateDoc(productRef, {
        sales: increment(1),
        revenue: increment(amount / productIds.length),
      }).catch(async () => {
        await setDoc(productRef, {
          productId,
          sales: 1,
          revenue: amount / productIds.length,
          views: 0,
        });
      });
    }
  } catch (error) {
    console.error("Failed to track order:", error);
  }
};

/**
 * Get analytics for a single product.
 */
export const getProductAnalytics = async (productId: string) => {
  try {
    const user = await getCurrentUserOrThrow();

    const productRef = doc(db, "analytics", user.uid, "products", productId);
    const snapshot = await getDoc(productRef);

    if (snapshot.exists()) {
      return snapshot.data();
    }

    return {
      views: 0,
      sales: 0,
      revenue: 0,
      conversionRate: 0,
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to get product analytics.");
  }
};

/**
 * Get daily analytics for a specific date (defaults to today).
 */
export const getDailyAnalytics = async (date?: string) => {
  try {
    const user = await getCurrentUserOrThrow();

    const targetDate = date || todayKey();
    const dateRef = doc(db, "analytics", user.uid, "dates", targetDate);
    const snapshot = await getDoc(dateRef);

    if (snapshot.exists()) {
      const data: any = snapshot.data();
      const conversionRate =
        (data.productViews && data.productViews > 0)
          ? (data.orders / data.productViews) * 100
          : 0;

      return {
        ...data,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
      };
    }

    return {
      date: targetDate,
      productViews: 0,
      orders: 0,
      revenue: 0,
      conversionRate: 0,
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to get daily analytics.");
  }
};

/**
 * Monthly analytics stub (requires server-side aggregation for real data).
 */
export const getMonthlyAnalytics = async (year: number, month: number) => {
  try {
    await getCurrentUserOrThrow();
    // Return stub — implement proper aggregation / queries on server or Cloud Functions
    return {
      year,
      month,
      totalViews: 0,
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      topProducts: [],
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to get monthly analytics.");
  }
};

/**
 * Popular products stub (replace with real query/aggregation as needed)
 */
export const getPopularProducts = async (limit: number = 5) => {
  try {
    await getCurrentUserOrThrow();
    return [
      { id: "1", name: "Vintage Clock", views: 150, sales: 12 },
      { id: "2", name: "Antique Vase", views: 120, sales: 8 },
      { id: "3", name: "Old Book Collection", views: 90, sales: 5 },
      { id: "4", name: "Classic Camera", views: 85, sales: 4 },
      { id: "5", name: "Retro Telephone", views: 70, sales: 3 },
    ].slice(0, limit);
  } catch (error: any) {
    throw new Error(error?.message || "Failed to get popular products.");
  }
};
