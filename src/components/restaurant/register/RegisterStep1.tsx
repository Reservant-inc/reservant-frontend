// RegisterStep1.tsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { RestaurantData } from "./RestaurantRegister";
import { useTranslation } from "react-i18next";


interface RegisterStep1Props {
  onSubmit: (data: Partial<RestaurantData>) => void;
}

const RegisterStep1: React.FC<RegisterStep1Props> = ({ onSubmit }) => {
    const [t] = useTranslation("global");

  // Initial values for step 1 form
  const initialValues: Partial<RestaurantData> = {
    name: "",
    address: "",
    postalCode: "",
    city: "",
    tin: "",
    businessType: "",
    id: null,
    tags: [],
    provideDelivery: false,
    logo: null,
    photos: null,
    description: "",
  };

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
    id: yup.mixed().required(t("errors.restaurant-register.id.required"))
  });

  // Handle submission of step 1 form
  const handleSubmit = (values: Partial<RestaurantData>) => {
    onSubmit(values);
  };
//TODO: change h2 name
  return (
    <div>
      <h2>Step 1</h2> 
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
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
                <Field type="file" id="businessLicense" name="businessLicense"  accept=".png, .jpeg, .jpg .pdf"/>
              </div>

              <div className="form-control">
                <label htmlFor="leaseAgreement">{t("restaurant-register.leaseAgreement")}:</label>
                <Field type="file" id="leaseAgreement" name="leaseAgreement"  accept=".png, .jpeg, .jpg .pdf"/>
              </div>

              <div className="form-control">
                <label htmlFor="alcoholLicense">{t("restaurant-register.alcoholLicense")}:</label>
                <Field type="file" id="alcoholLicense" name="alcoholLicense"  accept=".png, .jpeg, .jpg .pdf"/>
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
