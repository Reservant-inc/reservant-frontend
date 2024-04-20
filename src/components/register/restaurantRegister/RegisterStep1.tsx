import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { RestaurantDataType } from "../../../services/types";
import { useTranslation } from "react-i18next";
import { RegisterStep1Props } from "../../../services/interfaces";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";

const RegisterStep1: React.FC<RegisterStep1Props> = ({ onSubmit, initialValues }) => {
    const [t] = useTranslation("global");
    const { RestaurantRegisterStep1Schema } = useValidationSchemas()

    const defaultInitialValues: Partial<RestaurantDataType> = {
      name: initialValues.name || "",
      address: initialValues.address || "",
      postalIndex: initialValues.postalIndex || "",
      city: initialValues.city || "",
      nip: initialValues.nip || "",
      restaurantType: initialValues.restaurantType || "",
      idCardFile: null,
      businessPermissionFile: null,
      rentalContractFile: null,
      alcoholLicenseFile: null
    };
  
 const handleSubmit = (values: Partial<RestaurantDataType>) => {
    onSubmit(values);
  };
  

  return (
    <div>
      <Formik initialValues={defaultInitialValues} validationSchema={RestaurantRegisterStep1Schema} onSubmit={handleSubmit}>
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
                <label htmlFor="postalIndex">{t("restaurant-register.postalCode")}:</label>
                <Field type="text" id="postalIndex" name="postalIndex" />
                <ErrorMessage name="postalIndex" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="city">{t("restaurant-register.city")}:</label>
                <Field type="text" id="city" name="city" />
                <ErrorMessage name="city" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="nip">{t("restaurant-register.tin")}:</label>
                <Field type="text" id="nip" name="nip" />
                <ErrorMessage name="nip" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="restaurantType">{t("restaurant-register.businessType")}:</label>
                <Field as="select" id="restaurantType" name="restaurantType">
                  <option value="Restaurant">{t("restaurant-register.types.restaurant")}</option>
                  <option value="Bar">{t("restaurant-register.types.bar")}</option>
                  <option value="Cafe">{t("restaurant-register.types.caffe")}</option>
                </Field>
                <ErrorMessage name="restaurantType" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="idCardFile">{t("restaurant-register.id")}:</label>
                <input type="file" id="idCardFile" name="idCardFile" accept=".pdf" 
                onChange={(e) => formik.setFieldValue("idCardFile", e.target.files && e.target.files[0])} />
                <ErrorMessage name="idCardFile" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="businessPermissionFile">{t("restaurant-register.businessLicense")}:</label>
                <input type="file" id="businessPermissionFile" name="businessPermissionFile" accept=".pdf" 
                onChange={(e) => formik.setFieldValue("businessPermissionFile", e.target.files && e.target.files[0])} />
                <ErrorMessage name="businessPermissionFile" component="div" />
              </div>

              <div className="form-control"> 
                <label htmlFor="rentalContractFile">{t("restaurant-register.leaseAgreement")}:</label>
                <input type="file" id="rentalContractFile" name="rentalContractFile" accept=".pdf" 
                onChange={(e) => formik.setFieldValue("rentalContractFile", e.target.files && e.target.files[0])} />
              </div>

              <div className="form-control">
                <label htmlFor="alcoholLicenseFile">{t("restaurant-register.alcoholLicense")}:</label>
                <input type="file" id="alcoholLicenseFile" name="alcoholLicenseFile" accept=".pdf" 
                onChange={(e) => formik.setFieldValue("alcoholLicenseFile", e.target.files && e.target.files[0])} />
              </div>

              <button type="submit" disabled={!formik.isValid}>
                {t("restaurant-register.nextButton")}
              </button>
          </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterStep1;
