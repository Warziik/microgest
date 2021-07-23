import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { Tab } from "../../components/tab/Tab";
import { Tabs } from "../../components/tab/Tabs";
import { CompanyForm } from "./CompanyForm";
import { PersonalInformationsForm } from "./PersonalInformationsForm";
import { SecurityForm } from "./SecurityForm";

export function Settings() {
  const { pathname } = useLocation();

  const generalInformationsRef = useRef(null);
  const companyRef = useRef(null);
  const securityRef = useRef(null);

  const DEFAULT_PATH = "/paramètres";
  const COMPANY_PATH = "/paramètres/entreprise";
  const SECURITY_PATH = `${DEFAULT_PATH}/sécurité`;

  const DEFAULT_TITLE = "Informations personnelles";
  const COMPANY_TITLE = "Entreprise";
  const SECURITY_TITLE = "Sécurité";

  useEffect(() => {
    document.title = "Mes paramètres - Microgest";
  }, []);

  const getDefaultTab = () => {
    switch (pathname) {
      case DEFAULT_PATH:
        return 0;
      case COMPANY_PATH:
        return 1;
      case SECURITY_PATH:
        return 2;
    }
  };

  return (
    <div className="settings">
      <Tabs defaultActiveTab={getDefaultTab()}>
        <Tab
          title={DEFAULT_TITLE}
          url={DEFAULT_PATH}
          tabRef={generalInformationsRef}
        >
          <PersonalInformationsForm />
        </Tab>
        <Tab title={COMPANY_TITLE} url={COMPANY_PATH} tabRef={companyRef}>
          <CompanyForm />
        </Tab>
        <Tab title={SECURITY_TITLE} url={SECURITY_PATH} tabRef={securityRef}>
          <SecurityForm />
        </Tab>
      </Tabs>
    </div>
  );
}
