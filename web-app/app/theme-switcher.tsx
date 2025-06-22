"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Laptop } from "lucide-react"

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Tampilkan placeholder atau null saat komponen belum di-mount di client
    return <div className="w-10 h-10" />; 
  }

  return (
    <div className="flex items-center space-x-2 bg-slate-200 dark:bg-slate-800 p-1 rounded-full">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-full transition-colors duration-200 ${
          theme === "light" ? "bg-cyan-500 text-white" : "text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-700"
        }`}
        aria-label="Light Mode"
      >
        <Sun size={18} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-full transition-colors duration-200 ${
          theme === "dark" ? "bg-cyan-500 text-white" : "text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-700"
        }`}
        aria-label="Dark Mode"
      >
        <Moon size={18} />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-full transition-colors duration-200 ${
          theme === "system" ? "bg-cyan-500 text-white" : "text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-700"
        }`}
        aria-label="System Mode"
      >
        <Laptop size={18} />
      </button>
    </div>
  )
}