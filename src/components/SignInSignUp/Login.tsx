import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import { AuthData } from "../routing/AuthWrapper";
import { fetchPOST } from "../../services/APIconn";
import { useValidationSchemas } from "../../hooks/useValidationSchema";
import LogoPrimary from "../../assets/images/LOGO-PRIMARY.png";
import CircularProgress from "@mui/material/CircularProgress";
import { FetchError } from "../../services/Errors";
import { TextField } from "@mui/material";

const initialValues = {
  login: "",
  password: "",
};

const Login: React.FC = () => {
  const [t] = useTranslation("global");
  const { login } = AuthData();
  const { loginSchema } = useValidationSchemas();
  const [loginError, setLoginError] = useState<string>("");
  const [requestLoading, setRequestLoading] = useState<boolean>(false);

  const onSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      setSubmitting(true);
      setRequestLoading(true);

      const response = await fetchPOST("/auth/login", JSON.stringify(values));

      login(response);
    } catch (error) {
      if (error instanceof FetchError) {
        setLoginError(error.message);
      } else {
        console.log("Unexpected error:", error);
      }
    } finally {
      setSubmitting(false);
      setRequestLoading(false);
    }
  };
  // bg-[url('/src/assets/images/bg.png')]
  return (
    <div className="h-full w-full bg-[url('/src/assets/images/bg.png')] bg-cover">
      <div className="login-gradient flex h-full w-full items-center justify-center bg-opacity-20">
        <div className="flex h-[500px] w-[900px] items-center rounded-lg border-2 border-white bg-black bg-opacity-60 shadow-2xl backdrop-blur-md">
          <div className="flex h-full w-2/3 flex-col items-center justify-center gap-12 rounded-r-lg">
            <Formik
              id="login-formik"
              initialValues={initialValues}
              validationSchema={loginSchema}
              onSubmit={onSubmit}
            >
              {(formik) => (
                <Form className="w-full">
                  <div
                    id="login-form-containter"
                    className="form-container flex h-full flex-col items-center gap-8"
                  >
                    <div className="flex w-full flex-col items-center gap-6">
                      <h1 className="dont-semibold font-mont-md text-xl text-white">
                        WELCOME
                      </h1>

                      <Field
                        type="text"
                        id="login"
                        name="login"
                        helperText={
                          formik.errors.login &&
                          formik.touched.login &&
                          formik.errors.login
                        }
                        label="LOGIN"
                        variant="standard"
                        className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${!(formik.errors.login && formik.touched.login) ? "[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"}`}
                        color="primary"
                        as={TextField}
                      />

                      <Field
                        type="password"
                        id="password"
                        name="password"
                        helperText={
                          formik.errors.password &&
                          formik.touched.password &&
                          formik.errors.password
                        }
                        label="PASSWORD"
                        variant="standard"
                        className={`[&>*]:text-md w-4/5 [&>*]:font-mont-md ${!(formik.errors.password && formik.touched.password) ? "[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"}`}
                        color="primary"
                        as={TextField}
                      />
                    </div>

                    <button
                      id="LoginLoginButton"
                      type="submit"
                      disabled={!formik.isValid}
                      className={`flex h-[50px] w-4/5 cursor-pointer items-center justify-center rounded-lg shadow-md ${formik.isValid ? "bg-primary text-white" : "bg-grey-1"}`}
                    >
                      {requestLoading ? (
                        <CircularProgress className="h-8 w-8 text-grey-0" />
                      ) : (
                        "LOGIN"
                      )}
                    </button>

                    {loginError.length > 0 && (
                      <h1 className="font-mont-md text-lg text-error">
                        {loginError}
                      </h1>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className="flex h-full w-1/3 flex-col items-center justify-center gap-10 bg-white">
            <img src={LogoPrimary} className="h-40" />
            <h1 className="font-mont-md text-xl text-black ">
              {t("landing-page.notRegistered")}
            </h1>
            <Link
              id="login-notRegistered-link"
              to="/user/register"
              className="flex h-12 w-48 items-center justify-center rounded-lg bg-primary p-3 font-mont-md text-white"
            >
              {t("landing-page.registerButton")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
