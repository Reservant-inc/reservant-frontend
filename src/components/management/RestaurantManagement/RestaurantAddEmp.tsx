import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikValues, FieldArray } from "formik";
import "react-phone-number-input/style.css";
import { useTranslation } from "react-i18next";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";
import { fetchPOST } from "../../../services/APIconn";
import ErrorMes from "../../reusableComponents/ErrorMessage"

const initialValues = {
  employeeId: "",
  isBackdoorEmployee: "",
  isHallEmployee: ""
};

const RestaurantAddEmp = () => {
  
  const [t] = useTranslation("global")
  const { RestaurantAddEmployeeSchema } = useValidationSchemas()
  
  const id = 0;//do zmiany

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting } : { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      setSubmitting(true);

      const body = JSON.stringify({
        employeeId: values.employeeId,
        isBackdoorEmployee: values.isBackdoorEmployee,
        isHallEmployee: values.isHallEmployee,
      })

      await fetchPOST(`/my-restaurants/${id}/employees`, body)

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
        validationSchema={RestaurantAddEmployeeSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <div className="form-container">
              <div className="form-control">
                <div className="employeeRole">
                
{/* todo przerobić na fieldArray */}
                    <Field
                      type="checkbox"
                      id="isBackdoorEmployee"
                      name="isBackdoorEmployee"
                    />
                  <label htmlFor="isBackdoorEmployee">{t("add-employee.isBackdoorEmployee")}</label>
                    <Field
                      type="checkbox"
                      id="isHallEmployee"
                      name="isHallEmployee"
                    />
                  <label htmlFor="isHallEmployee">{t("add-employee.isHallEmployee")}</label>
              

                  <ErrorMessage name="isHallEmployee">
                    { msg => <ErrorMes msg={msg}/> }
                  </ErrorMessage>
                </div>
              </div>

              <button type="submit" disabled={!formik.isValid}>
                {t("add-employee.addEmployee")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default RestaurantAddEmp