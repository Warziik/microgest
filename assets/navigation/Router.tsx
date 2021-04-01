import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Auth from '../pages/auth/Auth';
import ConfirmAccount from '../pages/auth/ConfirmAccount';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

export function Router() {
    return <BrowserRouter>
        <Switch>
            <PrivateRoute exact path="/" component={Home} />

            <PublicRoute path="/reinitialisation-mot-de-passe/:token" component={ResetPassword} />
            <PublicRoute path="/mot-de-passe-oublie" component={ForgotPassword} />
            <PublicRoute path="/user/:id/confirm/:token" component={ConfirmAccount} />
            <PublicRoute path={["/inscription", "/connexion"]} component={Auth} />

            <Route component={NotFound} />
        </Switch>
    </BrowserRouter>
}