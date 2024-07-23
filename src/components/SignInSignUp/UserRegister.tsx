import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, FormikValues } from "formik";
import PhoneInput from "react-phone-number-input";
import { useTranslation } from "react-i18next";
import { useValidationSchemas } from "../../hooks/useValidationSchema";
import { fetchPOST } from "../../services/APIconn";
import { TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

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
  const [requestLoading, setRequestLoading] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string>("");

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      setSubmitting(true);
      setRequestLoading(true);

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
      setRegisterError("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
      setRequestLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-[url('/src/assets/images/bg.png')] bg-cover">
      <div className="flex justify-center items-center w-full h-full login-gradient bg-opacity-20">
        <div className="w-[600px] h-[800px] shadow-2xl rounded-lg flex items-center bg-black bg-opacity-60 backdrop-blur-md border-2 border-white">
          <div className="w-full h-full rounded-r-lg flex flex-col justify-center items-center gap-8">
            <Formik
              id="userRegister-formik"
              initialValues={initialValues}
              validationSchema={userRegisterSchema}
              onSubmit={handleSubmit}
              validateOnChange={false}
              validateOnBlur={true}
            >
              {(formik) => (
                <Form className="w-full">
                  <div
                    id="userRegister-form-container"
                    className="form-container h-full flex flex-col items-center gap-4"
                  >
                    <h1 className="text-xl font-mont-md font-semibold text-white">
                      REGISTER
                    </h1>

                    <div className="flex flex-col w-full items-center gap-4">
                      <Field
                        type="text"
                        id="firstName"
                        name="firstName"
                        helperText={
                          formik.errors.firstName &&
                          formik.touched.firstName &&
                          formik.errors.firstName
                        }
                        label="FIRST NAME"
                        variant="standard"
                        className={`w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:label-[20px] ${
                          !(
                            formik.errors.firstName &&
                            formik.touched.firstName
                          )
                            ? "[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary"
                            : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"
                        }`}
                        color="primary"
                        as={TextField}
                      />

                      <Field
                        type="text"
                        id="lastName"
                        name="lastName"
                        helperText={
                          formik.errors.lastName &&
                          formik.touched.lastName &&
                          formik.errors.lastName
                        }
                        label="LAST NAME"
                        variant="standard"
                        className={`w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:label-[20px] ${
                          !(
                            formik.errors.lastName &&
                            formik.touched.lastName
                          )
                            ? "[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary"
                            : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"
                        }`}
                        color="primary"
                        as={TextField}
                      />

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
                        className={`w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:label-[20px] ${
                          !(formik.errors.login && formik.touched.login)
                            ? "[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary"
                            : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"
                        }`}
                        color="primary"
                        as={TextField}
                      />

                      <Field
                        type="email"
                        id="email"
                        name="email"
                        helperText={
                          formik.errors.email &&
                          formik.touched.email &&
                          formik.errors.email
                        }
                        label="EMAIL"
                        variant="standard"
                        className={`w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:label-[20px] ${
                          !(formik.errors.email && formik.touched.email)
                            ? "[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary"
                            : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"
                        }`}
                        color="primary"
                        as={TextField}
                      />

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
                        placeholder={
                          formik.errors.phoneNumber &&
                          formik.touched.phoneNumber
                            ? formik.errors.phoneNumber
                            : "Phone number"
                        }
                        className={`w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:label-[20px] ${
                          !(
                            formik.errors.phoneNumber &&
                            formik.touched.phoneNumber
                          )
                            ? "[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary"
                            : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"
                        }`}
                      />

                      <Field
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        helperText={
                          formik.errors.birthDate &&
                          formik.touched.birthDate &&
                          formik.errors.birthDate
                        }
                        label="BIRTH DATE"
                        variant="standard"
                        className={`w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:label-[20px] ${
                          !(
                            formik.errors.birthDate &&
                            formik.touched.birthDate
                          )
                            ? "[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary"
                            : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"
                        }`}
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
                        className={`w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:label-[20px] ${
                          !(formik.errors.password && formik.touched.password)
                            ? "[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary"
                            : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"
                        }`}
                        color="primary"
                        as={TextField}
                      />

                      <Field
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        helperText={
                          formik.errors.confirmPassword &&
                          formik.touched.confirmPassword &&
                          formik.errors.confirmPassword
                        }
                        label="CONFIRM PASSWORD"
                        variant="standard"
                        className={`w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:label-[20px] ${
                          !(
                            formik.errors.confirmPassword &&
                            formik.touched.confirmPassword
                          )
                            ? "[&>*]:text-white [&>*]:before:border-white [&>*]:after:border-secondary"
                            : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"
                        }`}
                        color="primary"
                        as={TextField}
                      />
                    </div>

                    <button
                      id="UserRegisterSubmitButton"
                      type="submit"
                      disabled={!formik.isValid}
                      className={`pointer w-4/5 h-[50px] rounded-lg shadow-md flex items-center justify-center ${
                        formik.isValid
                          ? "bg-primary text-white"
                          : "bg-grey-1"
                      }`}
                    >
                      {requestLoading ? (
                        <CircularProgress className="text-grey-0 h-8 w-8" />
                      ) : (
                        "REGISTER"
                      )}
                    </button>

                    {registerError.length > 0 && (
                      <h1 className="text-error font-mont-md text-lg">
                        {registerError}
                      </h1>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
