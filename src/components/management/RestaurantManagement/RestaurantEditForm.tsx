import { ErrorMessage, Field, FieldArray, Formik, FormikValues } from "formik";
import { t } from "i18next";
import React from "react";
import { RestaurantEditFormProps } from "../../../services/interfaces";
import { RestaurantDataType } from "../../../services/types";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";
import { fetchFilesPOST, fetchPUT } from "../../../services/APIconn";
import { Form } from "react-router-dom";

const RestaurantEditForm: React.FC<RestaurantEditFormProps> = ({
  restaurant,
  activeRestaurantId,
  tags,
  setEditable,
}) => {
  const defaultInitialValues: Partial<RestaurantDataType> = {
    name: restaurant?.name,
    nip: restaurant?.nip,
    restaurantType: restaurant?.restaurantType,
    address: restaurant?.address,
    postalIndex: restaurant?.postalIndex,
    city: restaurant?.city,
    rentalContract: restaurant?.rentalContract, // upload not found
    alcoholLicense: restaurant?.alcoholLicense, // upload not found
    businessPermission: restaurant?.businessPermission, // upload not found
    idCard: restaurant?.idCard, // upload not found
    logo: restaurant?.logo, // upload not found
    provideDelivery: restaurant?.provideDelivery,
    description: restaurant?.description,
    tags: restaurant?.tags,
    photos: restaurant?.photos,
    // groupId: restaurant?.groupId, //TODO
  };
  const { RestaurantEditSchema } = useValidationSchemas();

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      const filesToUpload: { name: keyof RestaurantDataType }[] = [
        { name: "idCard" },
        { name: "logo" },
        { name: "businessPermission" },
        { name: "rentalContract" },
        { name: "alcoholLicense" },
      ];

      for (const { name } of filesToUpload) {
        const file = values[name] as File | null;
        if (file) {
          try {
            // zmienic na put?
            const fileResponse = await fetchFilesPOST("/uploads", file);
            values[name] = fileResponse.fileName;
          } catch (error) {
            console.error(`Failed to upload ${name}:`, error);
          }
        }
      }

      if (values.photos) {
        const photosToUpload: (string | File)[] = [];
        for (const photoFile of values.photos) {
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

        values.photos = photoFileNames;
      } else {
        console.warn("No photos to upload.");
      }

      //=========================
      setSubmitting(true);
      console.log(values);
      const response = await fetchPUT(
        `/my-restaurants/${activeRestaurantId}`,
        JSON.stringify(values),
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div>
      <Formik
        initialValues={defaultInitialValues}
        validationSchema={RestaurantEditSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <div className="flex h-full w-full flex-col">
              <div className="flex grow-0 justify-center">
                <button
                  type="submit"
                  disabled={!formik.isValid}
                  className="mr-1 rounded-lg bg-primary-2 p-1 text-white dark:bg-secondary dark:text-black"
                >
                  <svg
                    width="25px"
                    height="25px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"
                      fill="#0F0F0F"
                    />
                  </svg>
                </button>
                <button
                  className="rounded-lg bg-primary-3 p-1 text-white dark:bg-secondary-2 dark:text-black"
                  onClick={() => setEditable((e) => !e)}
                >
                  <svg
                    fill="#000000"
                    width="25px"
                    height="25px"
                    viewBox="0 0 32 32"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>cancel</title>
                    <path d="M10.771 8.518c-1.144 0.215-2.83 2.171-2.086 2.915l4.573 4.571-4.573 4.571c-0.915 0.915 1.829 3.656 2.744 2.742l4.573-4.571 4.573 4.571c0.915 0.915 3.658-1.829 2.744-2.742l-4.573-4.571 4.573-4.571c0.915-0.915-1.829-3.656-2.744-2.742l-4.573 4.571-4.573-4.571c-0.173-0.171-0.394-0.223-0.657-0.173v0zM16 1c-8.285 0-15 6.716-15 15s6.715 15 15 15 15-6.716 15-15-6.715-15-15-15zM16 4.75c6.213 0 11.25 5.037 11.25 11.25s-5.037 11.25-11.25 11.25-11.25-5.037-11.25-11.25c0.001-6.213 5.037-11.25 11.25-11.25z"></path>
                  </svg>
                </button>
              </div>
              <div>
                <div className="m-2 flex flex-col justify-center ">
                  <label htmlFor="name" className="font-semibold">
                    {t("restaurant-register.name")}:
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="dark:bg-grey-3"
                  />
                  <ErrorMessage name="name" component="div" />
                </div>
                <div className="form-control m-2 flex flex-col">
                  <label htmlFor="restaurantType" className="font-semibold">
                    {t("restaurant-register.businessType")}:
                  </label>
                  <Field
                    as="select"
                    id="restaurantType"
                    name="restaurantType"
                    className="dark:bg-grey-3"
                  >
                    <option value="Restaurant">
                      {t("restaurant-register.types.restaurant")}
                    </option>
                    <option value="Bar">
                      {t("restaurant-register.types.bar")}
                    </option>
                    <option value="Cafe">
                      {t("restaurant-register.types.caffe")}
                    </option>
                  </Field>
                  <ErrorMessage name="restaurantType" component="div" />
                </div>

                <div className="form-control mx-2 my-2 flex flex-col">
                  <label htmlFor="city" className="font-semibold">
                    {t("restaurant-register.city")}:
                  </label>
                  <Field
                    type="text"
                    id="city"
                    name="city"
                    className="dark:bg-grey-3"
                  />
                  <ErrorMessage name="city" component="div" />
                </div>

                <div className="form-control m-2 flex flex-col">
                  <label htmlFor="address" className="font-semibold">
                    {t("restaurant-register.address")}:
                  </label>
                  <Field
                    type="text"
                    id="address"
                    name="address"
                    className="dark:bg-grey-3"
                  />
                  <ErrorMessage name="address" component="div" />
                </div>
                <div className="form-control m-2 flex flex-col">
                  <label htmlFor="description" className="font-semibold">
                    {t("restaurant-register.description")}:
                  </label>
                  <Field
                    type="text"
                    id="description"
                    name="description"
                    className="dark:bg-grey-3"
                  />
                  <ErrorMessage name="description" component="div" />
                </div>
                <div className="form-control m-2 flex flex-col">
                  <label htmlFor="nip" className="font-semibold">
                    {t("restaurant-register.tin")}:
                  </label>
                  <Field
                    type="text"
                    id="nip"
                    name="nip"
                    className="dark:bg-grey-3"
                  />
                  <ErrorMessage name="nip" component="div" />
                </div>
                <div className="form-control m-2">
                  <label className="font-semibold">
                    {t("restaurant-register.tags")}:
                  </label>
                  <FieldArray name="tags">
                    {({ form }) => (
                      <span className="flex flex-col">
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
                            &nbsp;{tag}
                          </label>
                        ))}
                      </span>
                    )}
                  </FieldArray>
                  <ErrorMessage name="tags" component="div" />
                </div>
                <div className="form-control m-2 flex flex-col">
                  <label htmlFor="provideDelivery" className="font-semibold">
                    {t("restaurant-register.provideDelivery")}:
                  </label>
                  <Field
                    type="checkbox"
                    id="provideDelivery"
                    name="provideDelivery"
                  />
                </div>
                <div className="form-control m-2 flex flex-col">
                  <label htmlFor="rentalContractFile" className="font-semibold">
                    {t("restaurant-register.leaseAgreement")}:
                  </label>
                  <input
                    type="file"
                    id="rentalContractFile"
                    name="rentalContractFile"
                    accept=".pdf"
                    onChange={(e) =>
                      formik.setFieldValue(
                        "rentalContractFile",
                        e.target.files && e.target.files[0],
                      )
                    }
                  />
                </div>
                <div className="form-control m-2 flex flex-col">
                  <label htmlFor="alcoholLicenseFile" className="font-semibold">
                    {t("restaurant-register.alcoholLicense")}:
                  </label>
                  <input
                    type="file"
                    id="alcoholLicenseFile"
                    name="alcoholLicenseFile"
                    accept=".pdf"
                    onChange={(e) =>
                      formik.setFieldValue(
                        "alcoholLicenseFile",
                        e.target.files && e.target.files[0],
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RestaurantEditForm;
