import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import Icon from "./Icon";

export function Topbar() {
    const location = useLocation();
    const { userData, logout } = useAuth();
    const toast = useToast();

    const getPageTitle = () => {
        switch (location.pathname) {
            case "/":
                return "Vue d'ensemble";
            case "/clients":
                return "Mes clients";
        }
    }

    const handleLogout = async () => {
        const [isSuccess] = await logout();

        if (isSuccess) toast("success", "Vous êtes déconnecté.");
    }

    return <header className="topbar">
        <h1 className="topbar__pageTitle">{getPageTitle()}</h1>
        {/* TODO: Searchbar */}
        <div className="topbar__user">
            {/*
            <div className="topbar__user-notifications">
                <button className="topbar__user-notifications-btn">
                    <Icon name="bell" />
                </button>
                <span className="topbar__user-notifications-count">9</span>
            </div>
            <Link to="/" className="topbar__user-settings">
                <Icon name="settings" />
            </Link>
            */}
            <img className="topbar__user-picture" src="https://via.placeholder.com/32" alt="Your profile picture." />
            <p className="topbar__user-name">{userData.firstname} {userData.lastname}</p>
            <button className="topbar__user-logout" onClick={handleLogout}>
                <Icon name="logout" />
            </button>
        </div>
    </header>
}