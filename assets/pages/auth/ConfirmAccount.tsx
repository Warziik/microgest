import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
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

    useEffect(() => {
        if (Number.isNaN(id)) {
            toast("error", "Identifiant utilisateur invalide.");
            history.push("/connexion");
        } else {
            (async function () {
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
                history.push("/connexion");
            })()
        }
    }, [id, token, history, toast])

    return <div className="confirmAccount">
        <div className="confirmAccount__content">
            <h2>Confirmation de votre compte...</h2>
            <Spinner />
        </div>
    </div>
}