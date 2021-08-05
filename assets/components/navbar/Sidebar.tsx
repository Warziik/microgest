import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { NavItem } from "./NavItem";
import { NavSubItem } from "./NavSubItem";
import { Icon } from "../Icon";
import { ToggleInput } from "../form/ToggleInput";
import { useTheme } from "../../hooks/useTheme";

export function Sidebar() {
  const { logout } = useAuth();
  const toast = useToast();
  const { currentTheme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    const [isSuccess] = await logout();

    if (isSuccess) toast("success", "Vous êtes déconnecté.");
  };

  return (
    <div className="sidebar">
      {/*       <button onClick={handleExpand}>Show / Hide</button>       */}
      <img
        className="sidebar__logo"
        src="../logo.svg"
        alt="Logo de Microgest"
      />
      <div className="sidebar__theme">
        <form>
          <ToggleInput
            type="switch"
            label="Thème sombre"
            checked={currentTheme === "dark" ? true : false}
            name="theme"
            onChange={() => toggleTheme()}
          />
        </form>
      </div>
      {/* TODO: Searchbar */}
      <nav className="sidebar__nav">
        <NavItem to="/" icon="overview" name="Vue d'ensemble" />
        <NavItem
          to="/clients"
          exactPath={false}
          icon="users"
          name="Mes clients"
        />
        <NavItem icon="invoice" name="Mes factures">
          <NavSubItem to="/factures" exactPath={false} name="Factures" />
          <NavSubItem disabled={true} name="Factures d'acomptes" />
          <NavSubItem disabled={true} name="Avoirs" />
        </NavItem>
        <NavItem to="/devis" exactPath={false} icon="devis" name="Mes devis" />
        <hr />
        <NavItem
          to="/paramètres"
          exactPath={false}
          icon="settings"
          name="Mes paramètres"
        />
        <button
          onClick={() => handleLogout()}
          className="sidebar__nav-item sidebar__nav-logout"
        >
          <Icon name="logout" />
          <span>Se déconnecter</span>
        </button>
      </nav>
      <div className="sidebar__footer">
        <p>Microgest v1.0.0</p>
        <a
          href="https://github.com/Warziik/microgest"
          target="_blank"
          rel="noreferrer"
          className="link"
        >
          Code source
        </a>
      </div>
    </div>
  );
}
