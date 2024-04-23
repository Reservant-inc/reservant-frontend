import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useTranslation } from "react-i18next";
import { useValidationSchemas } from "../../hooks/useValidationSchema";
import { fetchPOST, fetchGET} from "../../services/APIconn";

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

    if(await fetchGET("/auth/is-unique-login?login="+values.login))
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
        })

        await fetchPOST('/auth/register-customer', body)

        navigate("/user/login");
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
    else{
      console.log("login taken")
    }

  };

  return (
    <div className="container-register">
      <Formik
        initialValues={initialValues}
        validationSchema={userRegisterSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <div className="form-container">
              <div className="form-control">
                <label htmlFor="firstName">{t("auth.firstName")}:</label>
                <Field type="text" id="firstName" name="firstName" />
                <ErrorMessage name="firstName" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="lastName">{t("auth.lastName")}:</label>
                <Field type="text" id="lastName" name="lastName" />
                <ErrorMessage name="lastName" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="login">Login:</label>
                <Field type="text" id="login" name="login" />
                <ErrorMessage name="login" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="email">E-mail:</label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage name="email" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="phoneNumber">{t("auth.phoneNumber")}:</label>
                <Field
                  as={PhoneInput}
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
                <label htmlFor="birthDate">{t("auth.birthDate")}:</label>
                <Field type="date" id="birthDate" name="birthDate" />
                <ErrorMessage name="birthDate" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="password">{t("auth.password")}:</label>
                <Field type="password" id="password" name="password" />
                <ErrorMessage name="password" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="confirmPassword">
                  {t("auth.confirmPassword")}:
                </label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                />
                <ErrorMessage name="confirmPassword" component="div" />
              </div>

              <button type="submit" disabled={!formik.isValid}>
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
