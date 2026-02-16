import { doc, setDoc } from "firebase/firestore";
import { db, getAuthInstance } from "./firebase";
import { Customer } from "./customerService";

export interface OrderDetail {
    userId: string;
    // productId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
    totalPrice: number;
    saveDetails: boolean;
    paymentMethod?: string;
    cardDetails?: any;
}

const getCurrentUser = () => {
    const auth = getAuthInstance();
    return auth.currentUser;
}
  
export const saveCustomerDetails = async (
    total: number,
    items: any[],
    paymentMethod: string,
    cardDetails: any,
) => {
    try {
        const firstItem = items[0] || {}

        const customerDetails: OrderDetail = {    
            userId: getCurrentUser()?.uid || "",
            // productId: firstItem.productId || "",
            items: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
            fullName: firstItem?.form?.fullName || "",
            email: firstItem?.form?.email || "",
            phone: firstItem?.form?.phone || "",
            address: firstItem?.form?.address || "",
            city: firstItem?.form?.city || "",
            zipCode: firstItem?.form?.zipCode || "",
            country: firstItem?.form?.country || "",
            totalPrice: total,
            paymentMethod,
            cardDetails,
            saveDetails: firstItem?.form?.saveAddress || false,
        }
        

        console.log("Saving customer details:", customerDetails)
        await setDoc(doc(db, "customerDetails", `${getCurrentUser()?.uid}_${Date.now()}`), customerDetails)
    } catch (error) {
        console.error("Error saving customer details:", error)
    }
}

