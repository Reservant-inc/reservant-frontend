import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { fetchGET } from "../services/APIconn";
import {

  isValidPhoneNumber


} from 'libphonenumber-js';

export const useValidationSchemas = () => {
  const [t] = useTranslation("global");

  const loginSchema = yup.object({
    login: yup.string().required(t("errors.login.login")),
    password: yup.string().required(t("errors.login.password")),
  });

  const userRegisterSchema = yup.object({
    firstName: yup
      .string()
      .matches(
        /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
        t("errors.user-register.firstName.matches"),
      )
      .required(t("errors.user-register.firstName.required")),

    lastName: yup
      .string()
      .matches(
        /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
        t("errors.user-register.lastName.matches"),
      )
      .required(t("errors.user-register.lastName.required")),

    login: yup
      .string()
      .required(t("errors.user-register.login.required"))
      .test("unique login", t("errors.user-register.login.taken"), (login) => {
        return new Promise((resolve, reject) => {
          fetchGET(`/auth/is-unique-login?login=${login}`)
            .then((res) => {
              if (res) resolve(true);
              else resolve(false);
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }),

    email: yup
      .string()
      .email(t("errors.user-register.email.matches"))
      .required(t("errors.user-register.email.required")),

    phoneNumber: yup
    .string()
    .required(t("errors.user-register.phoneNumber.required"))
    .test("phone number valid", t("errors.user-register.phoneNumber.matches"), (phone) => {
      return isValidPhoneNumber(phone)
    }),

    birthDate: yup
      .date()
      .min("1900-01-01", t("errors.user-register.birthDate.min"))
      .max("2024-06-24", t("errors.user-register.birthDate.max"))
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

    login: yup
      .string()
      .required(t("errors.user-register.login.required"))
      .test("unique login", t("errors.user-register.login.taken"), (login) => {
        return new Promise((resolve, reject) => {
          fetchGET(`/auth/is-unique-login?login=${login}`)
            .then((res) => {
              if (res) resolve(true);
              else resolve(false);
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }),

    phoneNumber: yup
      .string()
      .matches(
        /^\+[0-9]{11,15}$/,
        t("errors.user-register.phoneNumber.matches"),
      )
      .required(t("errors.user-register.phoneNumber.required")),

    birthDate: yup.string().required(),

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
      selectedRestaurant: yup
        .string()
        .required("please select one of the available restaurants"),
    })
    .test(
      "at-least-one-checkbox",
      t("errors.employee-register.employeeRole.required"),
      (obj) => {
        if (obj.isBackdoorEmployee || obj.isHallEmployee) {
          return true;
        }

        return new yup.ValidationError([
          new yup.ValidationError(
            t("errors.add-employee.employeeRole.required"),
            null,
            "isBackdoorEmployee",
          ),
          new yup.ValidationError(
            t("errors.add-employee.employeeRole.required"),
            null,
            "isHallEmployee",
          ),
        ]);
      },
    );

  const RestaurantRegisterStep3Schema = yup.object({
    logo: yup.mixed().required(t("errors.restaurant-register.logo.required")),
    photos: yup
      .mixed()
      .required(t("errors.restaurant-register.photos.required")),
    idCard: yup.mixed().required(t("errors.restaurant-register.id.required")),
    businessPermission: yup
      .mixed()
      .required(t("errors.restaurant-register.businessPermission.required")),
  });

  const RestaurantRegisterStep2Schema = yup.object({
    description: yup
      .string()
      .max(200, t("errors.restaurant-register.description.max"))
      .min(3, t("errors.restaurant-register.description.min"))
      .required(t("errors.restaurant-register.description.required")),
    tags: yup.array().min(3, t("errors.restaurant-register.tags.min")),
    reservationDeposit: yup
    .number()
    .typeError(t("errors.restaurant-register.reservationDeposit.number")) // Komunikat dla nieprawidłowej liczby
    .min(0, t("errors.restaurant-register.reservationDeposit.min"))
    .max(300, t("errors.restaurant-register.reservationDeposit.max"))
    .required(t("errors.restaurant-register.reservationDeposit.required")),
    maxReservationDurationMinutes: yup
    .number()
    .typeError(t("errors.restaurant-register.maxReservationDurationMinutes.number")) // Komunikat dla nieprawidłowej liczby
    .min(0, t("errors.restaurant-register.maxReservationDurationMinutes.min"))
    .max(2000, t("errors.restaurant-register.maxReservationDurationMinutes.max"))
    .required(t("errors.restaurant-register.maxReservationDurationMinutes.required")),
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

  // @todo t

  const menuItemsSchema = yup.object({
    price: yup.number().required().min(0).max(500),
    name: yup.string().required().max(20),
    alternateName: yup.string().max(50),
    alcoholPercentage: yup.number().min(0).max(100),
  })

  // @todo t

  const ingredientSelectorSchema = yup.object({
    ingredientId: yup.string().required(),
    amountUsed: yup.number().required()
  })

 
  const menuSchema = yup.object({
    name: yup.string().required(),
    alternateName: yup.string().required(),
    menuType: yup.string().required(),
    dateFrom: yup.string().required(),
    dateUntil: yup.string().required(),
  })

  return {
    menuSchema,
    loginSchema,
    ingredientSelectorSchema,
    userRegisterSchema,
    employeeRegisterSchema,
    RestaurantAddEmployeeSchema,
    RestaurantRegisterStep1Schema,
    RestaurantRegisterStep2Schema,
    RestaurantRegisterStep3Schema,
    RestaurantEditSchema,
    menuItemsSchema,
  };
};
