import React, { useEffect, useState } from "react";
import { FetchError } from "../../services/Errors";
import { fetchGET, fetchPUT, getImage } from "../../services/APIconn";
import { UserType } from "../../services/types";
import DefaultImage from '../../assets/images/user.jpg'
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { TextField } from "@mui/material";

const UserEditSchema = yup.object({
  phoneNumber: yup.string()
    .required('Phone number is required')
    .matches(/^\+\d{11}$/, 'Phone number must be in international format (e.g., +48123456789)'),
  firstName: yup.string()
    .required('First name is required')
    .min(2, 'First name should be at least 2 characters'),
  lastName: yup.string()
    .required('Last name is required')
    .min(2, 'Last name should be at least 2 characters'),
});

const Account: React.FC = () => {
  
  const [userInfo, setUserInfo] = useState<UserType>({} as UserType)
  
  const initialValues = {
    phoneNumber: userInfo.phoneNumber,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName
  };

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const user = await fetchGET('/user')
      setUserInfo(user)
    } catch (error) {
      if (error instanceof FetchError)
        console.log(error.formatErrors())
      else 
        console.log(error)
    }
  }

  const updateUserData = async (userData: any) => {

    console.log('test')

    try {
      const response = await fetchPUT('/user', JSON.stringify({
        phoneNumber: userData.phoneNumber,
        firstName: userData.firstName,
        lastName: userData.lastName,
        birthDate: "1999-12-31",
        photo: userInfo.photo
      }))

      console.log(response)

    } catch (error) {
      if (error instanceof FetchError)
        console.log(error.formatErrors())
      else 
        console.log(error)
    } finally {
      fetchUserData()
    }
  }

  return (
    <div className="flex h-full gap-2">
      <div className="flex h-fit flex-col w-1/2 bg-white rounded-lg p-4 gap-4">
        <div className="flex justify-between w-full">
          <h1 className="text-lg font-mont-bd">Account</h1>
          <button
            className="px-2 pr-2 w-[150px] text-sm border-[1px] rounded-lg p-1 border-error text-error transition hover:scale-105 hover:bg-error hover:text-white"
          >
            Delete account
          </button>
        </div>
        <div className="flex items-center justify-between gap-4 w-full">
          <img src={getImage(userInfo.photo, DefaultImage)} className="h-44 w-44 rounded-full"/>
          <Formik
            initialValues={initialValues}
            validationSchema={UserEditSchema}
            enableReinitialize
            onSubmit={(values, { setSubmitting }) => {
              updateUserData(values)
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <div className="flex-col gap-2 flex w-full">
                  <div className="flex items-center justify-between items-end gap-2">
                    <label htmlFor="phoneNumber" className="text-sm p-0">Phone Number</label>
                    <Field name="phoneNumber" type="text" as={TextField} error={touched.phoneNumber && Boolean(errors.phoneNumber)} className="w-[150px]"/>
                  </div>

                  <div className="flex items-center justify-between items-end gap-2">
                    <label htmlFor="firstName" className="text-sm p-0">First Name</label>
                    <Field name="firstName" type="text" as={TextField} error={touched.firstName && Boolean(errors.firstName)} className="w-[150px]"/>
                  </div>

                  <div className="flex items-center justify-between items-end gap-2">
                    <label htmlFor="lastName" className="text-sm p-0">Last Name</label>
                    <Field name="lastName" type="text" as={TextField} error={touched.lastName && Boolean(errors.lastName)} className="w-[150px]"/>
                  </div>

                  <button
                    className="border-[1px] self-end w-[150px] text-sm rounded-lg p-1 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                    type="submit" disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="bg-white w-1/2 h-[70%] rounded-lg p-4">
        <h1 className="text-lg font-mont-bd">Wallet</h1>

      </div>
    </div>
  )
};

export default Account;
