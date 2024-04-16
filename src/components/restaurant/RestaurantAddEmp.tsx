import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import * as yup from "yup";
import "react-phone-number-input/style.css";
import { useTranslation } from "react-i18next";

const initialValues = {
  employeeId: "",
  isBackdoorEmployee: "",
  isHallEmployee: ""
};

const RestaurantAddEmp = () => {
  
  const [t] = useTranslation("global")
  
  const validationSchema = yup.object({

    isBackdoorEmployee: yup
      .boolean(),

    isHallEmployee: yup
      .boolean()
    
  }).test(
    t("errors.add-employee.employeeRole.required"),
    { context: { message: t("errors.employee-register.employeeRole.required") } }, 
    (obj) => {
      if (obj.isBackdoorEmployee || obj.isHallEmployee) {
        return true;
      }
  
      return new yup.ValidationError(
        t("errors.add-employee.employeeRole.required"),
        null,
        'isHallEmployee'
      );
    }
  );
  
  const id = 0;//do zmiany

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      setSubmitting(true);
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_IP}/my-restaurants/${id}/employees`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId: values.employeeId,
            isBackdoorEmployee: values.isBackdoorEmployee,
            isHallEmployee: values.isHallEmployee,
          }),
        },
      );

      if (!response.ok) {
        console.log(await response.json())
        throw new Error("Invalid register data");
      }

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
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <div className="form-container">
              <div className="form-control">
                <div className="employeeRole">

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

                </div>
                <ErrorMessage name="isHallEmployee" component="div" />
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