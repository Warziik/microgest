import {yupResolver} from "@hookform/resolvers/yup";
import React, {useContext, useMemo} from "react";
import {Controller, useForm} from "react-hook-form";
import {Option, SelectInput} from "../../components/form/SelectInput";
import {ModalContext} from "../../components/Modal";
import {useToast} from "../../hooks/useToast";
import * as yup from "yup";
import {ErrorResponse} from "../../types/ErrorResponse";
import {Violation} from "../../types/Violation";
import {DatePickerInput} from "../../components/form/DatePickerInput";
import {Button} from "../../components/Button";
import {Devis} from "../../types/Devis";
import {updateDevis} from "../../services/DevisService";

type Props = {
    devisToEdit: Devis;
    editDevis: (devis: Devis) => void;
};

type FormData = {
    status: Option;
    sentAt: string | null;
    signedAt: string | null;
};

export function EditDevisForm({devisToEdit, editDevis}: Props) {
    const {onClose} = useContext(ModalContext);
    const toast = useToast();

    const selectStatusOptions: Option[] = useMemo(() => {
        return [
            {value: "NEW", label: "Nouveau"},
            {value: "SENT", label: "Envoyé"},
            {value: "SIGNED", label: "Signé"},
            {value: "CANCELLED", label: "Annulé"},
        ];
    }, []);

    const schema: yup.AnyObjectSchema = yup.object().shape({
        status: yup.object(),
        signedAt: yup.mixed().when("status", {
            is: "SIGNED",
            then: yup.date().typeError("Le format de la date est invalide."),
        }),
        sentAt: yup.mixed().when("status", {
            is: "SENT",
            then: yup.date().typeError("Le format de la date est invalide."),
        }),
    });

    const {
        control,
        handleSubmit,
        formState: {isSubmitting, errors},
        setError,
        watch,
    } = useForm<FormData>({
        mode: "onTouched",
        resolver: yupResolver(schema),
        defaultValues: {
            status: devisToEdit.status ? selectStatusOptions.find((option: Option) => option.value === devisToEdit.status) as Option : selectStatusOptions[0],
            sentAt: devisToEdit?.sentAt ?? "",
            signedAt: devisToEdit?.signedAt ?? ""
        },
    });

    const onSubmit = handleSubmit(async (formData: FormData) => {
        if (formData.status.value === "NEW" || formData.status.value === "CANCELLED") {
            formData.signedAt = null;
            formData.sentAt = null;
        }
        if (formData.status.value === "SIGNED") {
            formData.sentAt = null;
        }
        if (formData.status.value === "SENT") {
            formData.signedAt = null;
        }

        const [isSuccess, data] = await updateDevis(devisToEdit.id, {
            ...formData,
            status: formData.status.value as string
        });
        if (isSuccess) {
            toast("success", "Le devis a bien été mis à jour.");
            editDevis(data as Devis);
            onClose();
        } else {
            if (Object.prototype.hasOwnProperty.call(data, "violations")) {
                const response = data as ErrorResponse;
                response.violations?.forEach((violation: Violation) => {
                    setError(violation.propertyPath as keyof FormData, {
                        type: "manual",
                        message: violation.message,
                    });
                });
            } else {
                toast(
                    "error",
                    "Une erreur inattendue s'est produite, veuillez réessayer plus tard."
                );
            }
        }
    });

    return (
        <form className="editInvoiceForm" onSubmit={onSubmit}>
            <Controller
                name="status"
                control={control}
                render={({field}) => (
                    <SelectInput
                        label="Statut"
                        options={selectStatusOptions}
                        placeholder="Sélectionner un statut..."
                        isSearchable={false}
                        {...field}
                    />
                )}
            />

            {watch("status").value === "SENT" && (
                <Controller
                    name="sentAt"
                    control={control}
                    render={({field}) => (
                        <DatePickerInput
                            error={errors.sentAt}
                            label="Date d'envoi"
                            {...field}
                        />
                    )}
                />
            )}

            {watch("status").value === "SIGNED" && (
                <Controller
                    name="signedAt"
                    control={control}
                    render={({field}) => (
                        <DatePickerInput
                            error={errors.signedAt}
                            label="Date de signature"
                            {...field}
                        />
                    )}
                />
            )}

            <Button isLoading={isSubmitting} center={true} htmlType="submit">
                Mettre à jour
            </Button>
        </form>
    );
}
