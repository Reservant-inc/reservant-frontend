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

    login: yup.string().required(t("errors.user-register.login.required")),

    email: yup
      .string()
      .email(t("errors.user-register.email.matches"))
      .required(t("errors.user-register.email.required")),

    phoneNumber: yup
      .string()
      .matches(
        /^\+[0-9]{11,15}$/,
        t("errors.user-register.phoneNumber.matches"),
      )
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
      .oneOf(
        [yup.ref("password"), ""],
        t("errors.user-register.confirmPassword.matches"),
      )
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

    login: yup.string().required(t("errors.user-register.login.required")),

    phoneNumber: yup
      .string()
      .matches(
        /^\+[0-9]{11,15}$/,
        t("errors.user-register.phoneNumber.matches"),
      )
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
      .oneOf(
        [yup.ref("password"), ""],
        t("errors.user-register.confirmPassword.matches"),
      )
      .required(t("errors.user-register.confirmPassword.required")),
  });

  const RestaurantAddEmployeeSchema = yup
    .object({
      isBackdoorEmployee: yup.boolean(),
      isHallEmployee: yup.boolean(),
    })
    .test(
      t("errors.add-employee.employeeRole.required"),
      {
        context: {
          message: t("errors.employee-register.employeeRole.required"),
        },
      },
      (obj) => {
        if (obj.isBackdoorEmployee || obj.isHallEmployee) {
          return true;
        }

        return new yup.ValidationError(
          t("errors.add-employee.employeeRole.required"),
          null,
          "hasRole",
        );
      },
    );

  const RestaurantRegisterStep2Schema = yup.object({
    description: yup
      .string()
      .max(200, t("errors.restaurant-register.description.max"))
      .min(3, t("errors.restaurant-register.description.min"))
      .required(t("errors.restaurant-register.description.required")),
    tags: yup.array().min(3, t("errors.restaurant-register.tags.min")),
    logoFile: yup
      .mixed()
      .required(t("errors.restaurant-register.logo.required")),
    photosFile: yup
      .mixed()
      .required(t("errors.restaurant-register.photos.required")),
  });

  const RestaurantRegisterStep1Schema = yup.object({
    name: yup.string().required(t("errors.restaurant-register.name.required")),
    address: yup
      .string()
      .required(t("errors.restaurant-register.address.required")),
    postalIndex: yup
      .string()
      .matches(
        /^[0-9]{2}-[0-9]{3}$/,
        t("errors.restaurant-register.postalCode.matches"),
      )
      .required(t("errors.restaurant-register.postalCode.required")),
    city: yup.string().required(t("errors.restaurant-register.city.required")),
    nip: yup
      .string()
      .matches(/^[0-9]{10}$/, t("errors.restaurant-register.tin.matches"))
      .required(t("errors.restaurant-register.tin.required")),
    restaurantType: yup
      .string()
      .required(t("errors.restaurant-register.businessType.required")),
    idCardFile: yup
      .mixed()
      .required(t("errors.restaurant-register.id.required")),
    businessPermissionFile: yup
      .mixed()
      .required(t("errors.restaurant-register.businessPermission.required")),
  });

  const RestaurantEditSchema = yup.object({
    name: yup.string().required(t("errors.restaurant-register.name.required")),
    address: yup
      .string()
      .required(t("errors.restaurant-register.address.required")),
    postalIndex: yup
      .string()
      .matches(
        /^[0-9]{2}-[0-9]{3}$/,
        t("errors.restaurant-register.postalCode.matches"),
      )
      .required(t("errors.restaurant-register.postalCode.required")),
    city: yup.string().required(t("errors.restaurant-register.city.required")),
    restaurantType: yup
      .string()
      .required(t("errors.restaurant-register.businessType.required")),
    description: yup
      .string()
      .max(200, t("errors.restaurant-register.description.max"))
      .min(3, t("errors.restaurant-register.description.min"))
      .required(t("errors.restaurant-register.description.required")),
    tags: yup.array().min(3, t("errors.restaurant-register.tags.min")),
  });

  return {
    loginSchema,
    userRegisterSchema,
    employeeRegisterSchema,
    RestaurantAddEmployeeSchema,
    RestaurantRegisterStep1Schema,
    RestaurantRegisterStep2Schema,
    RestaurantEditSchema,
  };
};
