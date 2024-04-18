import { useTranslation } from "react-i18next";
import * as yup from "yup";

export const useValidationSchemas = () => {
  const [t] = useTranslation("global");

  const loginSchema = yup.object({
    login: yup.string().required(t("errors.login.login")),
    password: yup.string().required(t("errors.login.password")),
  });

  return {
    loginSchema
  };
};