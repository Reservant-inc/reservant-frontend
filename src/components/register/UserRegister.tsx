import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useTranslation } from "react-i18next";
import { useValidationSchemas } from "../../hooks/useValidationSchema";
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
    <div  id="userRegister-container-register" className="h-full w-full bg-gradient-to-br from-[#a94c79] via-[#b05a83] via-[#b86b90] via-[#c585a4] to-[#cc93ae] flex flex-col justify-center items-center">
      <div className="w-[600px] h-[800px] bg-white rounded-2xl p-4 flex flex-col shadow-2xl">
        <div className="w-full h-1/4 flex items-center justify-center">
          {/* <img src={LogoLight} alt="logo" className="h-12"/> */}
          <h1 className="font-mont-md text-[30px] ">REGISTER</h1>
        </div>
        <div className="w-full h-4/5 flex justify-center items-center">
          <Formik
            id="iserRegister-formik"
            initialValues={initialValues}
            validationSchema={userRegisterSchema}
            onSubmit={handleSubmit}
            validateOnChange={false}
            validateOnBlur={true}
          >
            {(formik) => (
              <Form className="w-full h-full">
                <div id="userRegister-form-container" className="form-container">
                  <div className="flex flex-col w-full items-center gap-4">
                    <Field
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder={
                        formik.errors.firstName && formik.touched.firstName ? formik.errors.firstName : 'First Name'
                      }
                      className={`w-4/5 h-[50px] ring-0 rounded-md ${!(formik.errors.firstName && formik.touched.firstName) ? "focus:border-black" : "border-pink border-1 border-solid placeholder-pink"}`}
                    />

                    <Field
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder={
                        formik.errors.lastName && formik.touched.lastName ? formik.errors.lastName : 'Last name'
                      }
                      className={`w-4/5 h-[50px] ring-0 rounded-md ${!(formik.errors.lastName && formik.touched.lastName) ? "focus:border-black" : "border-pink border-1 border-solid placeholder-pink"}`}
                    />

                    <Field
                      type="text"
                      id="login"
                      name="login"
                      placeholder={
                        formik.errors.login && formik.touched.login ? formik.errors.login : 'Login'
                      }
                      className={`w-4/5 h-[50px] ring-0 rounded-md ${!(formik.errors.login && formik.touched.login) ? "focus:border-black" : "border-pink border-1 border-solid placeholder-pink"}`}
                    />

                    <Field
                      type="email"
                      id="email"
                      name="email"
                      placeholder={
                        formik.errors.email && formik.touched.email ? formik.errors.email : 'Email'
                      }
                      className={`w-4/5 h-[50px] ring-0 rounded-md ${!(formik.errors.email && formik.touched.email) ? "focus:border-black" : "border-pink border-1 border-solid placeholder-pink"}`}
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
                        formik.errors.phoneNumber && formik.touched.phoneNumber ? formik.errors.phoneNumber : 'Phone number'
                      }
                      className={`w-4/5 h-[50px] ring-0 rounded-md ${!(formik.errors.phoneNumber && formik.touched.phoneNumber) ? "focus:border-black" : "border-pink border-1 border-solid placeholder-pink"}`}
                    />

                    <Field
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      placeholder={
                        formik.errors.birthDate && formik.touched.birthDate ? formik.errors.birthDate : 'Birth date'
                      }
                      className={`w-4/5 h-[50px] ring-0 rounded-md ${!(formik.errors.birthDate && formik.touched.birthDate) ? "focus:border-black" : "border-pink border-1 border-solid placeholder-pink"}`}
                    />

                    <Field
                      type="password"
                      id="password"
                      name="password"
                      placeholder={
                        formik.errors.password && formik.touched.password ? formik.errors.password : 'Password'
                      }
                      className={`w-4/5 h-[50px] ring-0 rounded-md ${!(formik.errors.password && formik.touched.password) ? "focus:border-black" : "border-pink border-1 border-solid placeholder-pink"}`}
                    />

                    <Field
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder={
                        formik.errors.confirmPassword && formik.touched.confirmPassword ? formik.errors.confirmPassword : 'Confir password'
                      }
                      className={`w-4/5 h-[50px] ring-0 rounded-md ${!(formik.errors.confirmPassword && formik.touched.confirmPassword) ? "focus:border-black" : "border-pink border-1 border-solid placeholder-pink"}`}
                    />

                    <button
                      id="UserRegisterSubmitButton"
                      type="submit"
                      disabled={!formik.isValid}
                      className={`pointer w-32 h-10 rounded-lg shadow-md ${formik.isValid ? "bg-primary text-white" : "bg-grey-1"}`}
                    >
                      {t("auth.registerButton")}
                    </button>
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

export default UserRegister;
