import { createContext, useContext, useEffect, useState } from "react";
import { loadPref, savePref } from "../services/preferences.js";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [accent, setAccent] = useState(() => loadPref("accent", "color")); // "color" | "mono"

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
    savePref("accent", accent);
  }, [accent]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const toggleAccent = () => setAccent((a) => (a === "color" ? "mono" : "color"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accent, toggleAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);