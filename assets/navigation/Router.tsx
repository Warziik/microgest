import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Auth from '../pages/auth/Auth';
import ConfirmAccount from '../pages/auth/ConfirmAccount';

const Router = () => {
    return <BrowserRouter>
        <Switch>
            <Route path="/user/:id/confirm/:token" component={ConfirmAccount} />
            <Route exact path="/" component={Auth} />
        </Switch>
    </BrowserRouter>
}

export default Router;