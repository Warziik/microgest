import React, { useEffect, useRef, useState } from "react";
import { Tabs } from "../../components/tab/Tabs";
import { Tab } from "../../components/tab/Tab";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Badge } from "../../components/Badge";
import { Devis } from "../../types/Devis";
import { Button } from "../../components/Button";
import dayjs from "dayjs";

type Props = {
  devis: Devis[];
  displayCustomer?: boolean;
  displayUrls?: boolean;
};

export function DevisData({
  devis,
  displayCustomer = false,
  displayUrls = false,
}: Props) {
  const { push } = useHistory();
  const { pathname } = useLocation();

  const [expiredDevis, setExpiredDevis] = useState<Devis[]>();

  const allDevisRef = useRef(null);
  const expiredRef = useRef(null);
  const draftsRef = useRef(null);

  const getDefaultTab = () => {
    switch (pathname) {
      case "/devis":
        return 0;
      case "/devis/expirés":
        return 1;
      case "/devis/brouillons":
        return 2;
    }
  };

  useEffect(() => {
    setExpiredDevis(
      devis.filter(
        (devis: Devis) =>
          devis.validityDate.slice(0, 19) <
          new Date().toISOString().slice(0, 19)
      )
    );
  }, [devis]);

  return (
    <Tabs defaultActiveTab={displayUrls ? getDefaultTab() : 0}>
      <Tab
        title={"Tous les devis"}
        url={displayUrls ? "/devis" : undefined}
        tabRef={allDevisRef}
      >
        <div className="devis__list">
          {devis.length > 0 && (
            <>
              <div className="devis__list-header">
                <h3>Devis</h3>
                <p>{devis.length} devis émis</p>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Chrono</th>
                    <th>Statut</th>
                    {displayCustomer && <th>Client</th>}
                    <th>Date de création</th>
                    <th>Date d&lsquo;expiration</th>
                    <th>Date de début de la prestation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {devis.map((devis: Devis, index: number) => (
                    <tr key={index}>
                      <td>
                        <Link
                          className="link"
                          to={`/devis-détails/${devis.id}`}
                        >
                          {devis.chrono}
                        </Link>
                      </td>
                      <td>
                        <Badge status={devis.status} />
                      </td>
                      {displayCustomer && (
                        <td>
                          <Link
                            className="link"
                            to={`/client/${devis.customer.id}`}
                          >
                            {devis.customer.type === "PERSON"
                              ? `${devis.customer.firstname} ${devis.customer.lastname}`
                              : devis.customer.company}
                          </Link>
                        </td>
                      )}
                      <td>{dayjs(devis.createdAt).fromNow()}</td>
                      <td>{dayjs(devis.validityDate).fromNow()}</td>
                      <td>
                        {dayjs(devis.workStartDate).format("dddd DD MMMM YYYY")}
                      </td>
                      <td>
                        <Button
                          type="contrast"
                          size="small"
                          onClick={() =>
                            push(`/devis-détails/${devis.id}/export`)
                          }
                        >
                          Exporter
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {devis.length === 0 && <p>Aucun devis pour le moment.</p>}
        </div>
      </Tab>
      <Tab
        title={"Expirés"}
        url={displayUrls ? "/devis/expirés" : undefined}
        tabRef={expiredRef}
      >
        <div className="devis__list">
          {expiredDevis && expiredDevis.length > 0 && (
            <>
              <div className="devis__list-header">
                <h3>Devis expirés</h3>
                <p>
                  {expiredDevis.length}
                  {expiredDevis.length === 1 ? "devis expiré" : "devis expirés"}
                </p>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Chrono</th>
                    <th>Statut</th>
                    {displayCustomer && <th>Client</th>}
                    <th>Date de création</th>
                    <th>Date d&lsquo;expiration</th>
                    <th>Date de début de la prestation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expiredDevis.map((devis: Devis, index: number) => (
                    <tr key={index}>
                      <td>
                        <Link
                          className="link"
                          to={`/devis-détails/${devis.id}`}
                        >
                          {devis.chrono}
                        </Link>
                      </td>
                      <td>
                        <Badge status={devis.status} />
                      </td>
                      {displayCustomer && (
                        <td>
                          <Link
                            className="link"
                            to={`/client/${devis.customer.id}`}
                          >
                            {devis.customer.type === "PERSON"
                              ? `${devis.customer.firstname} ${devis.customer.lastname}`
                              : devis.customer.company}
                          </Link>
                        </td>
                      )}
                      <td>{dayjs(devis.createdAt).fromNow()}</td>
                      <td>{dayjs(devis.validityDate).fromNow()}</td>
                      <td>
                        {dayjs(devis.workStartDate).format("dddd DD MMMM YYYY")}
                      </td>
                      <td>
                        <Button
                          type="contrast"
                          size="small"
                          onClick={() =>
                            push(`/devis-détails/${devis.id}/export`)
                          }
                        >
                          Exporter
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {expiredDevis?.length === 0 && (
            <p>Aucun devis expiré pour le moment.</p>
          )}
        </div>
      </Tab>
      <Tab
        title={"Brouillons"}
        url={displayUrls ? "/devis/brouillons" : undefined}
        tabRef={draftsRef}
      >
        <div className="devis__list">
          <p>Les brouillons ne sont pas disponibles pour le moment.</p>
        </div>
      </Tab>
    </Tabs>
  );
}
