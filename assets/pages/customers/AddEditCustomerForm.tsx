import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/Button";
import { TextInput } from "../../components/form/TextInput";
import { useToast } from "../../hooks/useToast";
import { Customer } from "../../types/Customer";
import * as yup from "yup";
import { createCustomer, updateCustomer } from "../../services/CustomerService";
import { Violation } from "../../types/Violation";
import { ModalContext } from "../../components/Modal";
import { ErrorResponse } from "../../types/ErrorResponse";
import { Option, SelectInput } from "../../components/form/SelectInput";
import { Icon } from "../../components/Icon";

type Props = {
  customerToEdit?: Customer;
  changeCustomer: (customer: Customer) => void;
};

type FormData = {
  type: "PERSON" | "COMPANY";
  firstname: string | null;
  lastname: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  siret: string | null;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export function AddEditCustomerForm({ customerToEdit, changeCustomer }: Props) {
  const { onClose } = useContext(ModalContext);
  const toast = useToast();

  const schema: yup.AnyObjectSchema = yup.object().shape({
    firstname: yup.string().when("type", {
      is: "PERSON",
      then: yup.string().required("Ce champ est requis."),
    }),
    lastname: yup.string().when("type", {
      is: "PERSON",
      then: yup.string().required("Ce champ est requis."),
    }),
    email: yup
      .string()
      .email("Le format de l'adresse email est invalide.")
      .required("Ce champ est requis."),
    company: yup.string().when("type", {
      is: "COMPANY",
      then: yup
        .string()
        .max(40, "Le nom de l'entreprise ne peut dépasser 40 caractères.")
        .required("Ce champ est requis."),
    }),
    phone: yup.string().max(255),
    siret: yup.string().when("type", {
      is: "COMPANY",
      then: yup
        .string()
        .matches(/^\d{14}$/, "Le numéro SIRET doit contenir 14 chiffres.")
        .required("Ce champ est requis."),
    }),
    address: yup.string().max(255).required("Ce champ est requis."),
    city: yup.string().max(255).required("Ce champ est requis."),
    postalCode: yup
      .string()
      .matches(/^\d{5}$/, "Le code postal doit contenir 5 chiffres.")
      .required("Ce champ est requis."),
    country: yup.string().required("Ce champ est requis."),
  });

  const selectCountryOptions: Option[] = [{ value: "FRA", label: "France" }];

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: {
      type: customerToEdit?.type ?? "PERSON",
      firstname: customerToEdit?.firstname ?? "",
      lastname: customerToEdit?.lastname ?? "",
      email: customerToEdit?.email ?? "",
      phone: customerToEdit?.phone ?? "",
      company: customerToEdit?.company ?? "",
      siret: customerToEdit?.siret ?? "",
      address: customerToEdit?.address ?? "",
      city: customerToEdit?.city ?? "",
      postalCode: customerToEdit?.postalCode.toString() ?? "",
      country:
        customerToEdit?.country ?? (selectCountryOptions[0].value as string),
    },
  });

  const onSubmit = handleSubmit(async (formData: FormData) => {
    if (formData.type === "PERSON") {
      formData.company = null;
      formData.siret = null;
    }

    if (formData.type === "COMPANY") {
      formData.firstname = null;
      formData.lastname = null;
    }

    const [isSuccess, data] = customerToEdit
      ? await updateCustomer(customerToEdit.id, {
          ...formData,
          postalCode: parseInt(formData.postalCode),
        })
      : await createCustomer({
          ...formData,
          postalCode: parseInt(formData.postalCode),
        });

    if (isSuccess) {
      if (!customerToEdit) reset();

      changeCustomer(data as Customer);
      toast(
        "success",
        customerToEdit
          ? "Le client a bien été modifié."
          : "Le nouveau client a bien été ajouté."
      );
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
    <form className="addEditCustomerForm" onSubmit={onSubmit}>
      <div className="addEditCustomerForm__selectCustomerType">
        <p>Type du client</p>
        <div className="addEditCustomerForm__selectCustomerType-items">
          <button
            type="button"
            className={`addEditCustomerForm__selectCustomerType-item ${
              watch("type") === "PERSON"
                ? "addEditCustomerForm__selectCustomerType-item--active"
                : ""
            }`.trim()}
            onClick={() => setValue("type", "PERSON")}
          >
            <span>
              <Icon name="check" />
            </span>
            Particulier
          </button>
          <button
            type="button"
            className={`addEditCustomerForm__selectCustomerType-item ${
              watch("type") === "COMPANY"
                ? "addEditCustomerForm__selectCustomerType-item--active"
                : ""
            }`.trim()}
            onClick={() => setValue("type", "COMPANY")}
          >
            <span>
              <Icon name="check" />
            </span>
            Entreprise
          </button>
        </div>
      </div>

      <div className="addEditCustomerForm__general">
        <h3>Informations générales</h3>
        {watch("type") === "PERSON" && (
          <div className="addEditCustomerForm__name">
            <TextInput
              error={errors.firstname}
              label="Prénom"
              {...register("firstname")}
            />

            <TextInput
              error={errors.lastname}
              label="Nom de famille"
              {...register("lastname")}
            />
          </div>
        )}
        {watch("type") === "COMPANY" && (
          <div className="addEditCustomerForm__name">
            <TextInput
              error={errors.company}
              label="Nom de l'entreprise"
              {...register("company")}
            />

            <TextInput
              error={errors.siret}
              type="number"
              label="Numéro SIRET"
              {...register("siret")}
            />
          </div>
        )}

        <TextInput
          error={errors.email}
          type="email"
          label="Adresse email"
          {...register("email")}
        />

        <TextInput
          error={errors.phone}
          label="Numéro de téléphone (facultatif)"
          {...register("phone")}
        />
      </div>

      <div className="addEditCustomerForm__address">
        <h3>Adresse</h3>
        <TextInput
          error={errors.address}
          label="Adresse"
          {...register("address")}
        />

        <div className="addEditCustomerForm__city">
          <TextInput error={errors.city} label="Ville" {...register("city")} />

          <TextInput
            error={errors.postalCode}
            type="number"
            label="Code postal"
            {...register("postalCode")}
          />
        </div>

        <SelectInput
          error={errors.country}
          options={selectCountryOptions}
          label="Pays"
          {...register("country")}
        />
      </div>

      <Button
        isLoading={isSubmitting}
        icon={!customerToEdit ? "user-plus" : "".trim()}
        center={true}
        htmlType="submit"
      >
        {customerToEdit ? "Mettre à jour" : "Ajouter le client"}
      </Button>
    </form>
  );
}
