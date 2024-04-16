import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikValues, FieldArray } from "formik";
import * as yup from "yup";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useTranslation } from "react-i18next";

const initialValues = {
  login: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  restaurandId: "",
  password: "",
  confirmPassword: "",
  isBackdoorEmployee: "",
  isHallEmployee: ""
};

const restaurantAddEmp = () => {
  
  const navigate = useNavigate();
  
  const [t] = useTranslation("global")
  
  const validationSchema = yup.object({
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
      .required(t("errors.user-register.confirmPassword.required")),

    isBackdoorEmployee: yup
      .boolean(),

    isHallEmployee: yup
      .boolean()
    
  }).test(
    t("errors.employee-register.employeeRole.required"),
    { context: { message: t("errors.employee-register.employeeRole.required") } }, 
    (obj) => {
      if (obj.isBackdoorEmployee || obj.isHallEmployee) {
        return true;
      }
  
      return new yup.ValidationError(
        t("errors.employee-register.employeeRole.required"),
        null,
        'isHallEmployee'
      );
    }
  );
  


  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      setSubmitting(true);
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_IP}/auth/register-restaurant-employee`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: values.login,
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            restaurantId: values.restaurantId,
            password: values.password,
            isBackdoorEmployee: values.isBackdoorEmployee,
            isHallEmployee: values.isHallEmployee,
          }),
        },
      );

      if (!response.ok) {
        console.log(await response.json())
        throw new Error("Invalid register data");
      }

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
                <label htmlFor="login">Login:</label>
                <Field type="text" id="login" name="login" />
                <ErrorMessage name="login" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="phoneNumber">{t("auth.phoneNumber")}:</label>
                <Field as={PhoneInput}
                  international
                  defaultCountry="PL"
                  name={"phoneNumber"}
                  value={formik.values.phoneNumber}
                  onChange={(value: string) => 
                    formik.setFieldValue("phoneNumber", value)
                  }
                  className="phone-input"
                />
                <ErrorMessage name="phoneNumber" component="div" />
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

              <div className="form-control">
                <div className="employeeRole">

                    <Field
                      type="checkbox"
                      id="isBackdoorEmployee"
                      name="isBackdoorEmployee"
                    />
                  <label htmlFor="isBackdoorEmployee">{t("employee-register.isBackdoorEmployee")}</label>
                    <Field
                      type="checkbox"
                      id="isHallEmployee"
                      name="isHallEmployee"
                    />
                  <label htmlFor="isHallEmployee">{t("employee-register.isHallEmployee")}</label>

                </div>
                <ErrorMessage name="isHallEmployee" component="div" />
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

export default restaurantAddEmp