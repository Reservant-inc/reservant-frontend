import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import * as yup from "yup";
import "dotenv/config"
import "./Register.css";
import { useTranslation } from "react-i18next";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  diallingCode: "",
  phoneNumber: "",
  birthDate: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  
  const navigate = useNavigate();
  
  const [t, i18n] = useTranslation("global")
  
  const validationSchema = yup.object({
    firstName: yup
      .string()
      .matches(/^[a-zA-Z]+$/, t("errors.user-register.firstName.matches"))
      .required(t("errors.user-register.firstName.required")),
  
    lastName: yup
      .string()
      .matches(/^[a-zA-Z]+$/, t("errors.user-register.lastName.matches"))
      .required(t("errors.user-register.lastName.required")),
  
    email: yup.string()
      .email(t("errors.user-register.email.matches"))
      .required(t("errors.user-register.email.required")),
  
    diallingCode: yup
      .string()
      .matches(/^\+[0-9]{2}$/, "invalid dialling code")
      .required("dialling code is required"),
  
    phoneNumber: yup
      .string()
      .matches(/^[0-9]{9}$/, t("errors.user-register.phoneNumber.matches"))
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
  

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      // Set submitting state to true to indicate form submission is in progress
      setSubmitting(true);
      // Send data to server
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_IP}/auth/register-customer`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: `${values.diallingCode}${values.phoneNumber}`,
            birthDate: values.birthDate,
            password: values.password,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Invalid login data");
      }

      // TODO - add data to web local storage for further use

      //TODO - nawigacja po rejestracji
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      // Set submitting state to false when form submission completes (whether it succeeded or failed)
      setSubmitting(false);
    }
  };

  return (
    <div className="container-register">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          //TODO - add username/login?????????
          //TODO - sposob na polaczenie prefixu numeru i numeru / jak uzyskac dostep do values
          <Form>
            <div className="form-container">
              <div className="form-control">
                <label htmlFor="firstName">{t("auth.firstName")}:</label>
                <Field type="text" id="firstName" name="firstName" />
                <ErrorMessage name="firstName" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="lastName">{t("auth.lastName")}:</label>
                <Field type="text" id="lastName" name="lastName" />
                <ErrorMessage name="lastName" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="email">E-mail:</label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage name="email" component="div" />
              </div>

              <div className="form-control">
                <Field type="text" id="diallingCode" name="diallingCode" />
                <ErrorMessage name="diallingCode" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="phoneNumber">{t("auth.phoneNumber")}:</label>
                <Field type="text" id="phoneNumber" name="phoneNumber" />
                <ErrorMessage name="phoneNumber" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="birthDate">{t("auth.birthDate")}:</label>
                <Field type="date" id="birthDate" name="birthDate" />
                <ErrorMessage name="birthDate" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="password">{t("auth.password")}:</label>
                <Field type="password" id="password" name="password" />
                <ErrorMessage name="password" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="confirmPassword">{t("auth.confirmPassword")}:</label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                />
                <ErrorMessage name="confirmPassword" component="div" />
              </div>

              <button type="submit" disabled={!formik.isValid}>
                {t("auth.registerButton")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
