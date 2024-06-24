import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";
import { RestaurantDataType } from "../../../services/types";
import { LocalType } from "../../../services/enums";
import { fetchFilesPOST, fetchGET, fetchPOST } from "../../../services/APIconn";
// Material-UI imports
import Snackbar from "@mui/material/Snackbar";
import LinearProgress from "@mui/material/LinearProgress";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Button from "@mui/material/Button";

const RestaurantRegister: React.FC = () => {
  const [isStep1, setIsStep1] = useState(true);
  const [formDataStep1, setFormDataStep1] = useState<
    Partial<RestaurantDataType>
  >({});
  const [formDataStep2, setFormDataStep2] = useState<
    Partial<RestaurantDataType>
  >({});
  const [tags, setTags] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formProgress, setFormProgress] = useState<number>(0);

  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const { RestaurantRegisterStep1Schema, RestaurantRegisterStep2Schema } =
    useValidationSchemas();

  const initialValuesStep1: Partial<RestaurantDataType> = {
    name: formDataStep1.name || "",
    address: formDataStep1.address || "",
    postalIndex: formDataStep1.postalIndex || "",
    city: formDataStep1.city || "",
    nip: formDataStep1.nip || "",
    restaurantType: formDataStep1.restaurantType || LocalType.Restaurant,
    idCard: formDataStep1.idCard || null,
    businessPermission: formDataStep1.businessPermission || null,
    rentalContract: formDataStep1.rentalContract || null,
    alcoholLicense: formDataStep1.alcoholLicense || null,
  };

  const initialValuesStep2: Partial<RestaurantDataType> = {
    tags: [],
    provideDelivery: formDataStep2.provideDelivery || false,
    logo: formDataStep2.logo || null,
    photos: formDataStep2.photos || [],
    description: formDataStep2.description || "",
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await fetchGET("/restaurant-tags");
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const calculateProgress = () => {
      let progress = 0;
      if (!isStep1 && !isFormSubmitted) {
        progress = 50;
      } else if (!isStep1 && isFormSubmitted) {
        progress = 100;
      }
      setFormProgress(progress);
    };

    calculateProgress();
  }, [isStep1, isFormSubmitted]);

  const handleStep1Submit = (data: Partial<RestaurantDataType>) => {
    setFormDataStep1((prevData) => ({ ...prevData, ...data }));
    setIsStep1(false);
  };

  const handleStep2Submit = (data: Partial<RestaurantDataType>) => {
    setFormDataStep2((prevData) => ({ ...prevData, ...data }));
    handleSubmit({ ...formDataStep1, ...data });
  };

  const handleBack = () => {
    setIsStep1(true);
  };

  const handleSubmit = async (data: Partial<RestaurantDataType>) => {
    try {
      console.log(data);
      const filesToUpload: { name: keyof RestaurantDataType }[] = [
        { name: "idCard" },
        { name: "logo" },
        { name: "businessPermission" },
        { name: "rentalContract" },
        { name: "alcoholLicense" },
      ];

      for (const { name } of filesToUpload) {
        const file = data[name] as File | null;
        if (file) {
          try {
            const fileResponse = await fetchFilesPOST("/uploads", file);
            data[name] = fileResponse.fileName;
          } catch (error) {
            console.error(`Failed to upload ${name}:`, error);
          }
        }
      }

      if (data.photos) {
        const photosToUpload: (string | File)[] = [];
        for (const photoFile of data.photos) {
          if (photoFile instanceof File) {
            try {
              const photoResponse = await fetchFilesPOST("/uploads", photoFile);
              photosToUpload.push(photoResponse.fileName);
            } catch (error) {
              console.error("Failed to upload photo file:", error);
            }
          } else if (typeof photoFile === "string") {
            photosToUpload.push(photoFile);
          } else {
            console.error("Invalid photo file:", photoFile);
          }
        }
        const photoFileNames: string[] = photosToUpload
          .filter((item) => typeof item === "string")
          .map((item) => item as string);

        data.photos = photoFileNames;
      } else {
        console.warn("No photos to upload.");
      }

      console.log(data);

      await fetchPOST("/my-restaurants", JSON.stringify(data));

      setIsFormSubmitted(true);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error while creating restaurant:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    navigate("/home");
  };

  return (
    <div id="restaurantRegister-div-wrapper">
      <h1 id="restaurantRegister-header" className="mb-8 text-center text-3xl font-bold">
        {t("restaurant-register.header")}
      </h1>
      <Stepper
        id="restuarantRegister-stepper"
        activeStep={isStep1 ? 0 : isFormSubmitted ? 2 : 1}
        alternativeLabel
      >
        <Step id="restaurantRegister-step1">
          <StepLabel id="restaurantRegister-step1-label">{t("restaurant-register.step1")}</StepLabel>
        </Step>
        <Step id="restaurantRegister-step2">
          <StepLabel id="restaurantRegister-step2-label">{t("restaurant-register.step2")}</StepLabel>
        </Step>
        <Step id="restaurantRegister-step3">
          <StepLabel id="restaurantRegister-step3-label">{t("restaurant-register.submit")}</StepLabel>
        </Step>
      </Stepper>
      <Formik
        id="restaurantRegister-formik"
        initialValues={isStep1 ? initialValuesStep1 : initialValuesStep2}
        validationSchema={
          isStep1
            ? RestaurantRegisterStep1Schema
            : RestaurantRegisterStep2Schema
        }
        onSubmit={isStep1 ? handleStep1Submit : handleStep2Submit}
      >
        {(formik) => (
          <Form id="restaurantRegister-form">
            <div id="restaurantRegister-stepsWrapper">
              {isStep1 && (
                <>
                  <div id="restuarantRegister-form-control-name">
                    <label id="restaurantRegister-label-name" htmlFor="name">
                      {t("restaurant-register.name")}:
                    </label>
                    <Field type="text" id="name" name="name" />
                    <ErrorMessage id="restaruantRegister-errorMessage-name" name="name" component="div" />
                  </div>

                  <div id="restuarantRegister-form-control-address">
                    <label id="restaurantRegister-label-address" htmlFor="address">
                      {t("restaurant-register.address")}:
                    </label>
                    <Field type="text" id="address" name="address" />
                    <ErrorMessage id="restaruantRegister-errorMessage-address" name="address" component="div" />
                  </div>

                  <div id="restuarantRegister-form-control-postalIndex">
                    <label id="restaurantRegister-label-postalIndex" htmlFor="postalIndex">
                      {t("restaurant-register.postalCode")}:
                    </label>
                    <Field type="text" id="postalIndex" name="postalIndex" />
                    <ErrorMessage id="restaruantRegister-errorMessage-postalIndex" name="postalIndex" component="div" />
                  </div>

                  <div id="restuarantRegister-form-control-city">
                    <label id="restaurantRegister-label-city" htmlFor="city">
                      {t("restaurant-register.city")}:
                    </label>
                    <Field type="text" id="city" name="city" />
                    <ErrorMessage id="restaruantRegister-errorMessage-city" name="city" component="div" />
                  </div>

                  <div id="restuarantRegister-form-control-nip">
                    <label id="restaurantRegister-label-nip" htmlFor="nip">{t("restaurant-register.tin")}:</label>
                    <Field type="text" id="nip" name="nip" />
                    <ErrorMessage id="restaruantRegister-errorMessage-nip" name="nip" component="div" />
                  </div>

                  <div id="restuarantRegister-form-control-restaurantType">
                    <label id="restaurantRegister-label-restaurantType" htmlFor="restaurantType">
                      {t("restaurant-register.businessType")}:
                    </label>
                    <Field
                      as="select"
                      id="restaurantType"
                      name="restaurantType"
                    >
                      <option id="restaurantRegister-opt-restaurant" value={LocalType.Restaurant}>
                        {t("restaurant-register.types.restaurant")}
                      </option>
                      <option id="restaurantRegister-opt-bar" value={LocalType.Bar}>
                        {t("restaurant-register.types.bar")}
                      </option>
                      <option id="restaurantRegister-opt-cafe" value={LocalType.Cafe}>
                        {t("restaurant-register.types.cafe")}
                      </option>
                    </Field>
                    <ErrorMessage id="restaruantRegister-errorMessage-restaurantType" name="restaurantType" component="div" />
                  </div>

                  <div id="restuarantRegister-form-control-idCard">
                    <label id="restaurantRegister-label-idCard" htmlFor="idCard">
                      {t("restaurant-register.id")}:
                    </label>
                    <input
                      type="file"
                      id="idCard"
                      name="idCard"
                      accept=".pdf"
                      onChange={(e) =>
                        formik.setFieldValue(
                          "idCard",
                          e.target.files && e.target.files[0],
                        )
                      }
                    />
                    <ErrorMessage id="restaruantRegister-errorMessage-idCard" name="idCard" component="div" />
                  </div>

                  <div id="restuarantRegister-form-control-businessPermission">
                    <label id="restaurantRegister-label-businessPermission" htmlFor="businessPermission">
                      {t("restaurant-register.businessLicense")}:
                    </label>
                    <input
                      type="file"
                      id="businessPermission"
                      name="businessPermission"
                      accept=".pdf"
                      onChange={(e) =>
                        formik.setFieldValue(
                          "businessPermission",
                          e.target.files && e.target.files[0],
                        )
                      }
                    />
                    <ErrorMessage id="restaruantRegister-errorMessage-businessPermission" name="businessPermission" component="div" />
                  </div>
 
                  <div id="restuarantRegister-form-control-rentalContract">
                    <label id="restaurantRegister-label-rentalContract" htmlFor="rentalContract">
                      {t("restaurant-register.leaseAgreement")}:
                    </label>
                    <input
                      type="file"
                      id="rentalContract"
                      name="rentalContract"
                      accept=".pdf"
                      onChange={(e) =>
                        formik.setFieldValue(
                          "rentalContract",
                          e.target.files && e.target.files[0],
                        )
                      }
                    />
                  </div>

                  <div id="restuarantRegister-form-control-alcoholLicense">
                    <label id="restaurantRegister-label-alcoholLicense" htmlFor="alcoholLicense">
                      {t("restaurant-register.alcoholLicense")}:
                    </label>
                    <input
                      type="file"
                      id="alcoholLicense"
                      name="alcoholLicense"
                      accept=".pdf"
                      onChange={(e) =>
                        formik.setFieldValue(
                          "alcoholLicense",
                          e.target.files && e.target.files[0],
                        )
                      }
                    />
                  </div>
                </>
              )}

              {!isStep1 && (
                <>
                  <div id="restaurantRegister-from-control-tags">
                    <label id="restaurantRegister-label-tags">{t("restaurant-register.tags")}:</label>
                    <FieldArray name="tags">
                      {({ push, remove }) => (
                        <>
                          {tags.map((tag, index) => (
                            <div key={tag}>
                              <label id="restaurantRegister-wrapper-tags">
                                <Field
                                  type="checkbox"
                                  name={`tags.${index}`}
                                  id={`tags.${index}`}
                                  value={tag}
                                  checked={(formik.values.tags || []).includes(
                                    tag,
                                  )}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                  ) => {
                                    if (e.target.checked) {
                                      push(tag);
                                    } else {
                                      remove(index);
                                    }
                                  }}
                                />
                                {tag}
                              </label>
                            </div>
                          ))}
                        </>
                      )}
                    </FieldArray>
                    <ErrorMessage name="tags" component="div" />
                  </div>

                  <div id="restaurantRegister-from-control-provideDelivery">
                    <label id="restaurantRegister-label-provideDelivery" htmlFor="provideDelivery">
                      {t("restaurant-register.provideDelivery")}:
                    </label>
                    <Field
                      type="checkbox"
                      id="provideDelivery"
                      name="provideDelivery"
                    />
                  </div>

                  <div id="restaurantRegister-from-control-logo">
                    <label id="restaurantRegister-label-logo" htmlFor="logo">
                      {t("restaurant-register.logo")}:
                    </label>
                    <input
                      type="file"
                      id="logo"
                      name="logo"
                      accept=".png, .jpeg, .jpg .pdf"
                      onChange={(e) =>
                        formik.setFieldValue(
                          "logo",
                          e.target.files && e.target.files[0],
                        )
                      }
                    />
                    <ErrorMessage id="restaurantRegister-errorMessage-provideDelivery" name="logo" component="div" />
                  </div>

                  <div id="restaurantRegister-from-control-photos">
                    <label id="restaurantRegister-label-photos" htmlFor="photos">
                      {t("restaurant-register.photos")}:
                    </label>
                    <input
                      type="file"
                      id="photos"
                      name="photos"
                      multiple
                      accept=".png, .jpeg, .jpg"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          const selectedPhotosArray = Array.from(files);
                          formik.setFieldValue("photos", selectedPhotosArray);
                        }
                      }}
                    />
                    <ErrorMessage id="restaurantRegister-errorMessage-photos" name="photos" component="div" />
                  </div>

                  <div id="restaurantRegister-from-control-description">
                    <label id="restaurantRegister-label-description" htmlFor="description">
                      {t("restaurant-register.description")}:
                    </label>
                    <Field
                      type="text"
                      id="description"
                      name="description"
                      value={formik.values.description || ""} // Tutaj zmiana
                    />
                    <ErrorMessage id="restaurantRegister-errorMessage-provideDelivery" name="description" component="div" />
                  </div>
                </>
              )}

              <LinearProgress
                id="restaurantRegister-proggresBar"
                variant="determinate"
                value={formProgress}
                sx={{ width: "100%", marginTop: "20px" }}
              />
              <Button
                id="RestaurantRegisterNextButton"
                type="submit"
                variant="contained"
                color="primary"
                disabled={!formik.isValid || isFormSubmitted}
              >
                {isStep1
                  ? t("restaurant-register.nextButton")
                  : t("restaurant-register.saveButton")}
              </Button>

              {!isStep1 && (
                <Button
                  id="RestaurantRegisterBackButton"
                  variant="contained"
                  onClick={handleBack}
                  disabled={isFormSubmitted}
                >
                  {t("restaurant-register.backButton")}
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>

      <Snackbar
        id="restaurantRegister-snackBar"
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={t("restaurant-register.submitSuccessMessage")}
      />
    </div>
  );
};

export default RestaurantRegister;
