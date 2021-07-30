import React from "react";
import { NavLink } from "react-router-dom";

type NavSubItemProps = {
  to?: string;
  exactPath?: boolean;
  name: string;
  disabled?: boolean;
};

export function NavSubItem({
  to = "/404",
  exactPath = true,
  name,
  disabled = false,
}: NavSubItemProps) {
  return (
    (disabled && (
      <p className="sidebar__nav-subItem sidebar__nav-subItem--disabled">
        {name}
      </p>
    )) || (
      <NavLink exact={exactPath} to={to} className="sidebar__nav-subItem">
        {name}
      </NavLink>
    )
  );
}
