import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { useAuth } from "../hooks/useAuth";

export function PrivateRoute({ ...routeProps }: RouteProps) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <div className="container">
            <Sidebar />
            <Topbar />
            <main className="main">
                <Route {...routeProps} />
            </main>
        </div>
    } else {
        return <Redirect to="/connexion" />
    }
}