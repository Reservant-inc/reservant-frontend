import React from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import { AuthData } from "./routing/AuthWrapper";
import { fetchPOST } from "../services/APIconn";
import { useValidationSchemas } from "../hooks/useValidationSchema";
import Error from "./reusableComponents/ErrorMessage";
import LogoLight from "../assets/images/LOGO-CLEAN-DARK.png"

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
    <div id="loginWrapper" className="h-full w-full bg-gradient-to-br from-[#a94c79] via-[#b05a83] via-[#b86b90] via-[#c585a4] to-[#cc93ae] flex flex-col justify-center items-center">
      <div className="w-[600px] h-[600px] bg-white rounded-2xl p-4 flex flex-col shadow-2xl">
        <div className="w-full h-1/4 flex items-center justify-center">
          {/* <img src={LogoLight} alt="logo" className="h-12"/> */}
          <h1 className="font-mont-md text-[30px] ">LOGIN</h1>
        </div>
        <div className="w-full h-3/5 flex justify-center items-center">
          <Formik
            id="login-formik"
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={onSubmit}
          >
            {(formik) => (
              <Form className="w-full h-full">
                <div id="login-form-containter" className="form-container h-full flex flex-col justify-around items-center">
                  <div className="flex flex-col w-full items-center gap-4">
                    <Field
                      type="text"
                      id="login"
                      name="login"
                      placeholder={
                        formik.errors.login && formik.touched.login ? formik.errors.login : 'login'
                      }
                      className={`w-4/5 h-[60px] ring-0 rounded-md ${!(formik.errors.login && formik.touched.login) ? "focus:border-black" : "border-pink border-1 border-solid placeholder-pink"}`}

                    />

                    <Field
                      type="password"
                      id="password"
                      name="password"
                      placeholder={
                        formik.errors.password && formik.touched.password ? formik.errors.password : 'password'
                      }
                      className={`w-4/5 h-[60px] ring-0 rounded-md ${!(formik.errors.password && formik.touched.password) ? "focus:border-black" : "border-pink border-1 border-solid placeholder-pink"}`}
                    />
                  </div>

                  <button
                    id="LoginLoginButton"
                    type="submit"
                    disabled={!formik.isValid}
                    className={`pointer w-32 h-10 rounded-lg shadow-md ${formik.isValid ? "bg-primary text-white" : "bg-grey-1"}`}
                  >
                    Login
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div id="login-container-links" className="h-1/5 w-full flex items-center justify-center">
          <p id="login-notRegistered-link-wrap">
            {t("landing-page.notRegistered")}{" "}
            <Link id="login-notRegistered-link" to="/user/register" className="text-primary font-mont-md">{t("landing-page.registerButton")}</Link>
          </p>
          {/* <Link id="login-resetPass-link" to="/">{t("landing-page.resetPassword")}</Link> */}
        </div> 
      </div>
    </div>
  );
};

export default Login;
