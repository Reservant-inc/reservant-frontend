import React, { useEffect, useState } from "react";
import { FetchError } from "../../services/Errors";
import { fetchGET, getImage } from "../../services/APIconn";
import { UserType } from "../../services/types";
import DefaultImage from '../../assets/images/user.jpg'
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-router-dom";
import * as yup from "yup";

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
    try {

    } catch (error) {
      if (error instanceof FetchError)
        console.log(error.formatErrors())
      else 
        console.log(error)
    }
  }

  return (
    <div className="flex flex-col h-full gap-2">
        <div className="flex flex-col bg-white rounded-lg p-4 gap-4">
          <div className="flex justify-between w-full">
            <h1 className="text-lg font-mont-bd">Account</h1>
            <button
              className="px-2 text-sm border-[1px] rounded-lg p-1 border-error text-error transition hover:scale-105 hover:bg-error hover:text-white"
            >
              Delete account
            </button>
          </div>
          <div className="flex items-center gap-4 w-full">
            <img src={getImage(userInfo.photo, DefaultImage)} className="h-44 w-44 rounded-lg"/>
            <Formik
              initialValues={initialValues}
              validationSchema={UserEditSchema}
              enableReinitialize
              onSubmit={(values, { setSubmitting }) => {
                updateUserData(values)

                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="flex-col flex gap-2 w-[350px]">
                    <div className="flex items-center justify-between">
                      <label htmlFor="phoneNumber" className="text-sm">Phone Number</label>
                      <Field name="phoneNumber" type="text" className='w-40 border-[1px] rounded-lg text-sm'/>
                      <ErrorMessage name="phoneNumber" component="div" className="error" />
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="firstName" className="text-sm">First Name</label>
                      <Field name="firstName" type="text" className='w-40 border-[1px] rounded-lg text-sm'/>
                      <ErrorMessage name="firstName" component="div" className="error" />
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="lastName" className="text-sm">Last Name</label>
                      <Field name="lastName" type="text" className='w-40 border-[1px] rounded-lg text-sm'/>
                      <ErrorMessage name="lastName" component="div" className="error" />
                    </div>

                    <button
                      className="border-[1px] rounded-lg p-1 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
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
        <div className="bg-white h-1/2 rounded-lg p-4">
          <h1 className="text-lg font-mont-bd">Wallet</h1>

        </div>
    </div>
  )
};

export default Account;
