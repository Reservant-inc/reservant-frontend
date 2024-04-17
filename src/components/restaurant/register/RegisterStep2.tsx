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
  
  const [tags, setTags] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);

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

  
  const initialValues: Partial<RestaurantData> = {
    tags: [],
    provideDelivery: false,
    logoFile: null,
    photosFile: [],
    description: "",
  };

  const validationSchema = yup.object({
    description: yup.string().max(200, t("errors.restaurant-register.description.max")),
    tags: yup.array().min(3, t("errors.restaurant-register.tags.min")),
    //logoFile: yup.mixed().required(t("errors.restaurant-register.logo.required"))
  });

  
  const handleSubmit = (values: Partial<RestaurantData>) => {
    const dataWithFile: Partial<RestaurantData> = { ...values, logoFile: selectedFile, photosFile: selectedPhotos };
    onSubmit(dataWithFile);
  };

  return (
    <div>
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
                <label htmlFor="lologoFilego">{t("restaurant-register.logo")}:</label>
                <input type="file" id="logoFile" name="logoFile" accept=".png, .jpeg, .jpg .pdf" onChange={(e) => setSelectedFile(e.target.files![0])} />
                <ErrorMessage name="logoFile" component="div" />
              </div>
              <div className="form-control">
                <label htmlFor="photosFile">{t("restaurant-register.photos")}:</label>
                <input
                  type="file"
                  id="photosFile"
                  name="photosFile"
                  multiple
                  accept=".png, .jpeg, .jpg"
                  onChange={(event) => {
                    const files = event.target.files;
                    if (files) {
                      const selectedPhotosArray = Array.from(files); 
                      setSelectedPhotos(selectedPhotosArray); 
                    }
                  }}
                />
                <ErrorMessage name="photosFile" component="div" />
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
      <button onClick={onBack}>{t("restaurant-register.backButton")}</button>
    </div>
  );
};

export default RegisterStep2;
