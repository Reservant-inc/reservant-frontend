import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import "dotenv/config";
import * as yup from "yup";

const initialValues = {
  name: "",
  address: "",
  postalCode: "",
  city: "",
  nip: "",
  businessType: "",
  //TODO - logo, files
};

// Set yup validation schema to validate defined fields and error messages
const validationSchema = yup.object({
  name: yup.string().required("name is required"),
  address: yup.string().required("address is required"),
  postalCode: yup
    .string()
    .matches(/^[0-9]{2}-[0-9]{3}$/, "postal codes must have XX-XXXX format"),
  city: yup.string().required("city is required"),
  nip: yup.string().matches(/^[0-9]{11}$/, "wrong NIP number"),
  businessType: yup.string().required("you must choose business type"),
});

const RestaurantRegister = () => {
  const navigate = useNavigate();

  //template of a function responsible for sending data of user being registered
  const onSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      // Set submitting state to true to indicate form submission is in progress
      setSubmitting(true);
      console.log(values);
      // Send data to server
      const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/??`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Invalid login data");
      }

      // TBD - is there data and what to do with it

      //TODO - Kuba: Navigation to *some* path
      //navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      // Set submitting state to false when form submission completes (whether it succeeded or failed)
      setSubmitting(false);
    }
  };

  return (
    <div className="container-login">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
            <div className="form-container">
              <div className="form-control">
                <label htmlFor="name">Name:</label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage name="name" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="address">Address:</label>
                <Field type="text" id="address" name="address" />
                <ErrorMessage name="address" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="postalCode">Postal code:</label>
                <Field type="text" id="postalCode" name="postalCode" />
                <ErrorMessage name="postalCode" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="city">city:</label>
                <Field type="text" id="city" name="city" />
                <ErrorMessage name="city" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="nip">Nip:</label>
                <Field type="text" id="nip" name="nip" />
                <ErrorMessage name="nip" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="businessType">Business type:</label>
                <Field as="select" id="businessType" name="businessType">
                  <option value="restaurant">Restaurant</option>
                  <option value="bar">Bar</option>
                </Field>
                <ErrorMessage name="businessType" component="div" />
              </div>

              <button type="submit" disabled={!formik.isValid}>
                Register restaurant
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RestaurantRegister;
