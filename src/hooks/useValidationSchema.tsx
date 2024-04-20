import { useTranslation } from "react-i18next";
import * as yup from "yup";

export const useValidationSchemas = () => {
  const [t] = useTranslation("global");

  const loginSchema = yup.object({
    login: yup.string().required(t("errors.login.login")),
    password: yup.string().required(t("errors.login.password")),
  });

  const userRegisterSchema = yup.object({
    firstName: yup
      .string()
      .matches(/^[a-zA-Z]+$/, t("errors.user-register.firstName.matches"))
      .required(t("errors.user-register.firstName.required")),
  
    lastName: yup
      .string()
      .matches(/^[a-zA-Z]+$/, t("errors.user-register.lastName.matches"))
      .required(t("errors.user-register.lastName.required")),

    login: yup
      .string()
      .required(t("errors.user-register.login.required")),  
  
    email: yup.string()
      .email(t("errors.user-register.email.matches"))
      .required(t("errors.user-register.email.required")),
  
    phoneNumber: yup
      .string()
      .matches(/^\+[0-9]{11,15}$/, t("errors.user-register.phoneNumber.matches"))
      .required(t("errors.user-register.phoneNumber.required")),
  
    birthDate: yup
      .date()
      .min("1969-11-13", t("errors.user-register.birthDate.min"))
      .max("2023-11-13", t("errors.user-register.birthDate.max"))
      .required(t("errors.user-register.birthDate.required")),
  
    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        t("errors.user-register.password.matches"),
      )
      .required(t("errors.user-register.password.required")),
  
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), ""], t("errors.user-register.confirmPassword.matches"))
      .required(t("errors.user-register.confirmPassword.required")),
  });

  const employeeRegisterSchema = yup.object({
    firstName: yup
      .string()
      .matches(/^[a-zA-Z]+$/, t("errors.user-register.firstName.matches"))
      .required(t("errors.user-register.firstName.required")),
  
    lastName: yup
      .string()
      .matches(/^[a-zA-Z]+$/, t("errors.user-register.lastName.matches"))
      .required(t("errors.user-register.lastName.required")),

    login: yup
      .string()
      .required(t("errors.user-register.login.required")),  
  
    phoneNumber: yup
      .string()
      .matches(/^\+[0-9]{11,15}$/, t("errors.user-register.phoneNumber.matches"))
      .required(t("errors.user-register.phoneNumber.required")),

    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        t("errors.user-register.password.matches"),
      )
      .required(t("errors.user-register.password.required")),
  
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), ""], t("errors.user-register.confirmPassword.matches"))
      .required(t("errors.user-register.confirmPassword.required"))
  })

  const RestaurantAddEmployeeSchema = yup.object({
    isBackdoorEmployee: yup.boolean(),
    isHallEmployee: yup.boolean() 
  }).test(
    t("errors.add-employee.employeeRole.required"),
    { context: { message: t("errors.employee-register.employeeRole.required") } }, 
    (obj) => {
      if (obj.isBackdoorEmployee || obj.isHallEmployee) {
        return true;
      }
  
      return new yup.ValidationError(
        t("errors.add-employee.employeeRole.required"),
        null,
        'isHallEmployee'
      );
    }
  );

  return {
    loginSchema,
    userRegisterSchema,
    employeeRegisterSchema,
    RestaurantAddEmployeeSchema
  };
};