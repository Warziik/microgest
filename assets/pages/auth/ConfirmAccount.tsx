import React, { useCallback, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Loader } from "../../components/Loader";
import { useToast } from "../../hooks/useToast";
import { confirmAccount } from "../../services/UserService";

type MatchParams = {
    id: string;
    token: string;
}

export default function ConfirmAccount() {
    const toast = useToast();
    const params = useParams<MatchParams>();
    const history = useHistory();

    const id: number = parseInt(params.id);
    const token: string = params.token;

    const confirmUserAccount = useCallback(async () => {
        const [isSuccess, data] = await confirmAccount(id, token);
        if (isSuccess) {
            const message: any = data.message;
            toast("success", message);
        } else {
            if (Object.prototype.hasOwnProperty.call(data, "message")) {
                const message: any = data.message;
                toast("error", message);
            } else {
                toast("error", "Une erreur inattendue s&apos;est produite, veuillez réessayer plus tard.");
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

    return <div className="confirmAccount">
        <div className="confirmAccount__content">
            <h2>Confirmation de votre compte...</h2>
            <Loader />
        </div>
    </div>
}