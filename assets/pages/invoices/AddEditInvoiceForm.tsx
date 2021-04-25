import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ModalContext } from '../../components/Modal';
import { useToast } from '../../hooks/useToast';
import { Invoice } from '../../types/Invoice';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/Button';
import { Customer } from '../../types/Customer';
import { fetchAllCustomers } from '../../services/CustomerService';
import TextInput from '../../components/form/TextInput';
import { Option, SelectInput } from '../../components/form/SelectInput';
import { createInvoice, updateInvoice } from '../../services/InvoiceService';
import { ErrorResponse } from '../../types/ErrorResponse';
import { Violation } from '../../types/Violation';
import { useAuth } from '../../hooks/useAuth';
import { DatePickerInput } from '../../components/form/DatePickerInput';

type Props = {
    invoiceToEdit?: Invoice;
    changeInvoice: (invoice: Invoice) => void;
}

type FormData = {
    customer: number;
    amount: number;
    service: string;
    status?: string;
    sentAt?: string;
    paidAt?: string;
}

export function AddEditInvoiceForm({invoiceToEdit, changeInvoice}: Props) {
    const { onClose } = useContext(ModalContext);
    const {userData} = useAuth();
    const toast = useToast();

    const [selectCustomerOptions, setSelectCustomerOptions] = useState<Option[]>([]);
    const selectStatusOptions: Option[] = useMemo(() => {
        return [
            {value: "NEW", label: "Nouveau"},
            {value: "SENT", label: "Envoyé"},
            {value: "PAID", label: "Payé"},
            {value: "CANCELLED", label: "Annulé"}
        ];
    }, []);

    const schema: yup.AnyObjectSchema = yup.object().shape({
        customer:
            yup.number()
                .required("Ce champ est requis."),
        amount:
            yup.number()
                .typeError("Le montant doit être un nombre.")
                .required("Ce champ est requis."),
        service:
            yup.string()
                .min(5, "La prestation doit contenir au minimum 5 caractères.")
                .max(255, "La prestation ne peut dépasser plus de 255 caractères.")
                .required("Ce champ est requis."),
        status:
            yup.string(),
        sentAt:
            yup.date()
                .typeError("Le format de la date est invalide."),
        paidAt:
            yup.date()
                .typeError("Le format de la date est invalide.")
    });

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        errors,
        setError,
        watch,
        reset
    } = useForm<FormData>({ mode: "onTouched", resolver: yupResolver(schema) });

    const fetchFormData = useCallback(async (userId: number) => {
        const [isSuccess, data] = await fetchAllCustomers(userId);
        if (isSuccess) {
            const customers: Option[] = [];
            data["hydra:member"].forEach((customer: Customer) => {
                customers.push({value: customer.id, label: `${customer.firstname} ${customer.lastname}`});
            });
            setSelectCustomerOptions(customers);
            reset({
                customer: invoiceToEdit?.customer.id ?? customers[0].value as number,
                amount: invoiceToEdit?.amount ?? 0,
                service: invoiceToEdit?.service ?? "",
                status: invoiceToEdit?.status ?? selectStatusOptions[0].value as string,
                sentAt: invoiceToEdit?.sentAt ?
                    invoiceToEdit.sentAt.substr(0, 19) : new Date().toISOString(),
                paidAt: invoiceToEdit?.paidAt ?
                    invoiceToEdit.paidAt.substr(0, 19) : new Date().toISOString()
            });
        }
    }, [invoiceToEdit, reset, selectStatusOptions]);
    
    useEffect(() => {
        fetchFormData(userData.id);
    }, [fetchFormData, userData.id]);

    const onSubmit = handleSubmit(async ({ customer, service, amount, status, sentAt, paidAt }) => {
        const [isSuccess, data] = invoiceToEdit ?
            await updateInvoice(invoiceToEdit.id, {customer, service, amount, status, sentAt, paidAt})
            :
            await createInvoice(customer, service, amount);
        if (isSuccess) {
            reset();
            toast("success", invoiceToEdit ? 
            "La facture a bien été modifiée."
            :
            "La nouvelle facture a bien été créée.");
            changeInvoice(data as Invoice);
            onClose();
        } else {
            if (Object.prototype.hasOwnProperty.call(data, "violations")) {
                const response = data as ErrorResponse;
                response.violations?.forEach((violation: Violation) => {
                    setError(violation.propertyPath as keyof FormData, {
                        type: "manual",
                        message: violation.message
                    });
                });
            } else {
                toast("error", "Une erreur inattendue s'est produite, veuillez réessayer plus tard.");
            }
        }
    });

    return <form className="createInvoiceForm" onSubmit={onSubmit}>
        <SelectInput
            ref={register}
            error={errors.customer}
            name="customer"
            className="customerSelectInput"
            label="Client associé"
            options={selectCustomerOptions}
        />
        <TextInput
            ref={register}
            error={errors.service}
            name="service"
            label="Prestation réalisée"
        />
        <TextInput
            ref={register}
            error={errors.amount}
            type="number"
            name="amount"
            label="Montant (€)"
            info="Montant total de la facture (sans la TVA)"
        />

        {invoiceToEdit && <SelectInput
            ref={register}
            error={errors.status}
            name="status"
            className="customerSelectInput"
            label="Statut"
            options={selectStatusOptions}
        />}

        {invoiceToEdit && watch("status") === "SENT" && 
            <DatePickerInput ref={register} error={errors.sentAt} type="datetime-local" label="Date d'envoi" name="sentAt" />
        }

        {invoiceToEdit && watch("status") === "PAID" && 
            <DatePickerInput ref={register} error={errors.paidAt} type="datetime-local" label="Date de paiement" name="paidAt" />
        }

        <Button isLoading={isSubmitting} icon={invoiceToEdit ? "edit" : "add"}>{invoiceToEdit ? "Éditer" : "Créer"}</Button>
    </form>
}