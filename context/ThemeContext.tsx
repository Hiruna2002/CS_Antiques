import React, { createContext, useState, ReactNode, useContext, useEffect } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDarkMode: boolean
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  isDarkMode: false
})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme()
  const [theme, setThemeState] = useState<Theme>("system")

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("app-theme")
      if (savedTheme) {
        setThemeState(savedTheme as Theme)
      }
    } catch (error) {
      console.error("Failed to load theme", error)
    }
  }

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme)
    try {
      await AsyncStorage.setItem("app-theme", newTheme)
    } catch (error) {
      console.error("Failed to save theme", error)
    }
  }

  const isDarkMode =
    theme === "dark" || (theme === "system" && systemColorScheme === "dark")

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}