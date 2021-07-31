import React from "react";
import ReactDOM from "react-dom";
import { ToastContainer } from "./components/toast/ToastContainer";
import { AuthContextProvider } from "./contexts/AuthContext";
import { ToastContextProvider } from "./contexts/ToastContext";
import { Router } from "./navigation/Router";
import "./scss/app.scss";
import "./config/config";
import { ThemeContextProvider } from "./contexts/ThemeContext";

ReactDOM.render(
  <ThemeContextProvider>
    <AuthContextProvider>
      <ToastContextProvider>
        <Router />
        <ToastContainer />
      </ToastContextProvider>
    </AuthContextProvider>
  </ThemeContextProvider>,
  document.getElementById("app")
);
