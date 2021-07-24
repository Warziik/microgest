import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Spinner } from "../../components/Spinner";
import { useToast } from "../../hooks/useToast";
import { GenerateExportableDocument } from "../../components/GenerateExportableDocument";
import { Devis } from "../../types/Devis";
import { fetchDevis } from "../../services/DevisService";

type MatchParams = {
  id: string;
};

export function DevisExport() {
  const { id } = useParams<MatchParams>();
  const history = useHistory();
  const toast = useToast();

  const [devis, setDevis] = useState<Devis>();

  useEffect(() => {
    if (Number.isNaN(id)) {
      history.push("/");
    } else {
      fetchDevis(parseInt(id)).then((values: [boolean, Devis]) => {
        const [isSuccess, data] = values;
        if (isSuccess) {
          setDevis(data);
          document.title = `Devis n°${data.chrono} - Microgest`;

          window.addEventListener("afterprint", () => {
            setTimeout(() => history.push(`/devis-détails/${data.id}`), 1);
          });
          window.print();
        } else {
          toast("error", "Le devis n'a pu être trouvé.");
          history.push("/");
        }
      });
    }
  }, [id, history, toast]);

  return (devis && <GenerateExportableDocument data={devis} />) || <Spinner />;
}
