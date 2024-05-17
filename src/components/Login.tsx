import React from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import { AuthData } from "./routing/AuthWrapper";
import { fetchPOST } from "../services/APIconn";
import { useValidationSchemas } from "../hooks/useValidationSchema";
import Error from "./reusableComponents/ErrorMessage"

const initialValues = {
  login: "",
  password: "",
};

const Login: React.FC = () => {
  const [t] = useTranslation("global");
  const { login } = AuthData();
  const { loginSchema } = useValidationSchemas();

  const onSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      setSubmitting(true);

      const response = await fetchPOST("/auth/login", JSON.stringify(values));

      login(response);
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
        validationSchema={loginSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
            <div className="form-container">
              <div className="form-control">
                <label htmlFor="login">Login:</label>
                <Field type="text" id="login" name="login" className={!(formik.errors.login && formik.touched.login)?"border-none":"border-solid border-2 border-pink"}/>
                <ErrorMessage name="login">
                  { msg => <Error msg={msg}/> }
                </ErrorMessage>
              </div>

              <div className="form-control">
                <label htmlFor="password">{t("auth.password")}:</label>
                <Field type="password" id="password" name="password" className={!(formik.errors.password && formik.touched.password)?"border-none":"border-solid border-2 border-pink"}/>
                <ErrorMessage name="password">
                  { msg => <Error msg={msg}/> }
                </ErrorMessage>
              </div>

              <button id="LoginLoginButton" type="submit" disabled={!formik.isValid}>
                Login
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="container-links">
        <p>
          {t("landing-page.notRegistered")}{" "}
          <Link to="/user/register">{t("landing-page.registerButton")}</Link>
        </p>
        <Link to="/">{t("landing-page.resetPassword")}</Link>
      </div>
    </div>
  );
};

export default Login;
