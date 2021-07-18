import React, { useContext, useEffect, useState } from "react";
import { ModalContext } from "../../components/Modal";
import { useToast } from "../../hooks/useToast";
import { InvoiceServiceFormData } from "../../types/Invoice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "../../components/Button";
import { Customer } from "../../types/Customer";
import { fetchAllCustomers } from "../../services/CustomerService";
import { Option, SelectInput } from "../../components/form/SelectInput";
import { useAuth } from "../../hooks/useAuth";
import { DatePickerInput } from "../../components/form/DatePickerInput";
import { TextInput } from "../../components/form/TextInput";
import { ToggleInput } from "../../components/form/ToggleInput";
import { ErrorResponse } from "../../types/ErrorResponse";
import { Violation } from "../../types/Violation";
import { Icon } from "../../components/Icon";
import { Devis } from "../../types/Devis";
import { createDevis } from "../../services/DevisService";

type Props = {
  addDevis: (devis: Devis) => void;
};

type FormData = {
  customer: number;
  validityDate: string;
  workStartDate: string;
  workDuration: string;
  paymentDeadline: string;
  paymentDelayRate: number;
  services: InvoiceServiceFormData[];
  tvaApplicable: boolean;
};

export function AddDevisForm({ addDevis }: Props) {
  const { onClose } = useContext(ModalContext);
  const { userData } = useAuth();
  const toast = useToast();

  const [selectCustomerOptions, setSelectCustomerOptions] = useState<Option[]>([
    { value: 0, label: "Sélectionner un client" },
  ]);

  const selectWorkDurationOptions: Option[] = [
    { value: "1 semaine", label: "1 semaine" },
  ];

  const schema: yup.AnyObjectSchema = yup.object().shape({
    customer: yup
      .number()
      .min(1, "Veuillez sélectionner ou créer un client.")
      .typeError("Veuillez séléctionner un client ou en créer un.")
      .required("Ce champ est requis."),
    validityDate: yup.date().typeError("Le format de la date est invalide."),
    workStartDate: yup.date().typeError("Le format de la date est invalide."),
    workDuration: yup.string().required("Ce champ est requis."),
    paymentDeadline: yup.date().typeError("Le format de la date est invalide."),
    paymentDelayRate: yup
      .number()
      .typeError("Le taux doit être un nombre compris entre 0 et 100."),
    services: yup.array().of(
      yup.object().shape({
        name: yup.string().required("Ce champ est requis."),
        description: yup.string().max(255),
        quantity: yup.number().integer().required("Ce champ est requis."),
        unitPrice: yup.number().required("Ce champ est requis."),
      })
    ),
    tvaApplicable: yup.boolean(),
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    reset,
    control,
  } = useForm<FormData>({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: {
      customer: selectCustomerOptions[0].value as number,
      validityDate: "",
      workStartDate: "",
      workDuration: "",
      paymentDeadline: "",
      paymentDelayRate: 0,
      services: [{ name: "", quantity: 1, unitPrice: 0 }],
      tvaApplicable: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const fetchFormData = async (userId: number) => {
    const [isSuccess, data] = await fetchAllCustomers(userId);
    if (isSuccess) {
      const customers: Option[] = [];
      data["hydra:member"].forEach((customer: Customer) => {
        customers.push({
          value: customer.id,
          label:
            customer.type === "PERSON"
              ? `${customer.firstname} ${customer.lastname}`
              : (customer.company as string),
        });
      });
      setSelectCustomerOptions([...selectCustomerOptions, ...customers]);
    }
  };

  useEffect(() => {
    fetchFormData(userData.id);
  }, [userData.id]);

  const onSubmit = handleSubmit(async (formData: FormData) => {
    console.log("SUBMITTED DATA", formData);
    const [isSuccess, data] = await createDevis(formData.customer, {
      ...formData,
      status: "NEW",
    });
    if (isSuccess) {
      reset();

      toast("success", "Le devis a bien été créé.");
      addDevis(data as Devis);
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
    <form className="addInvoiceForm" onSubmit={onSubmit}>
      <div className="addInvoiceForm__general">
        <h3>Général</h3>
        <SelectInput
          error={errors.customer}
          label="Client"
          options={selectCustomerOptions}
          {...register("customer")}
        />

        <DatePickerInput
          error={errors.validityDate}
          label="Date d'expiration du devis"
          {...register("validityDate")}
        />

        <DatePickerInput
          error={errors.validityDate}
          label="Date de début de la mission"
          {...register("workStartDate")}
        />

        <SelectInput
          error={errors.workDuration}
          label="Durée estimée de la mission"
          options={selectWorkDurationOptions}
          {...register("workDuration")}
        />

        <DatePickerInput
          error={errors.paymentDeadline}
          label="Date limite de règlement"
          {...register("paymentDeadline")}
        />

        <TextInput
          error={errors.paymentDelayRate}
          type="number"
          label="Taux de pénalité en cas de retard"
          info="Valeur en pourcentage"
          {...register("paymentDelayRate")}
        />
      </div>

      <div className="addInvoiceForm__services">
        <h3>Prestations réalisées</h3>
        {fields.map((field, index: number) => {
          return (
            <div key={field.id} className="addInvoiceForm__services-item">
              <TextInput
                error={errors?.services?.[index]?.name}
                label="Nom de la prestation"
                {...register(`services.${index}.name` as const)}
                defaultValue={field.name}
              />

              <TextInput
                error={errors?.services?.[index]?.quantity}
                type="number"
                label="Quantité"
                {...register(`services.${index}.quantity` as const)}
                defaultValue={field.quantity}
              />

              <TextInput
                error={errors?.services?.[index]?.unitPrice}
                label="Prix unit (HT)"
                {...register(`services.${index}.unitPrice` as const)}
                defaultValue={field.unitPrice}
              />

              <button
                type="button"
                className="addInvoiceForm__services-deleteBtn"
                onClick={() => remove(index)}
              >
                <Icon name="trash" />
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => append({ name: "", quantity: 1, unitPrice: 0 })}
          className="addInvoiceForm__services-addBtn"
        >
          <Icon name="add" />
          Ajouter une prestation
        </button>
      </div>

      <div className="addInvoiceForm__footer">
        <ToggleInput
          type="switch"
          label="TVA applicable"
          {...register("tvaApplicable")}
        />

        {/* h2 className="addInvoiceForm__totalTtc">Total TTC: 0€</h2> */}
        <Button
          isLoading={isSubmitting}
          icon="add"
          center={true}
          htmlType="submit"
        >
          Créer le devis
        </Button>
      </div>
    </form>
  );
}
