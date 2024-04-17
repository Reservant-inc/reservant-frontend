// RegisterStep1.tsx
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { RestaurantData } from "./RestaurantRegister";
import { useTranslation } from "react-i18next";


interface RegisterStep1Props {
  onSubmit: (data: Partial<RestaurantData>) => void;
}

const RegisterStep1: React.FC<RegisterStep1Props> = ({ onSubmit }) => {
    const [t] = useTranslation("global");

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Initial values for step 1 form
  const initialValues: Partial<RestaurantData> = {
    name: "",
    address: "",
    postalIndex: "",
    city: "",
    nip: "",
    restaurantType: "",
    idCardFile: null,
    businessPermission: "",
    rentalContract: "",
    alcoholLicense: "",
    groupId: null
  };

  const validationSchema = yup.object({
    name: yup.string().required(t("errors.restaurant-register.name.required")),
    address: yup.string().required(t("errors.restaurant-register.address.required")),
    postalIndex: yup
      .string()
      .matches(/^[0-9]{2}-[0-9]{3}$/, t("errors.restaurant-register.postalCode.matches"))
      .required(t("errors.restaurant-register.postalCode.required")),
    city: yup.string().required(t("errors.restaurant-register.city.required")),
    nip: yup.string().matches(/^[0-9]{10}$/, t("errors.restaurant-register.tin.matches"))
      .required(t("errors.restaurant-register.tin.required")),
    restaurantType: yup.string().required(t("errors.restaurant-register.businessType.required")),
    //idCard: yup.mixed().required(t("errors.restaurant-register.id.required"))
  });

  // Handle submission of step 1 form
 const handleSubmit = (values: Partial<RestaurantData>) => {
    // Dodanie selectedFile do danych formularza
    const dataWithFile: Partial<RestaurantData> = { ...values, idCardFile: selectedFile };
    onSubmit(dataWithFile);
  };
  

  return (
    <div>
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
                <input type="file" id="idCardFile" name="idCardFile" accept=".png, .jpeg, .jpg" onChange={(e) => setSelectedFile(e.target.files![0])} />
                <ErrorMessage name="idCardFile" component="div" />
              </div>

              <div className="form-control">
                <label htmlFor="businessPermission">{t("restaurant-register.businessLicense")}:</label>
                <Field type="file" id="businessPermission" name="businessPermission"  accept=".png, .jpeg, .jpg .pdf"/>
              </div>

              <div className="form-control">
                <label htmlFor="rentalContract">{t("restaurant-register.leaseAgreement")}:</label>
                <Field type="file" id="rentalContract" name="rentalContract"  accept=".png, .jpeg, .jpg .pdf"/>
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
