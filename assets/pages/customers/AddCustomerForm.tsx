import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/Button";
import TextInput from "../../components/form/TextInput";
import { useToast } from "../../hooks/useToast";
import { Customer } from "../../types/Customer";
import * as yup from "yup";
import { createCustomer } from "../../services/CustomerService";
import { Violation } from "../../types/Violation";
import { ModalContext } from "../../components/Modal";

type Props = {
    addCustomer: (customer: Customer) => void;
}

type FormData = {
    firstname: string;
    lastname: string;
    email: string;
    company: string;
}

export function AddCustomerForm({ addCustomer }: Props) {
    const { onClose } = useContext(ModalContext);
    const toast = useToast();

    const schema: yup.AnyObjectSchema = yup.object().shape({
        firstname:
            yup.string()
                .required("Ce champ est requis."),
        lastname:
            yup.string()
                .required("Ce champ est requis."),
        email:
            yup.string()
                .email("Le format de l'adresse email est invalide.")
                .required("Ce champ est requis."),
        company:
            yup.string()
    });

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        errors,
        setError,
        reset
    } = useForm<FormData>({ mode: "onTouched", resolver: yupResolver(schema) });

    const onSubmit = handleSubmit(async ({ firstname, lastname, email, company }) => {
        const [isSuccess, data] = await createCustomer({ firstname, lastname, email, company });

        if (isSuccess) {
            reset();
            toast("success", "Le nouveau client a bien été ajouté.");
            addCustomer(data);
            onClose();
        } else {
            if (Object.prototype.hasOwnProperty.call(data, "violations")) {
                data.violations.forEach((violation: Violation) => {
                    const invalidProperty: any = violation.propertyPath;
                    setError(invalidProperty, {
                        type: "manual",
                        message: violation.message
                    });
                });
            } else {
                toast("error", "Une erreur inattendue s'est produite, veuillez réessayer plus tard.");
            }
        }
    })

    return <form className="form addCustomerForm" onSubmit={onSubmit}>
        <TextInput ref={register} error={errors.firstname} type="text" name="firstname" label="Prénom" />
        <TextInput ref={register} error={errors.lastname} type="text" name="lastname" label="Nom de famille" />
        <TextInput ref={register} error={errors.email} type="email" name="email" label="Adresse email" />
        <TextInput ref={register} error={errors.company} type="text" name="company" label="Entreprise" />
        <Button isLoading={isSubmitting} icon="add">Ajouter</Button>
    </form>;
}