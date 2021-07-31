import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export function useTheme() {
  const { currentTheme, setCurrentTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    localStorage.setItem(
      "microgest_theme",
      currentTheme === "dark" ? "light" : "dark"
    );
    setCurrentTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return { currentTheme, toggleTheme };
}
