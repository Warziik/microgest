import React from "react";
import ReactDOM from "react-dom";
import {ToastContainer} from "./components/toast/ToastContainer";
import {AuthContextProvider} from "./contexts/AuthContext";
import {ToastContextProvider} from "./contexts/ToastContext";
import {ThemeContextProvider} from "./contexts/ThemeContext";
import {Router} from "./navigation/Router";
import "./config/config";
import "./scss/app.scss";

ReactDOM.render(
    <ThemeContextProvider>
        <AuthContextProvider>
            <ToastContextProvider>
                <Router/>
                <ToastContainer/>
            </ToastContextProvider>
        </AuthContextProvider>
    </ThemeContextProvider>,
    document.getElementById("app")
);
