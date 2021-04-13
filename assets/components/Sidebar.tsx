import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import Icon from "./Icon";

export function Sidebar() {
    const location = useLocation();

    const getActiveClassName = (path: string): string => {
        return location.pathname === path ? "sidebar__nav-item--active" : "";
    }

    return <div className="sidebar">
        <nav className="sidebar__nav">
            <li className={`sidebar__nav-item ${getActiveClassName("/")}`}>
                <span className="sidebar__nav-item-icon">
                    <Icon name="dashboard" />
                </span>
                <NavLink to="/">Vue d&apos;ensemble</NavLink>
            </li>
            <li className={`sidebar__nav-item ${getActiveClassName("/clients")}`}>
                <span className="sidebar__nav-item-icon">
                    <Icon name="users" />
                </span>
                <NavLink to="/clients">Mes clients</NavLink>
            </li>
            <li className={`sidebar__nav-item ${getActiveClassName("/factures")}`}>
                <span className="sidebar__nav-item-icon">
                    <Icon name="invoice" />
                </span>
                <NavLink to="/factures">Mes factures</NavLink>
            </li>
            {/*
            <li className="sidebar__nav-item">
                <span className="sidebar__nav-item-icon">
                    <Icon name="help" />
                </span>
                <NavLink to="/">Aide</NavLink>
            </li>
            */}
        </nav>
        {/* TODO: Light / Dark theme switch */}
        <hr />
        <a href="https://github.com/Warziik/microgest" target="_blank" rel="noreferrer" className="btn--secondary">
            <Icon name="github" />
            Code source
        </a>
    </div>
}