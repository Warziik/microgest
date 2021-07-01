import React, { ReactElement, useState } from "react";
import { Icon } from "../Icon";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";

type NavItemProps = {
  to?: string;
  exactPath?: boolean;
  icon: string;
  name: string;
  children?: ReactElement[];
};

export function NavItem({
  to,
  exactPath = true,
  icon,
  name,
  children,
}: NavItemProps) {
  const { pathname } = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [shouldBeActive, setShouldBeActive] = useState(false);

  useEffect(() => {
    if (children) {
      const childrenPaths: string[] = [];
      children.map((child: ReactElement) => {
        childrenPaths.push(child.props.to);
      });
      if (
        childrenPaths.find(
          (el) => el === `/${pathname.split("/")[1]}` && pathname !== "/"
        )
      ) {
        setShouldBeActive(true);
        setShowDropdown(true);
      } else {
        setShouldBeActive(false);
        setShowDropdown(false);
      }
    }
  }, [children]);

  return (
    (children && (
      <div
        className={`sidebar__nav-dropdown ${
          shouldBeActive ? "active" : ""
        }`.trim()}
      >
        <button onClick={() => setShowDropdown(!showDropdown)}>
          <Icon name={icon} />
          {name}
          <Icon
            name="chevron"
            className={`dropdown__chevron ${
              showDropdown ? "dropdown__chevron--down" : "dropdown__chevron--up"
            }`}
          />
        </button>
        <div
          className={`sidebar__nav-subItems ${
            showDropdown
              ? "sidebar__nav-subItems--visible"
              : "sidebar__nav-subItems--hidden"
          }`}
        >
          {children}
        </div>
      </div>
    )) || (
      <NavLink exact={exactPath} to={to ?? ""} className="sidebar__nav-item">
        <Icon name={icon} />
        {name}
      </NavLink>
    )
  );
}
