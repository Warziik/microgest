import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import Tab from "../../components/tab/Tab";
import Tabs from "../../components/tab/Tabs";
import { GeneralInformationsForm } from "./GeneralInformationsForm";
import { SecurityForm } from "./SecurityForm";

export function Settings() {
    const { pathname } = useLocation();

    const generalInformationsRef = useRef(null);
    const securityRef = useRef(null);

    const DEFAULT_PATH = "/paramètres";
    const SECURITY_PATH = `${DEFAULT_PATH}/sécurité`;

    const DEFAULT_TITLE = "Informations générales";
    const SECURITY_TITLE = "Sécurité";

    useEffect(() => {
        document.title = "Mes paramètres - Microgest";
    }, []);

    const getDefaultTab = () => {
        switch (pathname) {
            case DEFAULT_PATH:
                return 0;
            case SECURITY_PATH:
                return 1;
        }
    }

    return <div className="settings">
        <Tabs defaultActiveTab={getDefaultTab()}>
            <Tab title={DEFAULT_TITLE} url={DEFAULT_PATH} tabRef={generalInformationsRef}>
                <GeneralInformationsForm />
            </Tab>
            <Tab title={SECURITY_TITLE} url={SECURITY_PATH} tabRef={securityRef}>
                <SecurityForm />
            </Tab>
        </Tabs>
    </div>
}