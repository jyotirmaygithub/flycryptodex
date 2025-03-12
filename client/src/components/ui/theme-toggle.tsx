import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true);

  // Handle theme toggle
  const toggleTheme = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      
      if (newMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      
      return newMode;
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className={`w-10 h-6 rounded-full flex items-center transition duration-300 focus:outline-none shadow ${
        darkMode ? "bg-primary-700" : "bg-neutral-200"
      }`}
      aria-label="Toggle theme"
    >
      <div
        className={`flex items-center justify-center h-4 w-4 rounded-full shadow-md transform transition duration-300 ${
          darkMode ? "translate-x-1 bg-white" : "translate-x-5 bg-primary-800"
        }`}
      >
        {darkMode ? (
          <Moon className="h-3 w-3 text-primary-800" />
        ) : (
          <Sun className="h-3 w-3 text-white" />
        )}
      </div>
    </button>
  );
}
