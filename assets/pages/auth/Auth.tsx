import React, { useState } from 'react';
import { register } from "../../services/AuthService";
import RegisterForm from '../../components/RegisterForm';
import { User } from '../../types/User';

const Auth = () => {
    const [type] = useState<"register" | "login">("register");

    const signup = ({firstname, lastname, email, password}: User): Promise<[boolean, Record<string, unknown>]> => {
        return register({firstname, lastname, email, password});
    }

    return <div className="auth">
        {type === "register" && <h1>Créer un compte</h1>}
        <div className="auth__content">
            {/* TODO: create tabs component */}
            {type === "register" && <RegisterForm createUser={signup} />}
        </div>
    </div>
}

export default Auth;