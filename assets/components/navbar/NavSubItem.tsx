import React from "react";
import { NavLink } from "react-router-dom";

type NavSubItemProps = {
  to: string;
  exactPath?: boolean;
  name: string;
};

export function NavSubItem({ to, exactPath = true, name }: NavSubItemProps) {
  return (
    <NavLink exact={exactPath} to={to} className="sidebar__nav-subItem">
      {name}
    </NavLink>
  );
}
