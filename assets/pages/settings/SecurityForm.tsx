import React, { useRef, useState } from "react";
import { useToast } from "../../hooks/useToast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { deleteUser, updateUser } from "../../services/UserService";
import { Violation } from "../../types/Violation";
import { useAuth } from "../../hooks/useAuth";
import { PasswordInput } from "../../components/form/PasswordInput";
import { Button } from "../../components/Button";
import { ErrorResponse } from "../../types/ErrorResponse";
import { User } from "../../types/User";
import { Icon } from "../../components/Icon";
import { Modal } from "../../components/Modal";

type FormData = {
  password: string;
  passwordConfirm: string;
};

function isErrorResponse(
  response: ErrorResponse | User
): response is ErrorResponse {
  return (response as ErrorResponse).violations !== undefined;
}

export function SecurityForm() {
  const { userData, logout } = useAuth();
  const toast = useToast();

  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const openDeleteAccountModalBtn = useRef<HTMLButtonElement>(null);

  const schema: yup.AnyObjectSchema = yup.object().shape({
    password: yup
      .string()
      .min(3, "Le mot de passe doit contenir au minimum 3 caractères.")
      .max(255, "Le mot de passe ne peut dépasser 255 caractères.")
      .required("Ce champ est requis."),
    passwordConfirm: yup
      .string()
      .oneOf(
        [yup.ref("password"), null],
        "Les mots de passe ne correspondent pas."
      )
      .required("Ce champ est requis."),
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = useForm<FormData>({
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async ({ password }) => {
    const [isSuccess, data] = await updateUser(userData.id, { password });
    if (isSuccess) {
      toast("success", "Votre mot de passe a bien été mis à jour.");
    } else {
      if (isErrorResponse(data)) {
        data.violations?.forEach((violation: Violation) => {
          const invalidProperty: any = violation.propertyPath;
          setError(invalidProperty, {
            type: "manual",
            message: violation.message,
          });
        });
      }
    }
  });

  const openDeleteAccountModal = () => setShowDeleteAccountModal(true);

  const closeDeleteAccountModal = () => {
    setShowDeleteAccountModal(false);
    openDeleteAccountModalBtn.current?.focus();
  };

  const handleDeleteBtn = async () => {
    const [isSuccess] = await deleteUser(userData.id);
    if (isSuccess) {
      const [isSuccess] = await logout();
      if (isSuccess) toast("success", "Votre compte a bien été supprimé.");
    } else {
      toast(
        "error",
        "Une erreur inattendue s'est produite, veuillez réessayer plus tard."
      );
    }
  };

  return (
    <>
      <Modal
        isOpen={showDeleteAccountModal}
        onClose={closeDeleteAccountModal}
        title="Supprimer mon compte"
        className="deleteInvoiceModal"
      >
        <p>
          Êtes-vous sûr de vouloir supprimer votre compte et toutes les données
          associées ? (action irréversible)
        </p>
        <div className="deleteInvoiceModal__ctas">
          <Button
            type="contrast"
            onClick={closeDeleteAccountModal}
            icon="close"
          >
            Annuler
          </Button>
          <Button color="danger" onClick={handleDeleteBtn} icon="trash">
            Supprimer
          </Button>
        </div>
      </Modal>
      <div className="settings__security">
        <div className="settings__security-item">
          <h3>Mot de passe</h3>
          <form onSubmit={onSubmit}>
            <PasswordInput
              error={errors.password}
              label="Nouveau mot de passe"
              {...register("password")}
            />

            <PasswordInput
              error={errors.passwordConfirm}
              label="Confirmez votre nouveau mot de passe"
              {...register("passwordConfirm")}
            />

            <Button isLoading={isSubmitting} htmlType="submit" center={true}>
              Mettre à jour
            </Button>
          </form>
        </div>
        <div className="settings__security-item">
          <h3>Danger</h3>
          <div className="settings__security-danger">
            <div className="settings__security-danger-title">
              <Icon name="caution" />
              <h4>Zone de Danger</h4>
            </div>
            <p>
              Vous pouvez supprimer votre compte en cliquant sur le bouton
              ci-dessous. Cette action est irréversible et entraînera la
              suppression de toutes les données relatives à votre compte..
            </p>
            <Button
              icon="trash"
              type="outline"
              color="danger"
              center={true}
              onClick={openDeleteAccountModal}
              ref={openDeleteAccountModalBtn}
            >
              Supprimer mon compte
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
