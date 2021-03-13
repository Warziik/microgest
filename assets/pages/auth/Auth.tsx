import React, { useEffect, useRef } from 'react';
import { signup, signin } from "../../services/AuthService";
import RegisterForm from '../../components/form/RegisterForm';
import Tabs from '../../components/tab/Tabs';
import Tab from '../../components/tab/Tab';
import LoginForm from '../../components/form/LoginForm';
import { useLocation } from 'react-router';

export default function Auth() {
    const { pathname } = useLocation();

    const registerRef = useRef(null);
    const loginRef = useRef(null);

    const REGISTER_PATH = "/inscription";
    const LOGIN_PATH = "/connexion";
    const REGISTER_TITLE = "Créer mon compte";
    const LOGIN_TITLE = "Se connecter";

    useEffect(() => {
        if (pathname === REGISTER_PATH) document.title = `${REGISTER_TITLE} - Microgest`;
        if (pathname === LOGIN_PATH) document.title = `${LOGIN_TITLE} - Microgest`;
    }, [pathname]);

    return <div className="auth">
        {pathname === REGISTER_PATH && <h1>{REGISTER_TITLE}</h1>}
        {pathname === LOGIN_PATH && <h1>{LOGIN_TITLE}</h1>}

        <div className="auth__content">
            <Tabs defaultActiveTab={pathname === REGISTER_PATH ? 0 : 1}>
                <Tab title={REGISTER_TITLE} url={REGISTER_PATH} tabRef={registerRef}>
                    <RegisterForm createUser={signup} />
                </Tab>
                <Tab title={LOGIN_TITLE} url={LOGIN_PATH} tabRef={loginRef}>
                    <LoginForm login={signin} />
                </Tab>
            </Tabs>
        </div>
    </div>
}