import React from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { AuthData } from "./routing/AuthWrapper";
import Cookies from "js-cookie";

const initialValues = {
  login: "",
  password: "",
};

const Login = () => {

  const { login } = AuthData();
  const [t] = useTranslation("global")

  const validationSchema = yup.object({
    login: yup.string().required(t("errors.login.login")),
    password: yup.string().required(t("errors.login.password")),
  });

  const onSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {

    try {
      setSubmitting(true);

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_IP}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );

      if (!response.ok) {
        const errorData = await response.json()
        console.log(errorData);
        throw new Error("Wrong login data")
      }

      const data = await response.json();

      login(data.token)
      Cookies.set('userInfo', JSON.stringify({
        firstName : data.firstName,
        lastName: data.lastName,
        roles: data.roles
      }), { expires: 1 });

    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-login">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
            <div className="form-container">
              <div className="form-control">
                <label htmlFor="login">Login:</label>
                <Field type="text" id="login" name="login" />
                <ErrorMessage name="login" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="password">{t("auth.password")}:</label>
                <Field type="password" id="password" name="password" />
                <ErrorMessage name="password" component="div" />
              </div>

              {
                // TODO - rememberMe Field
              }

              <button type="submit" disabled={!formik.isValid}>
                Login
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="container-links">
        <p>
          {t("landing-page.notRegistered")} <Link to="/user/register">{t("landing-page.registerButton")}</Link>
        </p>
        <Link to="/">{t("landing-page.resetPassword")}</Link>
      </div>
    </div>
  );
};

export default Login;
