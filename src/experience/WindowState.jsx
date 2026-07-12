import React, { createContext, useContext, useEffect, useState } from "react";

const WindowStateContext = createContext(null);

export function WindowStateProvider({ children }) {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1024
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <WindowStateContext.Provider value={size}>
      {children}
    </WindowStateContext.Provider>
  );
}

export function useWindowState() {
  return useContext(WindowStateContext);
}
