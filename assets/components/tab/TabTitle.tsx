import React, { Ref } from "react";
import { useHistory } from "react-router";

type Props = {
  title: string;
  setActiveTab: (selectedTab: number) => void;
  updateUrl?: string;
  index: number;
  tabsLength: number;
  activeTab: number;
  changeTabSelection: (
    lastTab: number,
    nextTab: number,
    direction: "left" | "right"
  ) => void;
  tabRef: Ref<HTMLAnchorElement>;
};

export function TabTitle({
  title,
  tabsLength,
  index,
  tabRef,
  setActiveTab,
  changeTabSelection,
  updateUrl,
  activeTab,
}: Props) {
  const { replace } = useHistory();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    setActiveTab(index);
    if (updateUrl) replace(updateUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (e.key === "ArrowLeft") {
      const last = tabsLength - 1;
      const next = activeTab - 1;
      changeTabSelection(last, next, "left");
    }
    if (e.key === "ArrowRight") {
      const last = tabsLength - 1;
      const next = activeTab + 1;
      changeTabSelection(last, next, "right");
    }
  };

  return (
    <li role="presentation">
      <a
        href={`#tabpanel_${index}`}
        role="tab"
        id={`tab_${index}`}
        aria-controls={`tabpanel_${index}`}
        aria-selected={activeTab === index}
        tabIndex={activeTab === index ? 0 : -1}
        className={`tab__title ${
          activeTab === index ? "tab__title--active" : ""
        }`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        ref={tabRef}
      >
        {title}
      </a>
    </li>
  );
}
