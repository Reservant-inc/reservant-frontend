import React from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import { AuthData } from "./routing/AuthWrapper";
import { fetchPOST } from "../services/APIconn";
import { useValidationSchemas } from "../hooks/useValidationSchema";
import LogoLight from "../assets/images/LOGO-CLEAN-LIGHT.png"

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
    <div className="flex justify-center items-center w-full h-full bg-grey-0">
      <div className="w-[800px] h-[500px] shadow-2xl rounded-lg bg-white flex items-center">
        <div className="w-1/3 h-full flex justify-center items-center">
          <img src={LogoLight} className="h-40"/>
        </div>
        <div className="h-[80%] w-[2px] bg-grey-1"></div>
        <div className="w-2/3 h-full rounded-r-lg flex flex-col justify-center items-center gap-12">
          <Formik
            id="login-formik"
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={onSubmit}
          >
            {(formik) => (
              <Form className="w-full">
                <div id="login-form-containter" className="form-container h-full flex flex-col items-center gap-8">
                  <div className="flex flex-col w-full items-center gap-8">
                    
                    <h1 className="text-xl font-mont-md dont-semibold">LOGIN</h1>

                    <Field
                      type="text"
                      id="login"
                      name="login"
                      placeholder={
                        formik.errors.login && formik.touched.login ? formik.errors.login : 'login'
                      }
                      className={`w-4/5 h-[50px] ring-0 rounded-md ${!(formik.errors.login && formik.touched.login) ? "focus:border-black" : "border-pink border-1 border-solid placeholder-pink"}`}
                    />

                    <Field
                      type="password"
                      id="password"
                      name="password"
                      placeholder={
                        formik.errors.password && formik.touched.password ? formik.errors.password : 'password'
                      }
                      className={`w-4/5 h-[50px] ring-0 rounded-md ${!(formik.errors.password && formik.touched.password) ? "focus:border-black" : "border-pink border-1 border-solid placeholder-pink"}`}
                    />
                  </div>

                  <button
                    id="LoginLoginButton"
                    type="submit"
                    disabled={!formik.isValid}
                    className={`pointer w-4/5 h-[50px] rounded-lg shadow-md ${formik.isValid ? "bg-primary text-white" : "bg-grey-1"}`}
                  >
                    Login
                  </button>

                  <div id="login-container-links" className="w-full flex items-center justify-center">
                    <p id="login-notRegistered-link-wrap">
                      {t("landing-page.notRegistered")}{" "}
                      <Link id="login-notRegistered-link" to="/user/register" className="text-primary font-mont-md font-semibold">{t("landing-page.registerButton")}</Link>
                    </p>
                    {/* <Link id="login-resetPass-link" to="/">{t("landing-page.resetPassword")}</Link> */}
                  </div> 
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
