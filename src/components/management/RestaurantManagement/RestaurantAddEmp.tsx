import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import "react-phone-number-input/style.css";
import { useTranslation } from "react-i18next";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";
import { fetchPOST } from "../../../services/APIconn";
import ErrorMes from "../../reusableComponents/ErrorMessage";

const initialValues = {
  isBackdoorEmployee: "",
  isHallEmployee: "",
};

const RestaurantAddEmp = () => {
  const [t] = useTranslation("global");
  const { RestaurantAddEmployeeSchema } = useValidationSchemas();

  const id = 0; //do zmiany

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      setSubmitting(true);

      const body = JSON.stringify({
        employeeId: id, //do zmiany
        isBackdoorEmployee: values.isBackdoorEmployee,
        isHallEmployee: values.isHallEmployee,
      });

      await fetchPOST(`/my-restaurants/${id}/employees`, body);
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
        {(formik) => {
          return (
            <Form>
              <div className="form-container">
                <div className="form-control flex flex-col">
                  <span className="">
                    <Field
                      type="checkbox"
                      id="isBackdoorEmployee"
                      name="isBackdoorEmployee"
                      className={
                        !(
                          (formik.errors.isHallEmployee &&
                            formik.touched.isHallEmployee) ||
                          (formik.errors.isBackdoorEmployee &&
                            formik.touched.isBackdoorEmployee)
                        )
                          ? "me-1"
                          : "outline-pink me-1 outline"
                      }
                    />
                    <label htmlFor="isBackdoorEmployee">
                      {t("add-employee.isBackdoorEmployee")}
                    </label>
                  </span>
                  <span className="">
                    <Field
                      type="checkbox"
                      id="isHallEmployee"
                      name="isHallEmployee"
                      className={
                        !(
                          (formik.errors.isHallEmployee &&
                            formik.touched.isHallEmployee) ||
                          (formik.errors.isBackdoorEmployee &&
                            formik.touched.isBackdoorEmployee)
                        )
                          ? "me-1"
                          : "outline-pink me-1 outline"
                      }
                    />
                    <label htmlFor="isHallEmployee">
                      {t("add-employee.isHallEmployee")}
                    </label>
                  </span>

                  <ErrorMessage name="isBackdoorEmployee">
                    {(msg) => <ErrorMes msg={msg} />}
                  </ErrorMessage>
                  {!formik.touched.isBackdoorEmployee && (
                    <ErrorMessage name="isHallEmployee">
                      {(msg) => <ErrorMes msg={msg} />}
                    </ErrorMessage>
                  )}
                </div>

                <button
                  id="RestaurantAddEmpSubmitButton"
                  type="submit"
                  disabled={!formik.dirty || !formik.isValid}
                >
                  {t("add-employee.addEmployee")}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default RestaurantAddEmp;
