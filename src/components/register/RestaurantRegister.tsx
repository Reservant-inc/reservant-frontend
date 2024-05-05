import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import "dotenv/config";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import Popup from "../reusableComponents/Popup";
import ErrorMes from "../reusableComponents/ErrorMessage"


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
  businessLicense: "",
  groupId: null, // ?
  //TODO - logo, files
};


const RestaurantRegister = () => {

  const navigate = useNavigate();
  
  const [t, i18n] = useTranslation("global");

  const [isPressed, setIsPressed] = useState(false)
  //dummy data
  const [groups, setGroups] = useState([
    {
      "id": 0,
      "name": "Group 1",
      "restaurantCount": 1
    },
    {
      "id": 1,
      "name": "Group 2",
      "restaurantCount": 2
    },
    {
      "id": 2,
      "name": "Group 3",
      "restaurantCount": 3
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://172.21.40.127:12038/my-restaurant-groups/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups: ', error);
      }
    };
    fetchData();
  }, []);

  const pressHandler = () => {
    setIsPressed((isP) => !isP);
  }


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
  walidacja groupAssignment? optional, wiec nie wiem
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
                <Field type="text" id="name" name="name" className={!(formik.errors.name && formik.touched.name)?"border-none":"border-solid border-2 border-pink"}/>
                <ErrorMessage name="name">
                    { msg => <ErrorMes msg={msg}/> }
                  </ErrorMessage>
              </div>

              <div className="form-control">
                <label htmlFor="address">{t("restaurant-register.address")}:</label>
                <Field type="text" id="address" name="address" className={!(formik.errors.address && formik.touched.address)?"border-none":"border-solid border-2 border-pink"}/>
                <ErrorMessage name="address">
                    { msg => <ErrorMes msg={msg}/> }
                  </ErrorMessage>
              </div>

              <div className="form-control">
                <label htmlFor="postalCode">{t("restaurant-register.postalCode")}:</label>
                <Field type="text" id="postalCode" name="postalCode" className={!(formik.errors.postalCode && formik.touched.postalCode)?"border-none":"border-solid border-2 border-pink"}/>
                <ErrorMessage name="postalCode">
                    { msg => <ErrorMes msg={msg}/> }
                  </ErrorMessage>              </div>

              <div className="form-control">
                <label htmlFor="city">{t("restaurant-register.city")}:</label>
                <Field type="text" id="city" name="city" className={!(formik.errors.city && formik.touched.city)?"border-none":"border-solid border-2 border-pink"}/>
                <ErrorMessage name="city">
                    { msg => <ErrorMes msg={msg}/> }
                  </ErrorMessage>              </div>

              <div className="form-control">
                <label htmlFor="tin">{t("restaurant-register.tin")}:</label>
                <Field type="text" id="tin" name="tin" className={!(formik.errors.tin && formik.touched.tin)?"border-none":"border-solid border-2 border-pink"}/>
                <ErrorMessage name="tin">
                    { msg => <ErrorMes msg={msg}/> }
                  </ErrorMessage>              </div>

              <div className="form-control">
                <label htmlFor="businessType">{t("restaurant-register.businessType")}:</label>
                <Field as="select" id="businessType" name="businessType" className={!(formik.errors.businessType && formik.touched.businessType)?"border-none":"border-solid border-2 border-pink"}>
                  <option value="restaurant">{t("restaurant-register.types.restaurant")}</option>
                  <option value="bar">{t("restaurant-register.types.bar")}</option>
                  <option value="caffe">{t("restaurant-register.types.caffe")}</option>
                </Field>
                <ErrorMessage name="businessType">
                    { msg => <ErrorMes msg={msg}/> }
                  </ErrorMessage>              </div>

              <div className="form-control">
                <label htmlFor="id">{t("restaurant-register.id")}:</label>
                <Field type="file" id="id" name="id"  accept=".png, .jpeg, .jpg" className={!(formik.errors.id && formik.touched.id)?"border-none":"border-solid border-2 border-pink"}/>
                <ErrorMessage name="id">
                    { msg => <ErrorMes msg={msg}/> }
                  </ErrorMessage>              </div>

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

              <Popup buttonText="Assign to a Group" modalTitle="Group Assignment">
                <div></div>
              </Popup>
              
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
