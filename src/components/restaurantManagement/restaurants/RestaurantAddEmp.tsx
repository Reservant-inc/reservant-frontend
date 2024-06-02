import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import "react-phone-number-input/style.css";
import { useTranslation } from "react-i18next";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";
import { fetchGET, fetchPOST } from "../../../services/APIconn";
import ErrorMes from "../../reusableComponents/ErrorMessage";
import { RestaurantDataProps } from "../../../services/interfaces";

const initialValues = {
  isBackdoorEmployee: "",
  isHallEmployee: "",
};

type restaurant = {
  name: string,
  id: string
}

const RestaurantAddEmp = ({setIsModalOpen, id}:{setIsModalOpen: Function, id: string}) => {
  const [t] = useTranslation("global");
  const { RestaurantAddEmployeeSchema } = useValidationSchemas();
  const [restaurants, setRestaurants] = useState<restaurant[]>([]);

  useEffect(()=>{
    const getRestaurants = async () => {
      try {
  
        const response = await fetchGET("/my-restaurants");
        const tmp: restaurant[] = [];
  
        for (const restaurant of response) {
          tmp.push({
              id: restaurant.restaurantID,
              name: restaurant.name
            });
      }
      console.log(tmp)
      setRestaurants(tmp)
      } catch (error) {
        console.error("Error fetching restaurants", error);
      }
    }
    getRestaurants();
  },[])


  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      setSubmitting(true);

      const body = JSON.stringify({
        employeeId: id,
        isBackdoorEmployee: values.isBackdoorEmployee,
        isHallEmployee: values.isHallEmployee,
      });

      await fetchPOST(`/my-restaurants/${id}/employees`, body);

      setIsModalOpen(false);

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
                  <Field component="select">
                   
                    <option> restaurants </option>
                    
                  </Field>
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
