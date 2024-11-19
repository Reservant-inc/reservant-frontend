import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage, FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";
import { RestaurantDataType } from "../../../services/types";
import { LocalType } from "../../../services/enums";
import { fetchFilesPOST, fetchGET, fetchPOST } from "../../../services/APIconn";
import { CSSTransition } from "react-transition-group";

// Material-UI imports
import Snackbar from "@mui/material/Snackbar";
import LinearProgress from "@mui/material/LinearProgress";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Button from "@mui/material/Button";
import { Checkbox, FormControlLabel, FormGroup, FormLabel, MenuItem, NativeSelect, Select, TextField } from "@mui/material";
import { group } from "console";
import { Close } from "@mui/icons-material";
import AttachFileIcon from '@mui/icons-material/AttachFile';



const initialValues: RestaurantDataType = {
  name: "",
  address: "",
  postalIndex: "",
  city: "",
  nip: "",
  restaurantType: "",
  idCard: null,
  businessPermission: null,
  rentalContract: null,
  alcoholLicense: null,
  tags: [],
  provideDelivery: false,
  logo: null,
  photos: [],
  description: "",
  groupId: null,
  reservationDeposit: null,
  openingHours: [],
  maxReservationDurationMinutes: null
};

const RestaurantRegister: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [requestLoading, setRequestLoading] = useState<boolean>(false);
   
  const [tags, setTags] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { t } = useTranslation("global");

  const { RestaurantRegisterStep1Schema, RestaurantRegisterStep2Schema, RestaurantRegisterStep3Schema } =
    useValidationSchemas();

 

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

  const handleNextClick = async (formik: any) => {
    
    if (formik.isSubmitting || !formik.isValid || !formik.dirty) {
      return; 
    }
    
    setRequestLoading(true); // Ustawienie loading state

    try {

      const body = JSON.stringify({
        name: formik.values.name,
        nip: formik.values.nip,
        restaurantType: formik.values.restaurantType,
        address: formik.values.address,
        postalIndex: formik.values.postalIndex,
        city: formik.values.city,
        //groupId: 0
      });
      
      const response = await fetchPOST("/my-restaurants/validate-first-step", body);
      
        setServerError(null); 
        setActiveStep(2); 
     
    } catch (error) {
      setServerError(t("restaurant-register.serverError"));

    } finally {
      setRequestLoading(false); 
    }
  };

  const handleSubmit = async () => {
   
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const minute = m.toString().padStart(2, '0');
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  };
  const timeOptions = generateTimeOptions();
  

  return (
    <div id="restaurantRegister-div-wrapper" >
      <h1
        id="restaurantRegister-header"
        className="mb-8 text-center text-3xl font-bold"
      >
        {t("restaurant-register.header")}
      </h1>
      <Formik
              initialValues={initialValues}
              validationSchema={activeStep === 1 ? RestaurantRegisterStep1Schema : RestaurantRegisterStep2Schema}
              onSubmit={(values: FormikValues) => {
                // Logic for form submission (if needed)
                console.log(values);
              }}
            >
              {(formik) => (
                <Form className="w-full h-full mt-[10%]">
                  <div className="form-container h-full flex flex-col items-center gap-4">
                    {/* Pasek postępu */}
                    <div className="relative w-4/5 h-4 bg-grey-0 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${(activeStep / 3) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-black font-mont-md">
                      {`Step ${activeStep} of 3`}
                    </span>
                    {/* Step 1 */}
                    <CSSTransition
                      in={activeStep === 1}
                      timeout={500}
                      classNames="menu-primary"
                      unmountOnExit
                    >
                      <div className="flex w-full flex-col items-center gap-4">
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          label="Restaurant Name *"
                          variant="standard"
                          as={TextField}
                          className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${!(formik.errors.name && formik.touched.name) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"}`}
                          helperText={formik.errors.name && formik.touched.name && formik.errors.name}
                        />
                        <Field
                          type="text"
                          id="address"
                          name="address"
                          label="Address *"
                          variant="standard"
                          as={TextField}
                          className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${!(formik.errors.address && formik.touched.address) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"}`}
                          helperText={formik.errors.address && formik.touched.address && formik.errors.address}
                        />
                        <Field
                          type="text"
                          id="postalIndex"
                          name="postalIndex"
                          label="Postal Code *"
                          variant="standard"
                          as={TextField}
                          className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${!(formik.errors.postalIndex && formik.touched.postalIndex) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"}`}
                          helperText={formik.errors.postalIndex && formik.touched.postalIndex && formik.errors.postalIndex}
                        />
                        <Field
                          type="text"
                          id="city"
                          name="city"
                          label="City *"
                          variant="standard"
                          as={TextField}
                          className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${!(formik.errors.city && formik.touched.city) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"}`}
                          helperText={formik.errors.city && formik.touched.city && formik.errors.city}
                        />
                        <Field
                          type="text"
                          id="nip"
                          name="nip"
                          label="NIP *"
                          variant="standard"
                          as={TextField}
                          className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${!(formik.errors.nip && formik.touched.nip) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"}`}
                          helperText={formik.errors.nip && formik.touched.nip && formik.errors.nip}
                        />
                        <Field
                          type="text"
                          id="restaurantType"
                          name="restaurantType"
                          label="Restaurant Type *"
                          variant="standard"
                          as={Select}
                          className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${!(formik.errors.restaurantType && formik.touched.restaurantType) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"}`}
                          helperText={formik.errors.restaurantType && formik.touched.restaurantType && formik.errors.restaurantType}
                        >
                           <MenuItem id="restaurantRegister-opt-restaurant" value={LocalType.Restaurant}>
                              {t("restaurant-register.types.restaurant")}
                            </MenuItem>
                            <MenuItem id="restaurantRegister-opt-bar" value={LocalType.Bar}>
                              {t("restaurant-register.types.bar")}
                            </MenuItem>
                            <MenuItem id="restaurantRegister-opt-cafe" value={LocalType.Cafe}>
                              {t("restaurant-register.types.cafe")}
                            </MenuItem>
                        </Field>
                        <div className="flex flex-col items-center gap-4">
                          <button
                            type="button"
                            onClick={() => handleNextClick(formik)}
                            disabled={formik.isSubmitting || !formik.isValid || !formik.dirty || requestLoading}
                            className={`flex h-[50px] w-[70px] cursor-pointer items-center justify-center rounded-lg shadow-md ${formik.isValid && formik.dirty && !requestLoading ? "bg-primary text-white" : "bg-grey-1"}`}
                          >
                            Next
                          </button>
                          {serverError && (
                            <div className="text-error p-2">Server Error</div>
                          )}
                        </div>

                      </div>
                    </CSSTransition>

                    {/* Step 2 */}
                    <CSSTransition
                      in={activeStep === 2}
                      timeout={500}
                      classNames="menu-secondary"
                      unmountOnExit
                    >
                      <div className="flex w-full flex-col items-center gap-4">
                        <FieldArray name="tags">
                          {({ push, remove }) => (
                            <div className="flex flex-col w-4/5">
                              <FormLabel className="text text-black font-mont-md mb-2">Tags:</FormLabel>
                              <FormGroup>
                                {tags.map((tag, index) => (
                                  <FormControlLabel
                                    key={index}
                                    control={
                                      <Checkbox
                                        className={
                                          formik.values.tags.includes(tag)
                                            ? "text-primary [&.Mui-checked]:text-secondary"
                                            : "text-grey-1"
                                        }
                                        checked={formik.values.tags.includes(tag)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            push(tag);
                                          } else {
                                            const idx = formik.values.tags.indexOf(tag);
                                            remove(idx);
                                          }
                                        }}
                                      />
                                    }
                                    label={<span className="text-sm text-black font-mont-md">{tag}</span>}
                                  />
                                ))}
                              </FormGroup>
                            </div>
                          )}
                        </FieldArray>
                        <div className="w-[85%]">
                          <FormControlLabel
                            control={
                              <Checkbox
                                id="provideDelivery"
                                name="provideDelivery"
                                checked={formik.values.provideDelivery}
                                onChange={formik.handleChange}
                                className="text-grey-1 [&.Mui-checked]:text-secondary"
                              />
                            }
                            label="Provide Delivery:"
                            labelPlacement="start"  // Etykieta na początku (z lewej)
                            className="flex items-center gap-2 justify-between w-full"  // Dodatkowo użyj 'justify-between'
                          />
                        </div>
                        <FieldArray name="openingHours">
                          {({ push, remove }) => (
                            <div className="flex flex-col w-4/5 gap-4">
                              <FormLabel className="text text-black font-mont-md mb-2">Opening Hours:</FormLabel>
                              {formik.values.openingHours.map((timeSlot, index) => (
                                <div key={index} className="flex items-center gap-4">
                                  <Field
                                    as={NativeSelect}
                                    id={`openingHours[${index}].from`}
                                    name={`openingHours[${index}].from`}
                                    className="[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary"
                                  >
                                    <option value="" disabled>
                                      From
                                    </option>
                                    {timeOptions.map((time) => (
                                      <option key={time} value={time}>
                                        {time}
                                      </option>
                                    ))}
                                  </Field>
                                  <span className="text-sm font-bold text-gray-500">-</span>
                                  <Field
                                    as={NativeSelect}
                                    id={`openingHours[${index}].until`}
                                    name={`openingHours[${index}].until`}
                                    className="[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] [&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary"
                                  >
                                    <option value="" disabled>
                                      Until
                                    </option>
                                    {timeOptions.map((time) => (
                                      <option key={time} value={time}>
                                        {time}
                                      </option>
                                    ))}
                                  </Field>
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-red-500 font-bold"
                                  >
                                    <Close />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => push({ from: "", until: "" })}
                                className="text-primary"
                              >
                                + Add Time Slot
                              </button>
                            </div>
                          )}
                        </FieldArray>
                        <Field
                          type="text"
                          id="description"
                          name="description"
                          label="Description"
                          variant="standard"
                          as={TextField}
                          className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${!(formik.errors.description && formik.touched.description) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"}`}
                          helperText={formik.errors.description && formik.touched.description && formik.errors.description}
                        />
                         <Field
                          type="text"
                          id="reservationDeposit"
                          name="reservationDeposit"
                          label="Reservation deposit"
                          variant="standard"
                          as={TextField}
                          className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${!(formik.errors.reservationDeposit && formik.touched.reservationDeposit) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"}`}
                          helperText={formik.errors.reservationDeposit && formik.touched.reservationDeposit && formik.errors.reservationDeposit}
                        />
                        <Field
                          type="text"
                          id="maxReservationDurationMinutes"
                          name="maxReservationDurationMinutes"
                          label="Maximum reservation duration in minutes"
                          variant="standard"
                          as={TextField}
                          className={`[&>*]:label-[20px] w-4/5 [&>*]:font-mont-md [&>*]:text-[15px] ${!(formik.errors.maxReservationDurationMinutes && formik.touched.maxReservationDurationMinutes) ? "[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary" : "[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error"}`}
                          helperText={formik.errors.reservationDeposit && formik.touched.maxReservationDurationMinutes && formik.errors.maxReservationDurationMinutes}
                        />
                        <div className="flex gap-5">
                          <button
                            type="button"
                            onClick={() => setActiveStep(1)}
                            className="btn-back"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveStep(3)}
                            disabled={formik.isSubmitting || !formik.isValid || !formik.dirty || requestLoading}
                            className={`flex h-[50px] w-[70px] cursor-pointer items-center justify-center rounded-lg shadow-md ${formik.isValid && formik.dirty && !requestLoading ? "bg-primary text-white" : "bg-grey-1"}`}
                          >
                            Next
                          </button>
                          {serverError && (
                            <div className="text-error mt-2">Server Error</div>
                          )}
                        </div>
                        
                      </div>
                    </CSSTransition>

                    {/* Step 3 */}
                    <CSSTransition
                      in={activeStep === 3}
                      timeout={500}
                      classNames="menu-secondary"
                      unmountOnExit
                    >
                      <div className="flex w-full flex-col items-center gap-4">
                      <div className="flex items-center w-4/5 gap-4">
                          <label htmlFor="logo" className="font-mont-md text-black text-sm flex-1">
                            Logo
                          </label>
                          <button
                            type="button"
                            className="flex items-center"
                            onClick={() => document.getElementById("logo")?.click()}
                          >
                            <AttachFileIcon className="text-primary" />
                          </button>
                          <input
                            type="file"
                            id="logo"
                            name="logo"
                            onChange={(event) => {
                              const file = event.currentTarget.files?.[0];
                              formik.setFieldValue("logo", file);
                            }}
                            className="hidden"
                          />
                          {formik.errors.logo && formik.touched.logo && (
                            <div className="text-error text-xs">{formik.errors.logo}</div>
                          )}
                        </div>

                        <div className="flex items-center w-4/5 gap-4">
                          <label htmlFor="photos" className="font-mont-md text-black text-sm flex-1">
                            Photos
                          </label>
                          <button
                            type="button"
                            className="flex items-center"
                            onClick={() => document.getElementById("photos")?.click()}
                          >
                            <AttachFileIcon className="text-primary" />
                          </button>
                          <input
                            type="file"
                            id="photos"
                            name="photos"
                            multiple
                            onChange={(event) => {
                              const files = Array.from(event.currentTarget.files || []);
                              formik.setFieldValue("photos", files);
                            }}
                            className="hidden"
                          />
                          {formik.errors.photos && formik.touched.photos && (
                            <div className="text-error text-xs">{formik.errors.photos}</div>
                          )}
                        </div>

                        <div className="flex items-center w-4/5 gap-4">
                          <label htmlFor="idCard" className="font-mont-md text-black text-sm flex-1">
                            ID Card
                          </label>
                          <button
                            type="button"
                            className="flex items-center"
                            onClick={() => document.getElementById("idCard")?.click()}
                          >
                            <AttachFileIcon className="text-primary" />
                          </button>
                          <input
                            type="file"
                            id="idCard"
                            name="idCard"
                            onChange={(event) => {
                              const file = event.currentTarget.files?.[0];
                              formik.setFieldValue("idCard", file);
                            }}
                            className="hidden"
                          />
                          {formik.errors.idCard && formik.touched.idCard && (
                            <div className="text-error text-xs">{formik.errors.idCard}</div>
                          )}
                        </div>

                        <div className="flex items-center w-4/5 gap-4">
                          <label
                            htmlFor="businessPermission"
                            className="font-mont-md text-black text-sm flex-1"
                          >
                            Business Permission
                          </label>
                          <button
                            type="button"
                            className="flex items-center"
                            onClick={() => document.getElementById("businessPermission")?.click()}
                          >
                            <AttachFileIcon className="text-primary" />
                          </button>
                          <input
                            type="file"
                            id="businessPermission"
                            name="businessPermission"
                            onChange={(event) => {
                              const file = event.currentTarget.files?.[0];
                              formik.setFieldValue("businessPermission", file);
                            }}
                            className="hidden"
                          />
                          {formik.errors.businessPermission &&
                            formik.touched.businessPermission && (
                              <div className="text-error text-xs">
                                {formik.errors.businessPermission}
                              </div>
                            )}
                        </div>
  
                        <div className="flex gap-5">
                          <button
                            type="button"
                            onClick={() => setActiveStep(2)}
                            className="btn-back"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={!formik.isValid || requestLoading}
                            className="btn-submit"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </CSSTransition>
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

