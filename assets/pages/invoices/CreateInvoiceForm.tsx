import React, { useContext, useEffect, useState } from 'react';
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
import { createInvoice } from '../../services/InvoiceService';
import { ErrorResponse } from '../../types/ErrorResponse';
import { Violation } from '../../types/Violation';
import { Collection } from '../../types/Collection';

type Props = {
    addInvoice: (invoice: Invoice) => void;
    userId: number;
}

type FormData = {
    amount: number;
    service: string;
    customer: number;
}

export function CreateInvoiceForm({addInvoice, userId}: Props) {
    const { onClose } = useContext(ModalContext);
    const toast = useToast();
    const [selectOptions, setSelectOptions] = useState<Option[]>([]);

    useEffect(() => {
        fetchAllCustomers(userId)
            .then((values: [boolean, Collection<Customer>]) => {
                const [isSuccess, data] = values;
                if (isSuccess) {
                    const customers: Option[] = [];
                    data["hydra:member"].forEach((customer: Customer) => {
                        customers.push({value: customer.id, label: `${customer.firstname} ${customer.lastname}`});
                    });
                    setSelectOptions(customers);
                }
            });
    }, [userId]);

    const schema: yup.AnyObjectSchema = yup.object().shape({
        customer:
            yup.number()
                .required("Ce champ est requis."),
        amount:
            yup.number()
                .required("Ce champ est requis."),
        service:
            yup.string()
                .required("Ce champ est requis."),
    });

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        errors,
        setError,
        reset
    } = useForm<FormData>({ mode: "onTouched", resolver: yupResolver(schema), defaultValues: {
        amount: 0
    } });

    const onSubmit = handleSubmit(async ({ customer, amount }) => {
        const [isSuccess, data] = await createInvoice(customer, amount);
        if (isSuccess) {
            reset();
            toast("success", "La nouvelle facture a bien été créée.");
            addInvoice(data as Invoice);
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
            options={selectOptions}
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
        <Button isLoading={isSubmitting} icon="add">Créer</Button>
    </form>
}