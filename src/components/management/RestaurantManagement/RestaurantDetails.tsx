import React, { useEffect, useState } from "react";
import RestaurantData from "./RestaurantData";
import EmployeeManagement from "../EmployeeManagement/EmployeeManagement";
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
  const [myGroups, setMyGroups] = useState([]);
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
    city: restaurant?.city, // todo
    postalIndex: restaurant?.postalIndex,
    restaurantType: restaurant?.restaurantType,
    description: restaurant?.description,
    tags: restaurant?.tags,
    nip: restaurant?.nip,
    groupId: restaurant?.groupId, //TODO
    provideDelivery: restaurant?.provideDelivery, //todo
    rentalContract: restaurant?.rentalContract, //todo
    alcoholLicense: restaurant?.alcoholLicense, //todo
  };

  const handleSubmit = (values: Partial<RestaurantDataType>) => {
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
                        Save
                      </button>
                      <button
                        className="rounded-lg bg-primary-3 p-1 text-white dark:bg-secondary-2 dark:text-black"
                        onClick={() => setEditable((editable) => !editable)}
                      >
                        X
                      </button>
                    </>
                  ) : (
                    <button
                      className="rounded-lg bg-primary-2 p-1 text-white dark:bg-secondary-2 dark:text-black"
                      onClick={() => setEditable(true)}
                    >
                      Edit
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
                  <p className="m-1 font-semibold">{restaurant.city}</p>
                  <p className="m-1 font-semibold">{restaurant.address}</p>
                  <p className="m-1 font-semibold">{restaurant.postalIndex}</p>
                  <hr className="mx-auto my-2 w-4/5 border-primary dark:border-secondary" />
                  <p className="m-1 mt-4">
                    Tables:{" "}
                    <span className="font-semibold">
                      {restaurant.tables.length}
                    </span>
                  </p>
                  <hr className="mx-auto my-2 w-4/5 border-primary dark:border-secondary" />
                  <p className="m-1 mt-4">Description:</p>
                  <p className="m-1 font-semibold">{restaurant.description}</p>
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
                      {restaurant.provideDelivery ? "YES" : "NO"}
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
