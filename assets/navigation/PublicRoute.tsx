import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function PublicRoute({ ...routeProps }: RouteProps) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Redirect to="/" />
    } else {
        return <Route {...routeProps} />
    }
}