import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useTranslation } from "react-i18next";
import { useValidationSchemas } from "../../hooks/useValidationSchema";
import ErrorMes from "../reusableComponents/ErrorMessage";
import { fetchPOST, fetchGET } from "../../services/APIconn";

const initialValues = {
  firstName: "",
  lastName: "",
  login: "",
  email: "",
  phoneNumber: "",
  birthDate: "",
  password: "",
  confirmPassword: "",
};

const UserRegister: React.FC = () => {
  const navigate = useNavigate();

  const [t] = useTranslation("global");

  const { userRegisterSchema } = useValidationSchemas();

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      setSubmitting(true);

      const body = JSON.stringify({
        firstName: values.firstName,
        lastName: values.lastName,
        login: values.login,
        email: values.email,
        phoneNumber: values.phoneNumber,
        birthDate: values.birthDate,
        password: values.password,
      });

      await fetchPOST("/auth/register-customer", body);

      navigate("/user/login");
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div  id="userRegister-container-register" className="container-register">
      <Formik
        id="iserRegister-formik"
        initialValues={initialValues}
        validationSchema={userRegisterSchema}
        onSubmit={handleSubmit}
        //potencjalnie do rozważenia, więcej o tym w EmployeeRegister
        /////////////////////////////////////////////////////////////
        validateOnChange={false}
        validateOnBlur={true}
        /////////////////////////////////////////////////////////////
      >
        {(formik) => (
          <Form>
            <div id="userRegister-form-container" className="form-container">
              <div id="userRegister-firstName-form-control" className="form-control">
                <label id="userRegister-firstName-label" htmlFor="firstName">{t("auth.firstName")}:</label>
                <Field
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={
                    !(formik.errors.firstName && formik.touched.firstName)
                      ? "border-none"
                      : "border-pink border-2 border-solid"
                  }
                />
                <ErrorMessage id="userRegister-firstName-errorMessage" name="firstName">
                  {(msg) => <ErrorMes msg={msg} />}
                </ErrorMessage>
              </div>

              <div id="userRegister-lastName-form-control" className="form-control">
                <label id="userRegister-lastName-label" htmlFor="lastName">{t("auth.lastName")}:</label>
                <Field
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={
                    !(formik.errors.lastName && formik.touched.lastName)
                      ? "border-none"
                      : "border-pink border-2 border-solid"
                  }
                />
                <ErrorMessage id="userRegister-lastName-errorMessage" name="lastName">
                  {(msg) => <ErrorMes msg={msg} />}
                </ErrorMessage>
              </div>

              <div id="userRegister-login-form-control" className="form-control">
                <label id="userRegister-login-label" htmlFor="login">Login:</label>
                <Field
                  type="text"
                  id="login"
                  name="login"
                  className={
                    !(formik.errors.login && formik.touched.login)
                      ? "border-none"
                      : "border-pink border-2 border-solid"
                  }
                />
                <ErrorMessage id="userRegister-login-errorMessage" name="login">
                  {(msg) => <ErrorMes msg={msg} />}
                </ErrorMessage>
              </div>

              <div id="userRegister-email-form-control" className="form-control">
                <label htmlFor="email">E-mail:</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className={
                    !(formik.errors.email && formik.touched.email)
                      ? "border-none"
                      : "border-pink border-2 border-solid"
                  }
                />
                <ErrorMessage id="userRegister-email-errorMessage" name="email">
                  {(msg) => <ErrorMes msg={msg} />}
                </ErrorMessage>
              </div>

              <div id="userRegister-phoneNumber-form-control" className="form-control">
                <label id="userRegister-phoneNumber-label" htmlFor="phoneNumber">{t("auth.phoneNumber")}:</label>
                <Field
                  as={PhoneInput}
                  international
                  defaultCountry="PL"
                  id="userRegister-phoneNumber-field"
                  name={"phoneNumber"}
                  value={formik.values.phoneNumber}
                  onChange={(value: string) =>
                    formik.setFieldValue("phoneNumber", value)
                  }
                  className={
                    !(formik.errors.phoneNumber && formik.touched.phoneNumber)
                      ? "border-none"
                      : "border-pink border-2 border-solid"
                  }
                />
                <ErrorMessage id="userRegister-phoneNumber-errorMessage" name="phoneNumber">
                  {(msg) => <ErrorMes msg={msg} />}
                </ErrorMessage>
              </div>

              <div className="form-control" id="userRegister-birthDate-formControl">
                <label id="userRegister-birthDate-label" htmlFor="birthDate">{t("auth.birthDate")}:</label>
                <Field
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  className={
                    !(formik.errors.birthDate && formik.touched.birthDate)
                      ? "border-none"
                      : "border-pink border-2 border-solid"
                  }
                />
                <ErrorMessage id="userRegister-birthDate-errorMessage" name="birthDate">
                  {(msg) => <ErrorMes msg={msg} />}
                </ErrorMessage>
              </div>

              <div id="userRegister-password-form-control" className="form-control">
                <label id="userREgister-password-label" htmlFor="password">{t("auth.password")}:</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className={
                    !(formik.errors.password && formik.touched.password)
                      ? "border-none"
                      : "border-pink border-2 border-solid"
                  }
                />
                <ErrorMessage id="userRegister-password-errorMessage" name="password">
                  {(msg) => <ErrorMes msg={msg} />}
                </ErrorMessage>
              </div>

              <div id="userRegister-confirmPassword-form-control" className="form-control">
                <label id="userRegister-confirmPassword-label" htmlFor="confirmPassword">
                  {t("auth.confirmPassword")}:
                </label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={
                    !(
                      formik.errors.confirmPassword &&
                      formik.touched.confirmPassword
                    )
                      ? "border-none"
                      : "border-pink border-2 border-solid"
                  }
                />
                <ErrorMessage id="userRegister-confirmPassword-errorMessage" name="confirmPassword">
                  {(msg) => <ErrorMes msg={msg} />}
                </ErrorMessage>
              </div>

              <button
                id="UserRegisterSubmitButton"
                type="submit"
                disabled={!formik.isValid}
              >
                {t("auth.registerButton")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserRegister;
