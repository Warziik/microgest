import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { confirmAccount } from "../../services/UserService";

type MatchParams = {
    id: string;
    token: string;
}

export default function ConfirmAccount() {
    const params = useParams<MatchParams>();
    const history = useHistory();

    const id: number = parseInt(params.id);
    const token: string = params.token;

    useEffect(() => {
        if (Number.isNaN(id)) {
            console.log("Invalid User identifier.");
            history.push("/connexion");
        } else {
            (async function () {
                const [isSuccess, data] = await confirmAccount(id, token);
                if (isSuccess) {
                    console.log(data.message);
                } else {
                    if (Object.prototype.hasOwnProperty.call(data, "message")) {
                        console.log(data.message);
                    } else {
                        console.log("Une erreur inattendue s'est produite, veuillez réessayer plus tard.");
                    }
                }
                history.push("/connexion");
            })()
        }
    }, [id, token, history])

    return <div className="confirmAccount">
        <div className="confirmAccount__content">
            <h2>Confirmation de votre compte...</h2>
            <Spinner />
        </div>
    </div>
}