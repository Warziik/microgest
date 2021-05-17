import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { useAuth } from "../hooks/useAuth";

interface Props extends RouteProps {
    noLayout?: boolean;
}

export function PrivateRoute({ noLayout = false, ...rest }: Props) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        if (noLayout) {
            return <Route {...rest} />
        } else {
            return <div className="container">
                <Sidebar />
                <Topbar />
                <main className="main">
                    <Route {...rest} />
                </main>
            </div>
        }
    } else {
        return <Redirect to="/connexion" />
    }
}