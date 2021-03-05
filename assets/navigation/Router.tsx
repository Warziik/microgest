import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Auth from '../pages/Auth';

const Router = () => {
    return <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Auth} />
        </Switch>
    </BrowserRouter>
}

export default Router;