declare module "@/hooks/useLoader" {
  export const useLoader: () => {
    showLoader: () => void;
    hideLoader: () => void;
    isLoading: boolean;
  };
}

declare module "@/hooks/useAuth" {
  export const useAuth: () => {
    user: any;
    loading: boolean;
    setUser: (user: any) => void;
  };
}

declare module "@/hooks/useTheme" {
  export const useTheme: () => {
    theme: "light" | "dark" | "system";
    setTheme: (theme: "light" | "dark" | "system") => void;
    isDarkMode: boolean;
  };
}

declare module "@/hooks/useCart" {
  export const useCart: () => {
    cartItems: any[];
    addToCart: (product: any, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
  };
}