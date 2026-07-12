import React, { createContext, useContext, useEffect, useState } from "react";
import ThemeEngine from "../theme/ThemeEngine.js";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");
  const engine = React.useMemo(() => new ThemeEngine(), []);

  useEffect(() => {
    engine.applyTheme(theme);
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, engine]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
