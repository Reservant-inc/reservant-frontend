import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { RestaurantDataType } from "../../../services/types";
import { useTranslation } from "react-i18next";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import { RegisterStep2Props } from "../../../services/interfaces";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";

const RegisterStep2: React.FC<RegisterStep2Props> = ({ onSubmit, onBack }) => {
  const [t] = useTranslation("global");
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { RestaurantRegisterStep2Schema } = useValidationSchemas();

  // Fetch tags from the server
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_IP}/restaurant-tags`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const initialValues: Partial<RestaurantDataType> = {
    tags: [],
    provideDelivery: false,
    logoFile: null,
    photosFile: [],
    description: "",
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    navigate("/home");
  };

  const handleSubmit = (values: Partial<RestaurantDataType>) => {
    try {
      onSubmit(values);
      setSnackbarOpen(true);
      setIsFormSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={RestaurantRegisterStep2Schema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <div className="form-container">
              <div className="form-control">
                <label>{t("restaurant-register.tags")}:</label>
                <FieldArray name="tags">
                  {({ form }) => (
                    <>
                      {tags.map((tag) => (
                        <label key={tag}>
                          <input
                            type="checkbox"
                            name={`tags.${tag}`}
                            checked={form.values.tags.includes(tag)}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              if (isChecked) {
                                form.setFieldValue("tags", [
                                  ...form.values.tags,
                                  tag,
                                ]);
                              } else {
                                const filteredTags = form.values.tags.filter(
                                  (val: string) => val !== tag,
                                );
                                form.setFieldValue("tags", filteredTags);
                              }
                            }}
                          />
                          {tag}
                        </label>
                      ))}
                    </>
                  )}
                </FieldArray>
                <ErrorMessage name="tags" component="div" />
              </div>
              <div className="form-control">
                <label htmlFor="provideDelivery">
                  {t("restaurant-register.provideDelivery")}:
                </label>
                <Field
                  type="checkbox"
                  id="provideDelivery"
                  name="provideDelivery"
                />
              </div>
              <div className="form-control">
                <label htmlFor="lologoFilego">
                  {t("restaurant-register.logo")}:
                </label>
                <input
                  type="file"
                  id="logoFile"
                  name="logoFile"
                  accept=".png, .jpeg, .jpg .pdf"
                  onChange={(e) =>
                    formik.setFieldValue(
                      "logoFile",
                      e.target.files && e.target.files[0],
                    )
                  }
                />
                <ErrorMessage name="logoFile" component="div" />
              </div>
              <div className="form-control">
                <label htmlFor="photosFile">
                  {t("restaurant-register.photos")}:
                </label>
                <input
                  type="file"
                  id="photosFile"
                  name="photosFile"
                  multiple
                  accept=".png, .jpeg, .jpg"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      const selectedPhotosArray = Array.from(files);
                      formik.setFieldValue("photosFile", selectedPhotosArray);
                    }
                  }}
                />
                <ErrorMessage name="photosFile" component="div" />
              </div>
              <div className="form-control">
                <label htmlFor="description">
                  {t("restaurant-register.description")}:
                </label>
                <Field type="text" id="description" name="description" />
                <ErrorMessage name="description" component="div" />
              </div>
              <button
                type="submit"
                disabled={!formik.isValid || isFormSubmitted}
              >
                {t("restaurant-register.saveButton")}
              </button>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                message={t("restaurant-register.submitSuccessMessage")}
              />
            </div>
          </Form>
        )}
      </Formik>
      <button onClick={onBack} disabled={isFormSubmitted}>
        {t("restaurant-register.backButton")}
      </button>
    </div>
  );
};

export default RegisterStep2;
