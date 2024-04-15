// RegisterStep2.tsx
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as yup from "yup";
import { RestaurantData } from "./RestaurantRegister";
import { useTranslation } from "react-i18next";

interface RegisterStep2Props {
  onSubmit: (data: Partial<RestaurantData>) => void;
  onBack: () => void;
}

const RegisterStep2: React.FC<RegisterStep2Props> = ({ onSubmit, onBack }) => {
  const [t] = useTranslation("global");
  // State for tags
  const [tags, setTags] = useState<string[]>([]);

  // Fetch tags from the server
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/restaurant-tags`);
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

  // Initial values for step 2 form
  const initialValues: Partial<RestaurantData> = {
    tags: [],
    provideDelivery: false,
    logo: null,
    photos: null,
    description: "",
  };

  const validationSchema = yup.object({
    description: yup.string().max(200, t("errors.restaurant-register.description.max")),
    tags: yup.array().min(3, t("errors.restaurant-register.tags.min")),
    logo: yup.mixed().required(t("errors.restaurant-register.logo.required"))
  });

  // Handle submission of step 2 form
  const handleSubmit = (values: Partial<RestaurantData>) => {
    onSubmit(values);
  };

//TODO: change h2 name
  return (
    <div>
      <h2>Step 2</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
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
                                form.setFieldValue(
                                  "tags",
                                  [...form.values.tags, tag]
                                );
                              } else {
                                const filteredTags = form.values.tags.filter(
                                  (val: string) => val !== tag
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
                <label htmlFor="provideDelivery">{t("restaurant-register.provideDelivery")}:</label>
                <Field type="checkbox" id="provideDelivery" name="provideDelivery" />
              </div>
              <div className="form-control">
                <label htmlFor="logo">{t("restaurant-register.logo")}:</label>
                <Field type="file" id="logo" name="logo" accept=".png, .jpeg, .jpg" />
                <ErrorMessage name="logo" component="div" />
              </div>
              <div className="form-control">
                <label htmlFor="photos">{t("restaurant-register.photos")}:</label>
                <Field type="file" id="photos" name="photos" multiple accept=".png, .jpeg, .jpg" />
                <ErrorMessage name="photos" component="div" />
              </div>
              <div className="form-control">
                <label htmlFor="description">{t("restaurant-register.description")}:</label>
                <Field type="text" id="description" name="description" />
                <ErrorMessage name="description" component="div" />
              </div>
              <button type="submit" disabled={!formik.isValid}>
                {t("restaurant-register.saveButton")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <button onClick={onBack}>Back</button>
    </div>
  );
};

export default RegisterStep2;
