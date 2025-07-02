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
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      style={{
        backgroundColor: isDark ? "#4F46E5" : "#E5E7EB",
      }}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isDark ? "translate-x-6" : "translate-x-1"
        }`}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-accent m-0.5" />
        ) : (
          <Sun className="h-3 w-3 text-yellow-500 m-0.5" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle; 