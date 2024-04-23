import React, { useEffect, useState } from "react";
import { RestaurantDetailsProps } from "../../../services/interfaces";
import {
  RestaurantDataType,
  RestaurantDetailsType,
} from "../../../services/types";
import { fetchGET } from "../../../services/APIconn";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  activeRestaurantId,
  editable,
  setEditable,
}) => {
  const [restaurant, setRestaurant] = useState<RestaurantDetailsType>();
  const [tags, setTags] = useState<string[]>([]);
  const [myGroups, setMyGroups] = useState([]); // zrobic forma do wyboru grupy
  const [t] = useTranslation("global");
  const { RestaurantEditSchema } = useValidationSchemas();

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

      const fetchGroups = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_SERVER_IP}/my-restaurant-groups`,
          );
          if (!response.ok) {
            throw new Error("Failed to fetch groups");
          }
          const data = await response.json();
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
    address: restaurant?.address,
    city: restaurant?.city,
    postalIndex: restaurant?.postalIndex,
    restaurantType: restaurant?.restaurantType,
    description: restaurant?.description,
    tags: restaurant?.tags,
    nip: restaurant?.nip,
    groupId: restaurant?.groupId, //TODO
    provideDelivery: restaurant?.provideDelivery,
    rentalContract: restaurant?.rentalContract,
    alcoholLicense: restaurant?.alcoholLicense,
  };

  const handleSubmit = (values: Partial<RestaurantDataType>) => {
    //Jak bedzie PUT to obsługa puta
    // onSubmit(values);
  };

  return (
    <div className="flex flex h-full w-full gap-4 rounded-xl px-4 py-4">
      <div className="h-full w-full rounded-xl bg-white dark:bg-black"></div>
      <div className="flex h-full w-[32rem] gap-1">
        <div className="relative flex h-full w-[4rem] items-center rounded-l-xl bg-white dark:bg-black"></div>
        <div className="h-full	w-full rounded-r-xl bg-white font-medium dark:bg-black dark:text-grey-1">
          {restaurant && (
            <>
              <div className="mx-6 my-1 aspect-square overflow-hidden rounded-full bg-grey-1 dark:bg-grey-4">
                <img src={restaurant.logo} alt="logo"></img>
              </div>
              <p className="m-1 p-1 text-center font-bold">
                {restaurant.name}
                <span className="ml-5">
                  {editable ? (
                    <>
                      <button className="mr-1 rounded-lg bg-primary-2 p-1 text-white dark:bg-secondary dark:text-black">
                        <svg
                          width="25px"
                          height="25px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"
                            fill="#0F0F0F"
                          />
                        </svg>
                      </button>
                      <button
                        className="rounded-lg bg-primary-3 p-1 text-white dark:bg-secondary-2 dark:text-black"
                        onClick={() => setEditable((editable) => !editable)}
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
                    </>
                  ) : (
                    <button
                      className="rounded-lg bg-primary-2 p-1 text-white dark:bg-secondary-2 dark:text-black"
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
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </span>
              </p>
              {editable ? (
                <div>
                  <Formik
                    initialValues={defaultInitialValues}
                    validationSchema={RestaurantEditSchema}
                    onSubmit={handleSubmit}
                  >
                    {(formik) => (
                      <Form>
                        <div className="form-container flex flex-col p-1">
                          <div className="form-control my-2 flex flex-col">
                            <label htmlFor="name">
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
                          <div className="form-control my-2 flex flex-col">
                            <label htmlFor="restaurantType">
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
                            <ErrorMessage
                              name="restaurantType"
                              component="div"
                            />
                          </div>

                          <div className="form-control my-2 flex flex-col">
                            <label htmlFor="city">
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

                          <div className="form-control my-2 flex flex-col">
                            <label htmlFor="address">
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
                          <div className="form-control my-2 flex flex-col">
                            <label htmlFor="description">
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
                          <div className="form-control my-2 flex flex-col">
                            <label htmlFor="nip">
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
                          <div className="form-control my-2">
                            <label>{t("restaurant-register.tags")}:</label>
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
                                            const filteredTags =
                                              form.values.tags.filter(
                                                (val: string) => val !== tag,
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
                          <div className="form-control my-2 flex flex-col">
                            <label htmlFor="provideDelivery">
                              {t("restaurant-register.provideDelivery")}:
                            </label>
                            <Field
                              type="checkbox"
                              id="provideDelivery"
                              name="provideDelivery"
                            />
                          </div>
                          <div className="form-control my-2 flex flex-col">
                            <label htmlFor="rentalContractFile">
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
                          <div className="form-control my-2 flex flex-col">
                            <label htmlFor="alcoholLicenseFile">
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
                      </Form>
                    )}
                  </Formik>
                </div>
              ) : (
                <>
                  <p className="m-1 mb-3">
                    Local type:{" "}
                    <span className="font-semibold">
                      {restaurant.restaurantType}
                    </span>
                  </p>
                  <hr className="mx-auto my-2 w-4/5 border-primary dark:border-secondary" />
                  <p className="m-1 mt-4">Address: </p>
                  <p className="m-1 ml-3 font-semibold">{restaurant.city}</p>
                  <p className="m-1 ml-3 font-semibold">{restaurant.address}</p>
                  <p className="m-1 ml-3 font-semibold">
                    {restaurant.postalIndex}
                  </p>
                  <hr className="mx-auto my-2 w-4/5 border-primary dark:border-secondary" />
                  <p className="m-1 mt-4">
                    Tables:{" "}
                    <span className="font-semibold">
                      {restaurant.tables.length}
                    </span>
                  </p>
                  <hr className="mx-auto my-2 w-4/5 border-primary dark:border-secondary" />
                  <p className="m-1 mt-4">Description:</p>
                  <p className="m-1 ml-3 font-semibold">
                    {restaurant.description}
                  </p>
                  <hr className="mx-auto my-2 w-4/5 border-primary dark:border-secondary" />
                  <p className="m-1 mt-4">
                    Tags:
                    <span className="font-semibold"> {restaurant.tags}</span>
                  </p>
                  <hr className="mx-auto my-2 w-4/5 border-primary dark:border-secondary" />
                  <p className="m-1 mt-4">
                    NIP: <span className="font-semibold">{restaurant.nip}</span>
                  </p>
                  <hr className="mx-auto my-2 w-4/5 border-primary dark:border-secondary" />
                  <p className="m-1 mt-4">
                    Provide delivery?{" "}
                    <span className="font-semibold">
                      {restaurant.provideDelivery ? "Yes" : "No"}
                    </span>
                  </p>
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
