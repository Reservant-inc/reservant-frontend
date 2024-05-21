import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useTranslation } from "react-i18next";
import { useValidationSchemas } from "../../hooks/useValidationSchema";
import { fetchGET, fetchPOST } from "../../services/APIconn";
import ErrorMes from "../reusableComponents/ErrorMessage"

const initialValues = {
  login: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};

interface RegisterEmpProps{
  setIsModalOpen: Function
}

const RegisterEmp: React.FC<RegisterEmpProps> = ({ setIsModalOpen }) => {
  const [t] = useTranslation("global");
  const { employeeRegisterSchema } = useValidationSchemas();

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      setSubmitting(true);

      const body = JSON.stringify({
        login: values.login, 
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        password: values.password,
      });

      await fetchPOST("/auth/register-restaurant-employee", body);

      setIsModalOpen(false)
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-register">
      <Formik
        initialValues={initialValues}
        validationSchema={employeeRegisterSchema}
        //potencjalnie do rozważenia, więcej o tym niżej
        ////////////////////////////////////////////////
        validateOnChange={false}
        validateOnBlur={true}
        ////////////////////////////////////////////////
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <div className="form-container">
              <div className="form-control">
                <label htmlFor="firstName">{t("auth.firstName")}:</label>
                <Field type="text" id="firstName" name="firstName" className={!(formik.errors.firstName && formik.touched.firstName)?"border-none":"border-solid border-2 border-pink"}/>
                <ErrorMessage name="firstName">
                  { msg => <ErrorMes msg={msg}/> }
                </ErrorMessage>
              </div>

              <div className="form-control">
                <label htmlFor="lastName">{t("auth.lastName")}:</label>
                <Field type="text" id="lastName" name="lastName" className={!(formik.errors.lastName && formik.touched.lastName)?"border-none":"border-solid border-2 border-pink"}/>
                <ErrorMessage name="lastName">
                  { msg => <ErrorMes msg={msg}/> }
                </ErrorMessage>
              </div>

              <div className="form-control">
                <label htmlFor="login">Login:</label>
                {/* 
                
                    @TODO ... ?

                    nie moge nigdzie znalezc satysfakcjonującego rozwiązania pozwalającego na walidację tylko jednego pola w inny sposób (on blur zamiast on change).
                    na razie zmieniam walidacje calego forma na validateOnBlur - mniej żądań będzie przy sprawdzaniu loginu
                    
                    update: 
                      ig trzeba było wziąć angulara 
                      https://stackoverflow.com/questions/68137377/how-to-validate-a-field-onblur-and-other-field-onchange-using-formik

                */}

                <Field type="text" id="login" name="login" className={!(formik.errors.login && formik.touched.login)?"border-none":"border-solid border-2 border-pink"}/>
                <ErrorMessage name="login">
                  { msg => <ErrorMes msg={msg}/> }
                </ErrorMessage>

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
                  className={!(formik.errors.phoneNumber && formik.touched.phoneNumber)?"border-none":"border-solid border-2 border-pink"}
                />
                <ErrorMessage name="phoneNumber">
                  { msg => <ErrorMes msg={msg}/> }
                </ErrorMessage>
              </div>

              <div className="form-control">
                <label htmlFor="password">{t("auth.password")}:</label>
                <Field type="password" id="password" name="password" className={!(formik.errors.password && formik.touched.password)?"border-none":"border-solid border-2 border-pink"}/>
                <ErrorMessage name="password">
                  { msg => <ErrorMes msg={msg}/> }
                </ErrorMessage>
              </div>

              <div className="form-control">
                <label htmlFor="confirmPassword">
                  {t("auth.confirmPassword")}:
                </label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={!(formik.errors.confirmPassword && formik.touched.confirmPassword)?"border-none":"border-solid border-2 border-pink"}
                />
                <ErrorMessage name="confirmPassword">
                  { msg => <ErrorMes msg={msg}/> }
                </ErrorMessage>
              </div>

              <button id="EmployeeRegisterSubmitButton" type="submit" disabled={!formik.isValid}>
                {t("auth.registerButton")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterEmp;
