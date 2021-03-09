import React, {useEffect, useState} from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { confirmAccount } from "../../services/AuthService";

type MatchParams = {
    id: string;
    token: string;
}

const ConfirmAccount = ({match, history}: RouteComponentProps<MatchParams>) => {
    const [isConfirming, setIsConfirming] = useState(true);
    const id: number = parseInt(match.params.id);
    const token: string = match.params.token;

    if (Number.isNaN(id)) {
        console.log("Invalid User identifier.");
        history.push("/");
    }

    useEffect(() => {
        confirmAccount(id, token)
            .then((value: [boolean, Record<string, unknown>]) => {
                const isSuccessfull: boolean = value[0];
                const resposneData: Record<string, unknown> = value[1];
                setIsConfirming(false);
                if (isSuccessfull) {
                    console.log(resposneData.message);
                } else {
                    if (Object.prototype.hasOwnProperty.call(resposneData, "message")) {
                        console.log(resposneData.message);
                    } else {
                        console.log("Une erreur inattendue s'est produite, veuillez réessayer plus tard.");
                    }
                }
            })
    }, [id, token])

    return isConfirming ? <div className="confirmAccount">
        <div className="confirmAccount__content">
            <h2>Confirmation de votre compte...</h2>
            <Spinner />
        </div>
    </div> : <Redirect to="/" push />
}

export default ConfirmAccount;