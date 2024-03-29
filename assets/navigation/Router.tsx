import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import {Auth} from "../pages/auth/Auth";
import ConfirmAccount from "../pages/auth/ConfirmAccount";
import {ResetPassword} from "../pages/auth/ResetPassword";
import {Customers} from "../pages/customers/Customers";
import {ShowCustomer} from "../pages/customers/show/ShowCustomer";
import {Devis} from "../pages/devis/Devis";
import {DevisExport} from "../pages/devis/DevisExport";
import {Overview} from "../pages/overview/Overview";
import {InvoiceExport} from "../pages/invoices/InvoiceExport";
import {Invoices} from "../pages/invoices/Invoices";
import {ShowInvoice} from "../pages/invoices/show/ShowInvoice";
import {NotFound} from "../pages/NotFound";
import {Settings} from "../pages/settings/Settings";
import {PrivateRoute} from "./PrivateRoute";
import {PublicRoute} from "./PublicRoute";
import {ShowDevis} from "../pages/devis/show/ShowDevis";

export function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <PrivateRoute path="/paramètres" component={Settings}/>

                <PrivateRoute
                    path="/devis-détails/:id/export"
                    noLayout={true}
                    component={DevisExport}
                />
                <PrivateRoute path="/devis-détails/:id" component={ShowDevis}/>
                <PrivateRoute path="/devis" component={Devis}/>

                <PrivateRoute
                    path="/facture/:id/export"
                    noLayout={true}
                    component={InvoiceExport}
                />
                <PrivateRoute path="/facture/:id" component={ShowInvoice}/>
                <PrivateRoute path="/factures" component={Invoices}/>

                <PrivateRoute path="/client/:id" component={ShowCustomer}/>
                <PrivateRoute path="/clients" component={Customers}/>

                <PrivateRoute exact path="/" component={Overview}/>

                <PublicRoute
                    path="/réinitialisation-mot-de-passe/:token"
                    component={ResetPassword}
                />
                <PublicRoute
                    path="/membre/:id/confirmation/:token"
                    component={ConfirmAccount}
                />
                <PublicRoute
                    path={["/inscription", "/connexion", "/mot-de-passe-oublié"]}
                    component={Auth}
                />

                <Route component={NotFound}/>
            </Switch>
        </BrowserRouter>
    );
}
