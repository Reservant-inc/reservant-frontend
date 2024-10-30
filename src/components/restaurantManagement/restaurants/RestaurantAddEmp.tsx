import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import "react-phone-number-input/style.css";
import { useTranslation } from "react-i18next";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";
import { fetchGET, fetchPOST } from "../../../services/APIconn";
import ErrorMes from "../../reusableComponents/ErrorMessage";
import { EmploymentType } from "../../../services/types";
import { RestaurantShortType } from "../../../services/types";
import { Add } from "@mui/icons-material";

const initialValues = {
  selectedRestaurant: "",
  isBackdoorEmployee: "",
  isHallEmployee: "",
};


const RestaurantAddEmp = ({ empid }: { empid: string }) => {
  const [t] = useTranslation("global");
  const { RestaurantAddEmployeeSchema } = useValidationSchemas();
  const [restaurants, setRestaurants] = useState<RestaurantShortType[]>([]);

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const response = await fetchGET("/user/employees");
        const tmp: EmploymentType[] = [];

        if (response.length)
          for (const i in response) {
            if (response[i].userId === empid)
              for (const j in response[i].employments) {
                tmp.push({
                  id: response[i].employments[j].employmentId,
                  restaurantName: response[i].employments[j].restaurantName,
                  restaurantId: response[i].employments[j].restaurantId,
                  isBackdoorEmployee:
                    response[i].employments[j].isBackdoorEmployee,
                  isHallEmployee: response[i].employments[j].isHallEmployee,
                });
              }
          }

        const response1 = await fetchGET("/my-restaurants");
        let tmp1: RestaurantShortType[] = [];
  

        for (const restaurant of response1) {
          tmp1.push({
              restaurantId: restaurant.restaurantId,
              name: restaurant.name
            });
        }

        tmp1 = tmp1.filter((e) => {
          for (const i in tmp) {
            console.log(e.restaurantId === tmp[i].restaurantId);
            if (e.restaurantId === tmp[i].restaurantId) return false;
          }
          return true;
        });
        console.log(tmp1);
        setRestaurants(tmp1);
      } catch (error) {
        console.error("Error fetching restaurants", error);
      }
    };
    getRestaurants();
  }, []);

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      setSubmitting(true);
      const body = JSON.stringify([
        {
          employeeId: empid,
          isHallEmployee:
            values.isHallEmployee === "" ? false : values.isHallEmployee,
          isBackdoorEmployee:
            values.isBackdoorEmployee === ""
              ? false
              : values.isBackdoorEmployee,
        },
      ]);

      console.log(body);
      console.log(`/my-restaurants/${values.selectedRestaurant}/employees`);
      await fetchPOST(
        `/my-restaurants/${values.selectedRestaurant}/employees`,
        body,
      );
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="restaurantAddEmp-container-register"
      className="dark:text-grey-0 p-3"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={RestaurantAddEmployeeSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => {
          return (
            <Form>
              <div className="w-full flex flex-col items-start gap-3 justify-center">
                <div className="form-control flex gap-6 w-full justify-start">
                  <Field id="selectedRestaurant" default="Select a restaurant" className="dark:bg-black dark:text-grey-0 rounded-lg" name="selectedRestaurant" component="select">
                    <option  value="" disabled={true} selected={true} id="addEmp-option-default">Restaurant</option>
                    {
                      restaurants.map((restaurant) => <option value={restaurant.restaurantId}> {restaurant.name} </option>)
                    }
                    
                  </Field>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2">
                      <Field
                        type="checkbox"
                        id="isBackdoorEmployee"
                        name="isBackdoorEmployee"
                        checked={formik.values.isBackdoorEmployee}
                        className={`border-[1px] hover:cursor-pointer ${((formik.errors.isHallEmployee||formik.errors.isBackdoorEmployee)&&(formik.touched.isHallEmployee||formik.touched.isBackdoorEmployee))?"border-error":"border-black dark:border-grey-0"}`}
                      />
                      <label htmlFor="isBackdoorEmployee"
                        className={`${((formik.errors.isHallEmployee||formik.errors.isBackdoorEmployee)&&(formik.touched.isHallEmployee||formik.touched.isBackdoorEmployee))?"text-error":"dark:text-grey-0 text-black"}`}
                      >
                        {t("add-employee.isBackdoorEmployee")}
                      </label>
                    </span>
                    <span className="flex items-center gap-2">
                      <Field
                        type="checkbox"
                        id="isHallEmployee"
                        name="isHallEmployee"
                        checked={formik.values.isHallEmployee}
                        className={`border-[1px] hover:cursor-pointer ${((formik.errors.isHallEmployee||formik.errors.isBackdoorEmployee)&&(formik.touched.isHallEmployee||formik.touched.isBackdoorEmployee))?"border-error":"border-black dark:border-grey-0"}`}
                      />
                      <label htmlFor="isHallEmployee"
                        className={`${((formik.errors.isHallEmployee||formik.errors.isBackdoorEmployee)&&(formik.touched.isHallEmployee||formik.touched.isBackdoorEmployee))?"text-error":"dark:text-grey-0 text-black"}`}
                      >
                        {t("add-employee.isHallEmployee")}
                      </label>
                    </span>
                  </div>
                </div>
                <button
                  id="RestaurantAddEmpSubmitButton"
                  type="submit"
                  disabled={!formik.dirty || !formik.isValid}
                  className=" gap-1 flex items-center justify-center px-3 py-1 border-[1px] border-primary dark:border-secondary rounded-md text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:hover:bg-primary enabled:hover:text-white enabled:dark:hover:text-black"
                  >
                  <Add/>
                  <h1 className="font-mont-md text-md">{t("add-employee.addEmployee")}</h1>
                </button>
                <div className="">
                  <ErrorMessage name="isBackdoorEmployee">
                    {(msg) => <ErrorMes msg={msg} />}
                  </ErrorMessage>
                  {!formik.touched.isBackdoorEmployee && (
                    <ErrorMessage name="isHallEmployee">
                      {(msg) => <ErrorMes msg={msg} />}
                    </ErrorMessage>
                  )}
                </div>
              </div>

            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default RestaurantAddEmp;
