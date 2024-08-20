import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import "react-phone-number-input/style.css";
import { useTranslation } from "react-i18next";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";
import { fetchGET, fetchPOST } from "../../../services/APIconn";
import ErrorMes from "../../reusableComponents/ErrorMessage";
import { RestaurantDataProps } from "../../../services/interfaces/restaurant";
import { EmploymentType } from "../../../services/types";

const initialValues = {
  selectedRestaurant: "",
  isBackdoorEmployee: "",
  isHallEmployee: "",
};

type restaurant = {
  name: string,
  restaurantID: string
}

const RestaurantAddEmp = ({empid}:{empid: string}) => {
  const [t] = useTranslation("global");
  const { RestaurantAddEmployeeSchema } = useValidationSchemas();
  const [restaurants, setRestaurants] = useState<restaurant[]>([]);

  useEffect(()=>{
    const getRestaurants = async () => {
      try {
  
          const response = await fetchGET("/user/employees");
          const tmp: EmploymentType[] = [];
          
          if (response.length)
            for (const i in response) {
              if(response[i].userId===empid)
              for (const j in response[i].employments){
                tmp.push({
                  id: response[i].employments[j].employmentId,
                  restaurantName: response[i].employments[j].restaurantName,
                  restaurantId: response[i].employments[j].restaurantId,
                  isBackdoorEmployee: response[i].employments[j].isBackdoorEmployee,
                  isHallEmployee: response[i].employments[j].isHallEmployee,
                })
              }
            }

        const response1 = await fetchGET("/my-restaurants");
        let tmp1: restaurant[] = [];
  

        for (const restaurant of response1) {
          tmp1.push({
              restaurantID: restaurant.restaurantId,
              name: restaurant.name
            });
      }

      tmp1 = tmp1.filter((e)=>{
        for(const i in tmp){
          console.log(e.restaurantID === tmp[i].restaurantId)
          if(e.restaurantID===tmp[i].restaurantId)
            return false;
        }
          return true;
      });
      console.log(tmp1)
      setRestaurants(tmp1)
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
      // console.log(id)
      const body = JSON.stringify([{
        employeeId: empid,
        isHallEmployee: values.isHallEmployee===""?false:values.isHallEmployee,
        isBackdoorEmployee: values.isBackdoorEmployee===""?false:values.isBackdoorEmployee,
      }]);

      console.log(body)
      // console.log("AAAAAAAA"+values.selectedRestaurant)
      console.log(`/my-restaurants/${values.selectedRestaurant}/employees`)
      await fetchPOST(`/my-restaurants/${values.selectedRestaurant}/employees`, body);


    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

 

  return (
    <div id="restaurantAddEmp-container-register" className="container-register">
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
                  <Field id="selectedRestaurant" default="Select a restaurant" name="selectedRestaurant" component="select">
                    <option value="" id="addEmp-option-default">Select a restaurant</option>
                    {
                      restaurants.map((restaurant) => <option value={restaurant.restaurantID}> {restaurant.name} </option>)
                    }
                    
                  </Field>
                  <span className="">
                    <Field
                      type="checkbox"
                      id="isBackdoorEmployee"
                      name="isBackdoorEmployee"
                      checked={formik.values.isBackdoorEmployee}
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
                      checked={formik.values.isHallEmployee}
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
