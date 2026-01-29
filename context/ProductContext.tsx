import React, { createContext, useState, ReactNode, useContext } from "react"
import { Product } from "@/types/product"

interface ProductContextType {
  products: Product[]
  setProducts: (products: Product[]) => void
  selectedProduct: Product | null
  setSelectedProduct: (product: Product | null) => void
  refreshProducts: () => void
}

export const ProductContext = createContext<ProductContextType>({
  products: [],
  setProducts: () => {},
  selectedProduct: null,
  setSelectedProduct: () => {},
  refreshProducts: () => {}
})

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const refreshProducts = () => {
    // This function can be implemented to refetch products
    console.log("Refreshing products...")
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        selectedProduct,
        setSelectedProduct,
        refreshProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProduct = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider")
  }
  return context
}