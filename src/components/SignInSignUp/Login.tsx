import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import { AuthData } from "../routing/AuthWrapper";
import { fetchPOST } from "../../services/APIconn";
import { useValidationSchemas } from "../../hooks/useValidationSchema";
import LogoLight from "../../assets/images/LOGO-CLEAN-LIGHT.png"
import CircularProgress from '@mui/material/CircularProgress';
import { FetchError } from '../../services/Errors';
import { TextField } from "@mui/material";

const initialValues = {
  login: "",
  password: "",
};

const Login: React.FC = () => {
  const [t] = useTranslation("global");
  const { login } = AuthData();
  const { loginSchema } = useValidationSchemas();
  const [ loginError, setLoginError ] = useState<string>("")
  const [ requestLoading, setRequestLoading ] = useState<boolean>(false)

  const onSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      setSubmitting(true);
      setRequestLoading(true)

      const response = await fetchPOST("/auth/login", JSON.stringify(values));

      login(response);
    } catch (error) {
      if (error instanceof FetchError) {
        setLoginError(error.message)
      } else {
        console.log("Unexpected error:", error);
      }
    } finally {
      setSubmitting(false)
      setRequestLoading(false)
    }
  };
  // bg-[url('/src/assets/images/bg.png')]
  return (
    <div className="w-full h-full bg-[url('/src/assets/images/bg.png')] bg-cover">
      <div className="flex justify-center items-center w-full h-full login-gradient bg-opacity-20">
        <div className="w-[900px] h-[500px] shadow-2xl rounded-lg flex items-center bg-black bg-opacity-60 backdrop-blur-md border-2 border-white">
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
                    <div className="flex flex-col w-full items-center gap-6">
                      
                      <h1 className="text-xl font-mont-md dont-semibold text-white">WELCOME</h1>

                      <Field
                        type="text"
                        id="login"
                        name="login"
                        helperText={(formik.errors.login && formik.touched.login) && formik.errors.login} 
                        label="LOGIN" 
                        variant="standard" 
                        className={`w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:label-[20px] ${!(formik.errors.login && formik.touched.login) ? "[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error" }`} 
                        color="primary"
                        as={TextField}
                      />

                      <Field
                        type="password"
                        id="password"
                        name="password"
                        helperText={(formik.errors.password && formik.touched.password) && formik.errors.password} 
                        label="PASSWORD" 
                        variant="standard" 
                        className={`w-4/5 [&>*]:font-mont-md [&>*]:text-md ${!(formik.errors.password && formik.touched.password) ? "[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error" }`} 
                        color="primary"
                        as={TextField}
                      />
                    </div>

                    <button
                      id="LoginLoginButton"
                      type="submit"
                      disabled={!formik.isValid}
                      className={`pointer w-4/5 h-[50px] rounded-lg shadow-md flex items-center justify-center ${formik.isValid ? "bg-primary text-white" : "bg-grey-1"}`}
                    >
                      {
                        requestLoading ? <CircularProgress className="text-grey-0 h-8 w-8"/> : "LOGIN"
                      }
                    </button>

                    {
                      loginError.length > 0 && <h1 className="text-error font-mont-md text-lg">{loginError}</h1>
                    } 

                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className="w-1/3 h-full flex flex-col justify-center items-center bg-white gap-10">
            <img src={LogoLight} className="h-40"/>
            <h1 className="text-black text-xl font-mont-md ">{t("landing-page.notRegistered")}</h1>
            <Link id="login-notRegistered-link" to="/user/register" className="text-white rounded-lg flex items-center justify-center font-mont-md bg-primary w-48 h-12 p-3">{t("landing-page.registerButton")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
