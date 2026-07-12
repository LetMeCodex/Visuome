import React, { createContext, useContext, useEffect, useState } from "react";
import ThemeEngine from "../theme/ThemeEngine.js";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme] = useState("dark");
  const engine = React.useMemo(() => new ThemeEngine(), []);

  useEffect(() => {
    engine.applyTheme("dark");
    const root = document.documentElement;
    root.classList.add("dark");
  }, [engine]);

  const toggleTheme = () => {
    // No-op (only dark mode supported now)
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
