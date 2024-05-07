import React, { useEffect, useState } from "react";
import EmployeeManagement from "../EmployeeManagement/EmployeeManagement";
import { RestaurantDetailsProps } from "../../../services/interfaces";
import {
  RestaurantDataType,
  RestaurantDetailsType,
} from "../../../services/types";
import {
  fetchDELETE,
  fetchFilesPOST,
  fetchGET,
  fetchPUT,
} from "../../../services/APIconn";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FieldArray,
  FormikValues,
} from "formik";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";
import Section from "./ManagementSection";
import { useNavigate } from "react-router-dom";
import RestaurantEditForm from "./RestaurantEditForm";

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  activeRestaurantId,
  editable,
  setEditable,
}) => {
  const [restaurant, setRestaurant] = useState<RestaurantDetailsType>();
  const [tags, setTags] = useState<string[]>([]);
  const [myGroups, setMyGroups] = useState([]);
  const [t] = useTranslation("global");
  const { RestaurantEditSchema } = useValidationSchemas();
  const [page, setActivePage] = useState<number>(0);
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeRestaurantId != null) {
      const fetchData = async () => {
        try {
          const data = await fetchGET(`/my-restaurants/${activeRestaurantId}`);
          setRestaurant(data);
        } catch (error) {
          console.error("Error fetching groups: ", error);
        }
      };
      const fetchTags = async () => {
        try {
          const data = await fetchGET(`/restaurant-tags`);
          setTags(data);
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      };

      const fetchGroups = async () => {
        try {
          const data = await fetchGET(`/my-restaurant-groups`);
          setMyGroups(data);
        } catch (error) {
          console.error("Error fetching groups:", error);
        }
      };
      fetchData();
      fetchGroups();
      fetchTags();
    }
  }, [activeRestaurantId]);

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
    // groupId: restaurant?.groupId,
  };

  const handleDeleteRestaurant = async () => {
    try {
      const response = await fetchDELETE(
        `/my-restaurants/${activeRestaurantId}`,
        JSON.stringify(activeRestaurantId),
      );
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/my-restaurants");
    }
  };

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

      setSubmitting(true);
      console.log(values);
      const response = await fetchPUT(
        `/my-restaurants/${activeRestaurantId}`,
        JSON.stringify(values),
      );
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full gap-4 rounded-xl py-4 pr-4">
      <div className="w-full rounded-xl bg-white dark:bg-black">
        {
          {
            0: <EmployeeManagement activeRestaurantId={activeRestaurantId} />,
            1: <div />,
          }[page]
        }
      </div>
      <div className="flex w-[32rem] gap-[2px]">
        <div className="relative w-[4rem] rounded-l-xl bg-white dark:bg-black">
          <div className="flex flex-col items-center py-2">
            <Section
              currentPage={page}
              desiredPage={0}
              setActivePage={setActivePage}
              component={
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1251_98416)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9 0C5.96243 0 3.5 2.46243 3.5 5.5C3.5 8.53757 5.96243 11 9 11C12.0376 11 14.5 8.53757 14.5 5.5C14.5 2.46243 12.0376 0 9 0ZM5.5 5.5C5.5 3.567 7.067 2 9 2C10.933 2 12.5 3.567 12.5 5.5C12.5 7.433 10.933 9 9 9C7.067 9 5.5 7.433 5.5 5.5Z"
                    />
                    <path d="M15.5 0C14.9477 0 14.5 0.447715 14.5 1C14.5 1.55228 14.9477 2 15.5 2C17.433 2 19 3.567 19 5.5C19 7.433 17.433 9 15.5 9C14.9477 9 14.5 9.44771 14.5 10C14.5 10.5523 14.9477 11 15.5 11C18.5376 11 21 8.53757 21 5.5C21 2.46243 18.5376 0 15.5 0Z" />
                    <path d="M19.0837 14.0157C19.3048 13.5096 19.8943 13.2786 20.4004 13.4997C22.5174 14.4246 24 16.538 24 19V21C24 21.5523 23.5523 22 23 22C22.4477 22 22 21.5523 22 21V19C22 17.3613 21.0145 15.9505 19.5996 15.3324C19.0935 15.1113 18.8625 14.5217 19.0837 14.0157Z" />
                    <path d="M6 13C2.68629 13 0 15.6863 0 19V21C0 21.5523 0.447715 22 1 22C1.55228 22 2 21.5523 2 21V19C2 16.7909 3.79086 15 6 15H12C14.2091 15 16 16.7909 16 19V21C16 21.5523 16.4477 22 17 22C17.5523 22 18 21.5523 18 21V19C18 15.6863 15.3137 13 12 13H6Z" />
                  </g>
                </svg>
              }
            />
            <Section
              currentPage={page}
              desiredPage={1}
              setActivePage={setActivePage}
              component={
                <svg
                  className="h-6 w-6"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 226.014 226.014"
                >
                  <g>
                    <path
                      d="M113.009,226.013c62.31,0,113.005-50.693,113.005-113.006S175.318,0.001,113.009,0.001C50.695,0.001,0,50.694,0,113.007
                    S50.695,226.013,113.009,226.013z M113.009,15.001c54.041,0,98.005,43.965,98.005,98.006s-43.964,98.006-98.005,98.006
                    C58.965,211.013,15,167.048,15,113.007S58.965,15.001,113.009,15.001z"
                    />
                    <path
                      d="M113.009,179.855c36.858,0,66.847-29.988,66.847-66.848c0-36.861-29.988-66.848-66.847-66.848
                    c-36.862,0-66.85,29.986-66.85,66.848C46.159,149.866,76.146,179.855,113.009,179.855z M113.009,61.159
                    c28.587,0,51.847,23.258,51.847,51.848c0,28.588-23.26,51.848-51.847,51.848c-28.591,0-51.85-23.26-51.85-51.848
                    C61.159,84.417,84.418,61.159,113.009,61.159z"
                    />
                  </g>
                </svg>
              }
            />
          </div>
        </div>
        <div className="flex h-full w-[28rem] flex-col items-center rounded-r-xl bg-white font-medium dark:bg-black dark:text-grey-1">
          {showDeletePopup && (
            <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
              <div className="absolute inset-0 bg-black bg-opacity-70"></div>
              <div className="relative z-10 flex flex-col items-center rounded-lg rounded-lg border-2 border-primary bg-grey-1 p-8 dark:border-secondary-2 dark:bg-black">
                <p className="mb-4 text-xl font-semibold">
                  {t("restaurant-management.restaurants.delete")}
                  {restaurant?.name}?
                </p>
                <div className="flex">
                  <button
                    onClick={handleDeleteRestaurant}
                    className="mr-4 rounded-lg bg-primary-2 p-2 font-semibold text-white dark:bg-secondary dark:text-black dark:text-white"
                  >
                    {t("restaurant-management.restaurants.confirm")}
                  </button>
                  <button
                    className="rounded-lg bg-primary-2 p-2 font-semibold text-white dark:bg-secondary dark:text-white"
                    onClick={() => setShowDeletePopup((show) => !show)}
                  >
                    {t("restaurant-management.restaurants.refuse")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {restaurant && (
            <>
              {editable ? (
                <>
                  <div className="mt-5 aspect-square w-2/3 justify-center overflow-hidden rounded-full bg-grey-1 dark:bg-grey-4">
                    <img src={restaurant.logo} alt="logo"></img>
                  </div>
                  <div className="my-3 flex items-center justify-center text-xl font-extrabold">
                    {restaurant.name}
                  </div>
                  <div className="w-10/12">
                    {/* Formik will be only in this component, eventually. Got a weird react router error for now */}
                    {/* <RestaurantEditForm
                      restaurant={restaurant}
                      activeRestaurantId={activeRestaurantId}
                      tags={tags}
                      setEditable={setEditable}
                    /> */}
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
                                onClick={() =>
                                  setEditable((editable) => !editable)
                                }
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
                                <label
                                  htmlFor="restaurantType"
                                  className="font-semibold"
                                >
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
                                    {t("restaurant-register.types.cafe")}
                                  </option>
                                </Field>
                                <ErrorMessage
                                  name="restaurantType"
                                  component="div"
                                />
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
                                <label
                                  htmlFor="address"
                                  className="font-semibold"
                                >
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
                                <label
                                  htmlFor="description"
                                  className="font-semibold"
                                >
                                  {t("restaurant-register.description")}:
                                </label>
                                <Field
                                  type="text"
                                  id="description"
                                  name="description"
                                  className="dark:bg-grey-3"
                                />
                                <ErrorMessage
                                  name="description"
                                  component="div"
                                />
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
                                            checked={form.values.tags.includes(
                                              tag,
                                            )}
                                            onChange={(e) => {
                                              const isChecked =
                                                e.target.checked;
                                              if (isChecked) {
                                                form.setFieldValue("tags", [
                                                  ...form.values.tags,
                                                  tag,
                                                ]);
                                              } else {
                                                const filteredTags =
                                                  form.values.tags.filter(
                                                    (val: string) =>
                                                      val !== tag,
                                                  );
                                                form.setFieldValue(
                                                  "tags",
                                                  filteredTags,
                                                );
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
                                <label
                                  htmlFor="provideDelivery"
                                  className="font-semibold"
                                >
                                  {t("restaurant-register.provideDelivery")}:
                                </label>
                                <Field
                                  type="checkbox"
                                  id="provideDelivery"
                                  name="provideDelivery"
                                />
                              </div>
                              <div className="form-control m-2 flex flex-col">
                                <label
                                  htmlFor="rentalContractFile"
                                  className="font-semibold"
                                >
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
                                <label
                                  htmlFor="alcoholLicenseFile"
                                  className="font-semibold"
                                >
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
                </>
              ) : (
                <>
                  <div className="mt-5 aspect-square w-2/3 justify-center overflow-hidden rounded-full bg-grey-1 dark:bg-grey-4">
                    <img src={restaurant.logo} alt="logo"></img>
                  </div>
                  <div className="my-3 flex items-center justify-center text-xl font-extrabold">
                    {restaurant.name}
                  </div>
                  <div className="flex grow-0 justify-center">
                    {!editable && (
                      <>
                        <button
                          className="mr-1 rounded-lg bg-primary-2 p-1 text-white dark:bg-secondary dark:text-black"
                          onClick={() => setEditable(true)}
                        >
                          <svg
                            width="25px"
                            height="25px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40974 4.40973 4.7157 4.21799 5.09202C4 5.51985 4 6.0799 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.0799 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12.5M15.5 5.5L18.3284 8.32843M10.7627 10.2373L17.411 3.58902C18.192 2.80797 19.4584 2.80797 20.2394 3.58902C21.0205 4.37007 21.0205 5.6364 20.2394 6.41745L13.3774 13.2794C12.6158 14.0411 12.235 14.4219 11.8012 14.7247C11.4162 14.9936 11.0009 15.2162 10.564 15.3882C10.0717 15.582 9.54378 15.6885 8.48793 15.9016L8 16L8.04745 15.6678C8.21536 14.4925 8.29932 13.9048 8.49029 13.3561C8.65975 12.8692 8.89125 12.4063 9.17906 11.9786C9.50341 11.4966 9.92319 11.0768 10.7627 10.2373Z"
                              stroke="#000000"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => setShowDeletePopup(true)}
                          className="mr-1 rounded-lg bg-primary-2 p-1 text-white dark:bg-secondary-2 dark:text-black"
                        >
                          <svg
                            width="25px"
                            height="25px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3 6.98996C8.81444 4.87965 15.1856 4.87965 21 6.98996"
                              stroke="#000000"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8.00977 5.71997C8.00977 4.6591 8.43119 3.64175 9.18134 2.8916C9.93148 2.14146 10.9489 1.71997 12.0098 1.71997C13.0706 1.71997 14.0881 2.14146 14.8382 2.8916C15.5883 3.64175 16.0098 4.6591 16.0098 5.71997"
                              stroke="#000000"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 13V18"
                              stroke="#000000"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M19 9.98999L18.33 17.99C18.2225 19.071 17.7225 20.0751 16.9246 20.8123C16.1266 21.5494 15.0861 21.9684 14 21.99H10C8.91389 21.9684 7.87336 21.5494 7.07541 20.8123C6.27745 20.0751 5.77745 19.071 5.67001 17.99L5 9.98999"
                              stroke="#000000"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>

                  <div className="flex w-full flex-col p-8">
                    <div className="px-2">
                      Local type:
                      <p className="mx-3 font-semibold">
                        {restaurant.restaurantType}
                      </p>
                    </div>
                    <hr className="mx-auto my-4 w-full border-primary dark:border-secondary" />
                    <div className="px-2">
                      Address:
                      <p className="mx-3 font-semibold">{restaurant.city}</p>
                      <p className="mx-3 font-semibold">{restaurant.address}</p>
                      <p className="mx-3 font-semibold">
                        {restaurant.postalIndex}
                      </p>
                    </div>
                    <hr className="mx-auto my-4 w-full border-primary dark:border-secondary" />
                    <div className="px-2">
                      Tables:
                      <p className="mx-3 font-semibold">
                        {restaurant.tables.length}
                      </p>
                    </div>
                    <hr className="mx-auto my-4 w-full border-primary dark:border-secondary" />
                    <div className="px-2">
                      Description:
                      <p className="mx-3 font-semibold">
                        {restaurant.description}
                      </p>
                    </div>
                    <hr className="mx-auto my-4 w-full border-primary dark:border-secondary" />
                    <div className="px-2">
                      Tags:
                      <p className="mx-3 font-semibold"> {restaurant.tags}</p>
                    </div>
                    <hr className="mx-auto my-4 w-full border-primary dark:border-secondary" />
                    <div className="px-2">
                      NIP:
                      <p className="mx-3 font-semibold">{restaurant.nip}</p>
                    </div>
                    <hr className="mx-auto my-4 w-full border-primary dark:border-secondary" />
                    <div className="px-2">
                      Provide delivery?
                      <p className="mx-3 font-semibold">
                        {restaurant.provideDelivery ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
