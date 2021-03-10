import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Auth from '../pages/auth/Auth';
import ConfirmAccount from '../pages/auth/ConfirmAccount';
import NotFound from '../pages/NotFound';

const Router = () => {
    return <BrowserRouter>
        <Switch>
            <Route path="/user/:id/confirm/:token" component={ConfirmAccount} />
            <Route exact path="/" component={Auth} />
            <Route component={NotFound} />
        </Switch>
    </BrowserRouter>
}

export default Router;