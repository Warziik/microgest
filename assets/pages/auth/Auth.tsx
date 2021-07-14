import React, { useEffect } from "react";
import { RegisterForm } from "./RegisterForm";
import { LoginForm } from "./LoginForm";
import { useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/Button";
import { useHistory } from "react-router-dom";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export function Auth() {
  const { pathname } = useLocation();
  const history = useHistory();
  const { login } = useAuth();

  const REGISTER_PATH = "/inscription";
  const LOGIN_PATH = "/connexion";
  const FORGOT_PASSWORD_PATH = "/mot-de-passe-oublié";
  const REGISTER_TITLE = "Créer mon compte";
  const LOGIN_TITLE = "Se connecter";
  const FORGOT_PASSWORD_TITLE = "Mot de passe oublié";

  useEffect(() => {
    if (pathname === REGISTER_PATH)
      document.title = `${REGISTER_TITLE} - Microgest`;
    if (pathname === LOGIN_PATH) document.title = `${LOGIN_TITLE} - Microgest`;
    if (pathname === FORGOT_PASSWORD_PATH)
      document.title = `${FORGOT_PASSWORD_TITLE} - Microgest`;
  }, [pathname]);

  return (
    <div className="auth">
      <div className="auth__header">
        <img
          className="auth__header-logo"
          src="../logo.svg"
          alt="Logo de Microgest"
        />
        <div className="auth__header-ctas">
          <Button
            onClick={() => history.push("/inscription")}
            type="outline"
            disabled={pathname === REGISTER_PATH}
            icon="user-plus"
          >
            {REGISTER_TITLE}
          </Button>
          <Button
            onClick={() => history.push("/connexion")}
            type="outline"
            disabled={pathname === LOGIN_PATH}
            icon="unlock"
          >
            {LOGIN_TITLE}
          </Button>
        </div>
      </div>

      {pathname === REGISTER_PATH && <h1>{REGISTER_TITLE}</h1>}
      {pathname === LOGIN_PATH && <h1>{LOGIN_TITLE}</h1>}
      {pathname === FORGOT_PASSWORD_PATH && <h1>{FORGOT_PASSWORD_TITLE}</h1>}

      <div className="auth__content">
        {pathname === REGISTER_PATH && <RegisterForm />}
        {pathname === LOGIN_PATH && <LoginForm login={login} />}
        {pathname === FORGOT_PASSWORD_PATH && <ForgotPasswordForm />}
      </div>
    </div>
  );
}
