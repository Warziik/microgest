import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";

export function PrivateRoute({ ...routeProps }: RouteProps) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <div className="container">
            <Sidebar />
            <main className="main">
                <Route {...routeProps} />
            </main>
        </div>
    } else {
        return <Redirect to="/connexion" />
    }
}