import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function PrivateRoute({ ...routeProps }: RouteProps) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Route {...routeProps} />
    } else {
        return <Redirect to="/connexion" />
    }
}