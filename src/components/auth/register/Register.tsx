import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import * as yup from "yup";
import "dotenv/config"
import "./Register.css";

//TODO - username/login?
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

// Set yup validation schema to validate defined fields and error messages
/*
TODO
username/login - czekamy na koncowke
phone number (co z tym na backu) + prefix
trzeba zrobic lepszy regex dla maila
jakaś aktualizująca się max date / min date
imie/nazwisko - regex na ąę?
to samo z telefonem(czy mozna zrobic pozniej trim?)
*/
const validationSchema = yup.object({
  firstName: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "first name can only contain letters.")
    .required("first name is required"),

  lastName: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "last name can only contain letters.")
    .required("last name is required"),

  email: yup.string().email("invalid e-mail").required("e-mail is required"),

  diallingCode: yup
    .string()
    .matches(/^\+[0-9]{2}$/, "invalid dialling code")
    .required("dialling code is required"),

  phoneNumber: yup
    .string()
    .matches(/^[0-9]{9}$/, "invalid phone number")
    .required("phone number is required"),

  birthDate: yup
    .date()
    .required("birth date is required")
    .min("1969-11-13", "Date is too early")
    .max("2023-11-13", "Date is too late"),

  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "must contain 8 characters, one uppercase, one lowercase, one number and one special character",
    )
    .required("password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), ""], "passwords must match")
    .required("password confirmation is required"),
});

export default function Register() {
  const navigate = useNavigate();

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
                <label htmlFor="firstName">First name:</label>
                <Field type="text" id="firstName" name="firstName" />
                <ErrorMessage name="firstName" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="lastName">Last name:</label>
                <Field type="text" id="lastName" name="lastName" />
                <ErrorMessage name="lastName" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="email">E-mail:</label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage name="email" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="diallingCode">Dialling code:</label>
                <Field type="text" id="diallingCode" name="diallingCode" />
                <ErrorMessage name="diallingCode" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="phoneNumber">Phone number:</label>
                <Field type="text" id="phoneNumber" name="phoneNumber" />
                <ErrorMessage name="phoneNumber" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="birthDate">Birth date:</label>
                <Field type="date" id="birthDate" name="birthDate" />
                <ErrorMessage name="birthDate" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="password">Password:</label>
                <Field type="password" id="password" name="password" />
                <ErrorMessage name="password" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="confirmPassword">Confirm password:</label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                />
                <ErrorMessage name="confirmPassword" component="div" />
              </div>

              <button type="submit" disabled={!formik.isValid}>
                Register
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
