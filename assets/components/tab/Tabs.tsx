import React, { ReactElement, useState } from "react";
import { useHistory } from "react-router";
import TabTitle from "./TabTitle";

type Props = {
    defaultActiveTab?: number;
    children: ReactElement[];
}

export default function Tabs({ defaultActiveTab, children }: Props) {
    const [activeTab, setActiveTab] = useState(defaultActiveTab ?? 0);
    const { replace } = useHistory();

    const changeTabSelection = (lastTab: number, nextTab: number) => {
        const firstTab = 0;
        let tabToSelect: number;
        if (activeTab === lastTab) {
            tabToSelect = firstTab;
        } else if (activeTab === firstTab) {
            tabToSelect = lastTab;
        } else {
            tabToSelect = nextTab;
        }

        setActiveTab(tabToSelect);
        children[tabToSelect].props.tabRef.current.focus();

        if (children[tabToSelect].props.url) replace(children[tabToSelect].props.url);
    }

    return <div className="tabs">
        <ul className="tabs__list" role="tablist">
            {children.map((item: ReactElement, index: number) => {
                return <TabTitle
                    key={index}
                    index={index}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    tabsLength={children.length}
                    changeTabSelection={changeTabSelection}
                    updateUrl={item.props.url}
                    title={item.props.title}
                    tabRef={item.props.tabRef}
                />
            })}
        </ul>
        {children.map((item: ReactElement, index: number) => {
            return <div
                key={index}
                className="tab__panel"
                id={`tabpanel_${index}`}
                role="tabpanel"
                aria-labelledby={`tab_${index}`}
                aria-hidden={activeTab !== index}
            >
                {item}
            </div>
        })}
    </div>
}