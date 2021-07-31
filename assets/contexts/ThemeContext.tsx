import React, { createContext, ReactElement, SetStateAction } from "react";
import { useEffect } from "react";
import { Dispatch } from "react";
import { useState } from "react";

type Props = {
  children: ReactElement | ReactElement[];
};

type InitialType = {
  currentTheme: string;
  setCurrentTheme: Dispatch<SetStateAction<string>>;
};

export const ThemeContext = createContext<InitialType>({
  currentTheme: "",
  setCurrentTheme: (value: SetStateAction<string>) => value,
});

export function ThemeContextProvider({ children }: Props) {
  const [currentTheme, setCurrentTheme] = useState<string>(
    localStorage.getItem("microgest_theme") ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );

  useEffect(() => {
    document.body.dataset.theme = currentTheme === "dark" ? "dark" : "light";
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
