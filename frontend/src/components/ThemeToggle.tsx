import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-sm ${
        isDark 
          ? 'bg-gradient-to-r from-gradientFrom to-gradientTo' 
          : 'bg-gray-200 hover:bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-sm ${
          isDark ? "translate-x-6" : "translate-x-1"
        }`}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-white m-0.5" />
        ) : (
          <Sun className="h-3 w-3 text-yellow-500 m-0.5" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle; 