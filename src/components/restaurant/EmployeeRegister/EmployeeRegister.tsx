import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
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

const AddEmp = () => {
  
  const navigate = useNavigate();
  
  const [t] = useTranslation("global")
  
  const validationSchema = yup.object({
    firstName: yup
      .string()
      .matches(/^[a-zA-Z]+$/, t("errors.employee-register.firstName.matches"))
      .required(t("errors.employee-register.firstName.required")),
  
    lastName: yup
      .string()
      .matches(/^[a-zA-Z]+$/, t("errors.employee-register.lastName.matches"))
      .required(t("errors.employee-register.lastName.required")),

    login: yup
      .string()
      .required(t("errors.employee-register.login.required")),  
  
    phoneNumber: yup
      .string()
      .matches(/^\+[0-9]{11,15}$/, t("errors.employee-register.phoneNumber.matches"))
      .required(t("errors.employee-register.phoneNumber.required")),


    //TODO jarek - poprawić jak zrobie wybierane z listy
    restaurantId: yup
        .string()
        .matches(/^[0-9]*$/, t("errors.employee-register.restaurantId.matches"))
        .required(t("errors.employee-register.restaurantId.required")),

    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        t("errors.employee-register.password.matches"),
      )
      .required(t("errors.employee-register.password.required")),
  
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), ""], t("errors.employee-register.confirmPassword.matches"))
      .required(t("errors.employee-register.confirmPassword.required")),
  });
  

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      setSubmitting(true);
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_IP}/employee-register/register-customer`,
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
                <label htmlFor="firstName">{t("employee-register.firstName")}:</label>
                <Field type="text" id="firstName" name="firstName" />
                <ErrorMessage name="firstName" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="lastName">{t("employee-register.lastName")}:</label>
                <Field type="text" id="lastName" name="lastName" />
                <ErrorMessage name="lastName" component="div" />
              </div>
              
              <div className="form-control">
                <label htmlFor="login">{t("employee-register.login")}</label>
                <Field type="text" id="login" name="login" />
                <ErrorMessage name="login" component="div" />
              </div>


                {/* //TODO jarek - bedziemy dostawać się do dodawania z poziomu ekranu zarządzania restauracja, ale skad wezmiemy to id..? */}
              <div className="form-control">
                <label htmlFor="restaurantId">{t("employee-register.restaurantId")}</label>
                <Field type="text" id="restaurantId" name="restaurantId" />
                <ErrorMessage name="restaurantId" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="phoneNumber">{t("employee-register.phoneNumber")}:</label>
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
                <label htmlFor="password">{t("employee-register.password")}:</label>
                <Field type="password" id="password" name="password" />
                <ErrorMessage name="password" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="confirmPassword">{t("employee-register.confirmPassword")}:</label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                />
                <ErrorMessage name="confirmPassword" component="div" />
              </div>

              {/* //TODO jarek - dwa checkboxy? jeszcze nie do końca mam pomysł */}

              <button type="submit" disabled={!formik.isValid}>
                {t("employee-register.registerButton")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddEmp