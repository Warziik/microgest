import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { NavItem } from "./NavItem";
import { NavSubItem } from "./NavSubItem";
import { Icon } from "../Icon";

export function Sidebar() {
  const { userData, logout } = useAuth();
  const toast = useToast();

  const handleLogout = async () => {
    const [isSuccess] = await logout();

    if (isSuccess) toast("success", "Vous êtes déconnecté.");
  };

  return (
    <div className="sidebar">
      <div className="sidebar__userDetails">
        <img src="https://via.placeholder.com/120x120" alt="" />
        <h2>{`${userData.firstname} ${userData.lastname}`}</h2>
      </div>
      {/* TODO: Light / Dark theme switch */}
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
          <NavSubItem to="/404" name="Factures d'acomptes" />
          <NavSubItem to="/404" name="Avoirs" />
        </NavItem>
        {/* <NavItem to="/factures" icon="settings" name="Mes devis" /> */}
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
          Se déconnecter
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
