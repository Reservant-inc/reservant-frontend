import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import * as yup from "yup";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import "./Register.css";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  birthDate: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = yup.object({
  firstName: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "First name can only contain letters.")
    .required("First name is required"),

  lastName: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "Last name can only contain letters.")
    .required("Last name is required"),

  email: yup.string().email("Invalid e-mail").required("E-mail is required"),

  phoneNumber: yup
    .string()
    .matches(/^\+[1-9]\d{1,14}$/, "Invalid phone number")
    .required("Phone number is required"),

  birthDate: yup
    .date()
    .required("Birth date is required")
    .min("1969-11-13", "Date is too early")
    .max("2023-11-13", "Date is too late"),

  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must contain 8 characters, one uppercase, one lowercase, one number and one special character",
    )
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), ""], "Passwords must match")
    .required("Password confirmation is required"),
});

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      setSubmitting(true);
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
            phoneNumber: values.phoneNumber,
            birthDate: values.birthDate,
            password: values.password,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Invalid login data");
      }

      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
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
                <label htmlFor="phoneNumber">Phone number:</label>
                <PhoneInput
                  international
                  defaultCountry="PL"
                  value={formik.values.phoneNumber}
                  onChange={(value) =>
                    formik.setFieldValue("phoneNumber", value)
                  }
                  className="phone-input"
                />
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
