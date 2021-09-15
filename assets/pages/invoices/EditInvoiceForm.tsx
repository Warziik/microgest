import {yupResolver} from "@hookform/resolvers/yup";
import React, {useContext, useMemo} from "react";
import {Controller, useForm} from "react-hook-form";
import {Option, SelectInput} from "../../components/form/SelectInput";
import {ModalContext} from "../../components/Modal";
import {useToast} from "../../hooks/useToast";
import {Invoice} from "../../types/Invoice";
import * as yup from "yup";
import {updateInvoice} from "../../services/InvoiceService";
import {ErrorResponse} from "../../types/ErrorResponse";
import {Violation} from "../../types/Violation";
import {DatePickerInput} from "../../components/form/DatePickerInput";
import {Button} from "../../components/Button";

type Props = {
    invoiceToEdit: Invoice;
    editInvoice: (invoice: Invoice) => void;
};

type FormData = {
    status: Option;
    sentAt: string | null;
    paidAt: string | null;
};

export function EditInvoiceForm({invoiceToEdit, editInvoice}: Props) {
    const {onClose} = useContext(ModalContext);
    const toast = useToast();

    const selectStatusOptions: Option[] = useMemo(() => {
        return [
            {value: "NEW", label: "Nouveau"},
            {value: "SENT", label: "Envoyé"},
            {value: "PAID", label: "Payé"},
            {value: "CANCELLED", label: "Annulé"},
        ];
    }, []);

    const schema: yup.AnyObjectSchema = yup.object().shape({
        status: yup.object(),
        paidAt: yup.mixed().when("status", {
            is: "PAID",
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
            status: invoiceToEdit.status ? selectStatusOptions.find((option: Option) => option.value === invoiceToEdit.status) as Option : selectStatusOptions[0],
            sentAt: invoiceToEdit.sentAt ?? "",
            paidAt: invoiceToEdit.paidAt ?? "",
        },
    });

    const onSubmit = handleSubmit(async (formData: FormData) => {
        if (formData.status.value === "NEW" || formData.status.value === "CANCELLED") {
            formData.paidAt = null;
            formData.sentAt = null;
        }
        if (formData.status.value === "PAID") {
            formData.sentAt = null;
        }
        if (formData.status.value === "SENT") {
            formData.paidAt = null;
        }

        const [isSuccess, data] = await updateInvoice(invoiceToEdit.id, {
            ...formData,
            status: formData.status.value as string
        });
        if (isSuccess) {
            toast("success", "La facture a bien été mise à jour.");
            editInvoice(data as Invoice);
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

            {watch("status").value === "PAID" && (
                <Controller
                    name="paidAt"
                    control={control}
                    render={({field}) => (
                        <DatePickerInput
                            error={errors.paidAt}
                            label="Date de paiement"
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
