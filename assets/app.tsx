import React from 'react';
import ReactDOM from 'react-dom';
import ToastContainer from './components/toast/ToastContainer';
import { ToastContextProvider } from './contexts/ToastContext';
import Router from './navigation/Router';
import './styles/scss/app.scss';

ReactDOM.render(
    <ToastContextProvider>
        <Router />
        <ToastContainer />
    </ToastContextProvider>, document.getElementById("app"));