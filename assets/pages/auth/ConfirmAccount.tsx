import React, { useCallback, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Spinner } from "../../components/Spinner";
import { useToast } from "../../hooks/useToast";
import { confirmAccount } from "../../services/UserService";

type MatchParams = {
  id: string;
  token: string;
};

export default function ConfirmAccount() {
  const toast = useToast();
  const params = useParams<MatchParams>();
  const history = useHistory();

  const id: number = parseInt(params.id);
  const token: string = params.token;

  const confirmUserAccount = useCallback(async () => {
    const [isSuccess, data] = await confirmAccount(id, token);
    if (isSuccess) {
      toast("success", data.message as string);
    } else {
      if (Object.prototype.hasOwnProperty.call(data, "message")) {
        toast("error", data.message as string);
      } else {
        toast(
          "error",
          "Une erreur inattendue s'est produite, veuillez réessayer plus tard."
        );
      }
    }
  }, [id, token, toast]);

  useEffect(() => {
    if (Number.isNaN(id)) {
      toast("error", "Identifiant utilisateur invalide.");
    } else {
      confirmUserAccount();
    }
    history.push("/connexion");
  }, [confirmUserAccount, id, toast, history]);

  return (
    <div className="confirmAccount">
      <div className="confirmAccount__content">
        <h2>Confirmation de votre compte...</h2>
        <Spinner />
      </div>
    </div>
  );
}
