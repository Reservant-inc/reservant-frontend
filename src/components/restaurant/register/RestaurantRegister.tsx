import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import "dotenv/config";
import * as yup from "yup";
import { useTranslation } from "react-i18next";

const initialValues = {
  name: "",
  address: "",
  postalCode: "",
  city: "",
  tin: "", //Taxpayer Identification Number
  businessType: "",
  id: "",
  alcoholLicense: "",
  leaseAgreement: "",
  businessLicense: ""
  //TODO - logo, files
};


const RestaurantRegister = () => {

  const navigate = useNavigate();
  
  const [t, i18n] = useTranslation("global");

  // Set yup validation schema to validate defined fields and error messages
const validationSchema = yup.object({
  name: yup.string().required(t("errors.restaurant-register.name.required")),
  address: yup.string().required(t("errors.restaurant-register.address.required")),
  postalCode: yup
    .string()
    .matches(/^[0-9]{2}-[0-9]{3}$/, t("errors.restaurant-register.postalCode.matches"))
    .required(t("errors.restaurant-register.postalCode.required")),
  city: yup.string().required(t("errors.restaurant-register.city.required")),
  tin: yup.string().matches(/^[0-9]{11}$/, t("errors.restaurant-register.tin.matches"))
  .required(t("errors.restaurant-register.tin.required")),
  businessType: yup.string().required(t("errors.restaurant-register.businessType.required")),
  id: yup.string().required(t("errors.restaurant-register.id.required"))
  /*
  walidacja alcoholLicense leaseAgreement businessLicense nie wiem czy potrzebna
  */
}); 

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
                <label htmlFor="name">{t("restaurant-register.name")}:</label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage name="name" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="address">{t("restaurant-register.address")}:</label>
                <Field type="text" id="address" name="address" />
                <ErrorMessage name="address" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="postalCode">{t("restaurant-register.postalCode")}:</label>
                <Field type="text" id="postalCode" name="postalCode" />
                <ErrorMessage name="postalCode" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="city">{t("restaurant-register.city")}:</label>
                <Field type="text" id="city" name="city" />
                <ErrorMessage name="city" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="tin">{t("restaurant-register.tin")}:</label>
                <Field type="text" id="tin" name="tin" />
                <ErrorMessage name="tin" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="businessType">{t("restaurant-register.businessType")}:</label>
                <Field as="select" id="businessType" name="businessType">
                  <option value="restaurant">{t("restaurant-register.types.restaurant")}</option>
                  <option value="bar">{t("restaurant-register.types.bar")}</option>
                  <option value="caffe">{t("restaurant-register.types.caffe")}</option>
                </Field>
                <ErrorMessage name="businessType" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="id">{t("restaurant-register.id")}:</label>
                <Field type="file" id="id" name="id"  accept=".png, .jpeg, .jpg"/>
                <ErrorMessage name="id" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="businessLicense">{t("restaurant-register.businessLicense")}:</label>
                <Field type="file" businessLicense="businessLicense" name="businessLicense"  accept=".png, .jpeg, .jpg .pdf"/>
              </div>

              <div className="form-control">
                <label htmlFor="leaseAgreement">{t("restaurant-register.leaseAgreement")}:</label>
                <Field type="file" leaseAgreement="leaseAgreement" name="leaseAgreement"  accept=".png, .jpeg, .jpg .pdf"/>
              </div>

              <div className="form-control">
                <label htmlFor="alcoholLicense">{t("restaurant-register.alcoholLicense")}:</label>
                <Field type="file" alcoholLicense="alcoholLicense" name="alcoholLicense"  accept=".png, .jpeg, .jpg .pdf"/>
              </div>

              <button type="submit" disabled={!formik.isValid}>
              {t("restaurant-register.button")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RestaurantRegister;
