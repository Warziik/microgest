import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Spinner } from "../../components/Spinner";
import { useToast } from "../../hooks/useToast";
import { fetchInvoice } from "../../services/InvoiceService";
import { Invoice } from "../../types/Invoice";
import { GenerateInvoice } from "../../components/GenerateInvoice";

type MatchParams = {
  id: string;
};

export function InvoiceExport() {
  const { id } = useParams<MatchParams>();
  const history = useHistory();
  const toast = useToast();

  const [invoice, setInvoice] = useState<Invoice>();

  useEffect(() => {
    if (Number.isNaN(id)) {
      history.push("/");
    } else {
      fetchInvoice(parseInt(id)).then((values: [boolean, Invoice]) => {
        const [isSuccess, data] = values;
        if (isSuccess) {
          setInvoice(data);
          document.title = `Facture n°${data.chrono} - Microgest`;

          window.addEventListener("afterprint", () => {
            history.push(`/facture/${data.id}`);
          });
          window.print();
        } else {
          toast("error", "La facture n'a pu être trouvée.");
          history.push("/");
        }
      });
    }
  }, [id, history, toast]);

  return (invoice && <GenerateInvoice invoice={invoice} />) || <Spinner />;
}
