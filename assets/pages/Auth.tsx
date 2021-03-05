import React, { useState } from 'react';
import RegisterForm from '../components/RegisterForm';

const Auth = () => {
    const [type] = useState<"register" | "login">("register");

    return <div className="auth">
        {type === "register" && <h1>Créer un compte</h1>}
        <div className="auth__content">
            {/* TODO: create tabs component */}
            {type === "register" && <RegisterForm />}
        </div>
    </div>
}

export default Auth;