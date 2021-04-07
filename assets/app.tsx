import React from 'react';
import ReactDOM from 'react-dom';
import ToastContainer from './components/toast/ToastContainer';
import { AuthContextProvider } from './contexts/AuthContext';
import { ToastContextProvider } from './contexts/ToastContext';
import { Router } from './navigation/Router';
import './styles/scss/app.scss';
import './config/config';

ReactDOM.render(
    <AuthContextProvider>
        <ToastContextProvider>
            <Router />
            <ToastContainer />
        </ToastContextProvider>
    </AuthContextProvider>
    , document.getElementById("app"));