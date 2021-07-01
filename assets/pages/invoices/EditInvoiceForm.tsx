import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Option, SelectInput } from "../../components/form/SelectInput";
import { ModalContext } from "../../components/Modal";
import { useToast } from "../../hooks/useToast";
import { Invoice } from "../../types/Invoice";
import * as yup from "yup";
import { updateInvoice } from "../../services/InvoiceService";
import { ErrorResponse } from "../../types/ErrorResponse";
import { Violation } from "../../types/Violation";
import { DatePickerInput } from "../../components/form/DatePickerInput";
import { Button } from "../../components/Button";

type Props = {
  invoiceToEdit: Invoice;
  editInvoice: (invoice: Invoice) => void;
};

type FormData = {
  status: string;
  sentAt: string | null;
  paidAt: string | null;
};

export function EditInvoiceForm({ invoiceToEdit, editInvoice }: Props) {
  const { onClose } = useContext(ModalContext);
  const toast = useToast();

  const selectStatusOptions: Option[] = useMemo(() => {
    return [
      { value: "NEW", label: "Nouveau" },
      { value: "SENT", label: "Envoyé" },
      { value: "PAID", label: "Payé" },
      { value: "CANCELLED", label: "Annulé" },
    ];
  }, []);

  const schema: yup.AnyObjectSchema = yup.object().shape({
    status: yup.string(),
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
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    watch,
  } = useForm<FormData>({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: {
      status: invoiceToEdit.status ?? "NEW",
      sentAt: invoiceToEdit?.sentAt ? invoiceToEdit.sentAt.substr(0, 19) : null,
      paidAt: invoiceToEdit?.paidAt ? invoiceToEdit.paidAt.substr(0, 19) : null,
    },
  });

  const onSubmit = handleSubmit(async (formData: FormData) => {
    if (formData.status === "NEW" || formData.status === "CANCELLED") {
      formData.paidAt = null;
      formData.sentAt = null;
    }
    if (formData.status === "PAID") {
      formData.sentAt = null;
    }
    if (formData.status === "SENT") {
      formData.paidAt = null;
    }

    const [isSuccess, data] = await updateInvoice(
      invoiceToEdit.id,
      formData.status,
      formData.sentAt,
      formData.paidAt
    );
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
      <SelectInput
        error={errors.status}
        label="Statut"
        options={selectStatusOptions}
        {...register("status")}
      />

      {watch("status") === "SENT" && (
        <DatePickerInput
          error={errors.sentAt}
          type="datetime-local"
          label="Date d'envoi"
          {...register("sentAt")}
        />
      )}

      {watch("status") === "PAID" && (
        <DatePickerInput
          error={errors.paidAt}
          type="datetime-local"
          label="Date de paiement"
          {...register("paidAt")}
        />
      )}

      <Button isLoading={isSubmitting} center={true} htmlType="submit">
        Mettre à jour
      </Button>
    </form>
  );
}
