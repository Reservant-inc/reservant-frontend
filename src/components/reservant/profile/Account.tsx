import React, { useEffect, useState } from 'react'
import { FetchError } from '../../../services/Errors'
import {
  fetchDELETE,
  fetchFilesPOST,
  fetchGET,
  fetchPOST,
  fetchPUT,
  getImage
} from '../../../services/APIconn'
import { UserType } from '../../../services/types'
import { styled } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DefaultImage from '../../../assets/images/user.jpg'
import { Form, Formik, Field, FormikValues } from 'formik'
import * as yup from 'yup'
import EditSharpIcon from '@mui/icons-material/EditSharp'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Dialog from '../../reusableComponents/Dialog'
import ErrorMes from '../../reusableComponents/ErrorMessage'
import { Key, Visibility, VisibilityOff } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import TransactionHistory from './TransactionHistory'
import { useNavigate } from 'react-router-dom'
import { TransactionListType } from '../../../services/enums'
import { logoutAction } from '../../auth/auth'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const Account: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserType>({} as UserType)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [photoFileName, setPhotoFileName] = useState<string>(userInfo.photo)
  const [photoPath, setPhotoPath] = useState<string>('')
  const [isChangingPass, setIsChangingPass] = useState<boolean>(false)
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState<boolean>(false)
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState<boolean>(false)
  const [deleteAccountCountdown, setDeleteAccountCountdown] =
    useState<number>(5)
  const [isDeleteAccountDisabled, setIsDeleteAccountDisabled] =
    useState<boolean>(true)
  const [generalError, setGeneralError] = useState<string | null>(null)

  const navigate = useNavigate()
  const [t] = useTranslation('global')

  const UserEditSchema = yup.object({
    phoneNumber: yup
      .string()
      .required(t('errors.user-register.phoneNumber.required'))
      .matches(/^\+\d{11}$/, t('errors.user-register.phoneNumber.matches')),
    firstName: yup
      .string()
      .required(t('errors.user-register.firstName.required'))
      .matches(
        /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
        t('errors.user-register.firstName.matches')
      ),
    lastName: yup
      .string()
      .required(t('errors.user-register.lastName.required'))
      .matches(
        /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
        t('errors.user-register.lastName.matches')
      )
  })

  const initialValues = {
    phoneNumber: `${userInfo.phoneNumber?.code || ''}${userInfo.phoneNumber?.number || ''}`,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName
  }

  const passValues = {
    oldPassword: '',
    newPassword: '',
    repeatPassword: ''
  }
  const passEditSchema = yup.object({
    oldPassword: yup
      .string()
      .required(t('errors.user-register.oldPassword.required')),
    newPassword: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        t('errors.user-register.password.matches')
      )
      .required(t('errors.user-register.password.required')),

    repeatPassword: yup
      .string()
      .oneOf(
        [yup.ref('newPassword'), ''],
        t('errors.user-register.confirmPassword.matches')
      )
      .required(t('errors.user-register.confirmPassword.required'))
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  useEffect(() => {
    if (isDeleteAccountDialogOpen) {
      setDeleteAccountCountdown(5)
      setIsDeleteAccountDisabled(true)

      const timer = setInterval(() => {
        setDeleteAccountCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            setIsDeleteAccountDisabled(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    } else {
      return undefined
    }
  }, [isDeleteAccountDialogOpen])

  const handleDeleteAccount = async () => {
    try {
      await fetchDELETE(`/user`)
      logoutAction()
      navigate('/')
    } catch (error) {
      console.error('Error deleting account:', error)
    } finally {
      setIsDeleteAccountDialogOpen(false)
    }
  }

  const fetchUserData = async () => {
    try {
      const user = await fetchGET('/user')
      setUserInfo(user)
    } catch (error) {
      if (error instanceof FetchError) console.error(error.formatErrors())
      else console.error(error)
    }
  }
  const uploadPhoto = async (photoFile: File) => {
    try {
      const res = await fetchFilesPOST('/uploads', photoFile)
      setPhotoPath(res.path)
      setPhotoFileName(res.fileName)
    } catch (error) {
      if (error instanceof FetchError) console.log(error.formatErrors())
      else console.log('Unexpected error')
    }
  }

  const updateUserData = async (userData: any) => {
    try {
      const phoneNumber = userData.phoneNumber || ''
      const code = phoneNumber.slice(0, 3) // Pobiera pierwsze trzy znaki jako kod kraju
      const number = phoneNumber.slice(3) // Pobiera resztę numeru

      await fetchPUT(
        '/user',
        JSON.stringify({
          phoneNumber: { code, number },
          firstName: userData.firstName,
          lastName: userData.lastName,
          birthDate: '1999-12-31',
          photo: photoFileName
        })
      )
    } catch (error) {
      if (error instanceof FetchError) console.log(error.formatErrors())
      else console.log(error)
    } finally {
      setIsEditing(false)
      fetchUserData()
    }
  }

  const openChangePassDialog = () => {
    setGeneralError(null)
    setIsChangingPass(true)
  }

  const updatePass = async (
    values: FormikValues,
    setFieldError: any,
    setFieldValue: any
  ) => {
    try {
      await fetchPOST(
        '/auth/change-password',
        JSON.stringify({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword
        })
      )
      alert('Password changed')
      setGeneralError(null)
      setIsChangingPass(false)
    } catch (error: any) {
      if (error.response) {
        const response = await error.response.json()

        // jeżeli jest błąd oldPassword:
        if (response?.errors?.oldPassword?.includes('Incorrect password')) {
          setFieldError('oldPassword', t('errors.incorrectOldPassword'))
          setFieldValue('oldPassword', '')
          setGeneralError(t('errors.user-register.oldPassword.no-match'))
          return
        }
      }

      setFieldValue('oldPassword', '')
      setGeneralError(t('errors.user-register.oldPassword.no-match'))
      // console.error('Unexpected error:', error);
    }
  }

  const formatDate = (timestamp: string): string => {
    return format(new Date(timestamp), 'yyyy-MM-dd, HH:mm')
  }

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex h-[250px] flex-col w-full bg-white dark:bg-black dark:text-grey-1 rounded-lg p-4 gap-4 shadow-md">
        <div className="flex justify-between w-full">
          <h1 className="text-lg font-mont-bd">{t('profile.account')}</h1>
          <div className="flex gap-2">
            {/* <button
              className="flex items-center justify-center gap-1 px-4 text-sm border-[1px] rounded-lg p-1 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
              onClick={() => setIsChangingPass(prev => !prev)}
            > */}
            <button
              className="flex items-center justify-center gap-1 px-4 text-sm border-[1px] rounded-lg p-1 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
              onClick={openChangePassDialog}
            >
              <>
                <Key className="w-4 h-4" />
                <h1 className="text-nowrap">{t('profile.change-password')}</h1>
              </>
            </button>
            <button
              className="flex items-center justify-center gap-1 px-4 text-sm border-[1px] rounded-lg p-1 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
              onClick={() => setIsEditing(prev => !prev)}
            >
              <>
                <EditSharpIcon className="w-4 h-4" />
                <h1 className="text-nowrap">{t('profile.edit-data')}</h1>
              </>
            </button>
            <button
              className="flex items-center justify-center gap-1 px-4 text-sm border-[1px] rounded-lg p-1 border-red text-red transition hover:scale-105 hover:bg-red hover:text-white dark:border-red dark:text-red dark:hover:bg-red dark:hover:text-white"
              onClick={() => setIsDeleteAccountDialogOpen(true)}
            >
              <DeleteForeverIcon className="w-4 h-4" />
              <h1 className="text-nowrap">
                {t('profile.delete-account-button')}
              </h1>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full">
          <img
            src={getImage(userInfo.photo, DefaultImage)}
            className="h-32 w-32 rounded-full"
          />

          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2 items-center">
              <h1>{t('profile.first-name')}: </h1>
              <h1 className="text-md">{userInfo.firstName}</h1>
            </div>
            <div className="flex gap-2 items-center">
              <h1>{t('profile.last-name')}: </h1>
              <h1 className="text-md">{userInfo.lastName}</h1>
            </div>
            <div className="flex gap-2 items-center">
              <h1>{t('profile.phone-number')}: </h1>
              <h1 className="text-md">
                {userInfo.phoneNumber?.code} {userInfo.phoneNumber?.number}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white h-[calc(100%-250px)] dark:bg-black dark:text-grey-1 w-full rounded-lg p-4 shadow-md">
        <TransactionHistory listType={TransactionListType.Client} />
      </div>

      {/* Delete Account Dialog */}
      <Dialog
        open={isDeleteAccountDialogOpen}
        onClose={() => setIsDeleteAccountDialogOpen(false)}
        title={t('customer-service.user.delete_account_dialog_title')}
      >
        <div className="dark:text-white p-4 flex flex-col justify-between min-h-[150px]">
          <p className="font-mont-bd">
            {t('customer-service.user.delete_account_confirmation')}
          </p>
          <p className="font-mont-md text-red">
            {t('profile.delete_account_cannot_undone')}
          </p>
          <div className="flex justify-end gap-4">
            <button
              className="text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md p-3 bg-white text-primary transition"
              onClick={() => setIsDeleteAccountDialogOpen(false)}
            >
              {t('customer-service.user.cancel')}
            </button>
            <button
              className={`text-sm border-red hover:scale-105 hover:bg-red hover:text-white dark:hover:scale-105 dark:hover:bg-red dark:hover:text-white dark:bg-black border-[1px] rounded-md p-3 bg-white text-red transition ${
                isDeleteAccountDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleDeleteAccount}
              disabled={isDeleteAccountDisabled}
            >
              {t('customer-service.user.delete')}{' '}
              {isDeleteAccountDisabled && `(${deleteAccountCountdown})`}
            </button>
          </div>
        </div>
      </Dialog>

      {isEditing && (
        <Dialog
          open={isEditing}
          onClose={() => setIsEditing(false)}
          title={t('profile.editing-user')}
        >
          <div className="w-[650px] h-fit p-6 flex  justify-between">
            <div
              className="relative min-w-64 min-h-64 flex "
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                className="h-64 w-64 absolute rounded-full"
                src={getImage(photoPath, DefaultImage)}
              />
              {isHovered && (
                <div className="bg-semi-trans w-64 h-64 absolute flex items-center justify-center rounded-full">
                  <label
                    htmlFor="photo"
                    className={
                      'shadow hover:cursor-pointer self-center h-12 w-12 justify-center items-center gap-1 flex rounded-full p-1 dark:bg-grey-5 bg-grey-0 dark:text-secondary text-primary dark:text-secondary  dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary  '
                    }
                  >
                    <CloudUploadIcon />
                  </label>
                </div>
              )}
              <VisuallyHiddenInput
                type="file"
                id="photo"
                accept="image/*"
                onChange={e => {
                  if (e.target.files && e.target.files.length > 0) {
                    uploadPhoto(e.target.files[0])
                  }
                }}
              />
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={UserEditSchema}
              enableReinitialize
              onSubmit={(values, { setSubmitting }) => {
                updateUserData(values)
                setSubmitting(false)
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="flex justify-center min-h-64">
                  <div className="flex justify-between flex-col w-full gap-2">
                    <div className="flex-col gap-2 flex w-[320px]">
                      <>
                        <div
                          className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${errors.firstName && touched.firstName ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                        >
                          <label htmlFor="name">
                            {t('profile.first-name')}:
                          </label>
                          <Field
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="w-full "
                          />
                          <label>*</label>
                        </div>
                        {errors.firstName && touched.firstName && (
                          <ErrorMes msg={errors.firstName} />
                        )}
                      </>

                      <>
                        <div
                          className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${errors.lastName && touched.lastName ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                        >
                          <label htmlFor="name">
                            {t('profile.last-name')}:
                          </label>
                          <Field
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="w-full "
                          />
                          <label>*</label>
                        </div>
                        {errors.lastName && touched.lastName && (
                          <ErrorMes msg={errors.lastName} />
                        )}
                      </>
                      <>
                        <div
                          className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${errors.phoneNumber && touched.phoneNumber ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                        >
                          <label htmlFor="name">
                            {t('profile.phone-number')}:
                          </label>
                          <Field
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            className="w-full "
                          />
                          <label>*</label>
                        </div>
                        {errors.phoneNumber && touched.phoneNumber && (
                          <ErrorMes msg={errors.phoneNumber} />
                        )}
                      </>
                    </div>
                    <button
                      className="border-[1px]  self-center  px-2 h-8 w-[200px] text-sm rounded-lg p-1 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? `${t('profile.saving-changes')}`
                        : `${t('profile.save-changes')}`}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Dialog>
      )}

      {isChangingPass && (
        <Dialog
          open={isChangingPass}
          onClose={() => setIsChangingPass(false)}
          title={t('profile.changing-pass')}
        >
          <div className="w-[650px] h-[300px] p-6">
            <Formik
              initialValues={passValues}
              validationSchema={passEditSchema}
              enableReinitialize
              onSubmit={(
                values,
                { setSubmitting, setFieldError, setFieldValue }
              ) => {
                updatePass(values, setFieldError, setFieldValue)
                setSubmitting(false)
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="flex justify-center h-full">
                  <div className="flex justify-between flex-col w-full">
                    <div className="flex-col gap-2 flex w-full">
                      <div>
                        <div
                          className={`relative flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${
                            errors.oldPassword && touched.oldPassword
                              ? 'border-error text-error'
                              : 'border-black text-black dark:text-grey-1 dark:border-white'
                          }`}
                        >
                          <label htmlFor="oldPassword">
                            {t('profile.old-pass')}:
                          </label>
                          <Field
                            type={showOldPassword ? 'text' : 'password'}
                            id="oldPassword"
                            name="oldPassword"
                            className="w-full"
                          />
                          <span
                            id="showPassOld"
                            className="absolute text-grey-2 right-0 top-1/4 cursor-pointer dark:text-grey-0 hover:text-primary"
                            onClick={() => {
                              setShowOldPassword(prev => !prev)
                            }}
                          >
                            {showOldPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </span>
                        </div>
                        {errors.oldPassword && touched.oldPassword && (
                          <ErrorMes msg={errors.oldPassword} />
                        )}
                      </div>

                      <div>
                        <div
                          className={`relative flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${
                            errors.newPassword && touched.newPassword
                              ? 'border-error text-error'
                              : 'border-black text-black dark:text-grey-1 dark:border-white'
                          }`}
                        >
                          <label htmlFor="newPassword">
                            {t('profile.new-pass')}:
                          </label>
                          <Field
                            type={showNewPassword ? 'text' : 'password'}
                            id="newPassword"
                            name="newPassword"
                            className="w-full"
                          />
                          <span
                            id="showPassNew"
                            className="absolute text-grey-2 right-0 top-1/4 cursor-pointer dark:text-grey-0 hover:text-primary"
                            onClick={() => {
                              setShowNewPassword(prev => !prev)
                            }}
                          >
                            {showNewPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </span>
                        </div>
                        {errors.newPassword && touched.newPassword && (
                          <ErrorMes msg={errors.newPassword} />
                        )}
                      </div>
                      <div>
                        <div
                          className={`relative flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${
                            errors.repeatPassword && touched.repeatPassword
                              ? 'border-error text-error'
                              : 'border-black text-black dark:text-grey-1 dark:border-white'
                          }`}
                        >
                          <label htmlFor="repeatPassword">
                            {t('profile.repeat-pass')}:
                          </label>
                          <Field
                            type={showRepeatPassword ? 'text' : 'password'}
                            id="repeatPassword"
                            name="repeatPassword"
                            className="w-full"
                          />
                          <span
                            id="showPassRep"
                            className="absolute text-grey-2 right-0 top-1/4 cursor-pointer dark:text-grey-0 hover:text-primary"
                            onClick={() => {
                              setShowRepeatPassword(prev => !prev)
                            }}
                          >
                            {showRepeatPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </span>
                        </div>
                        {errors.repeatPassword && touched.repeatPassword && (
                          <ErrorMes msg={errors.repeatPassword} />
                        )}
                      </div>
                    </div>

                    {/* error pod formularzem */}
                    {generalError && (
                      <div className="text-error text-center my-4">
                        {generalError}
                      </div>
                    )}
                    <button
                      className="border-[1px] self-center px-2 h-8 w-[200px] text-sm rounded-lg p-1 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? `${t('profile.saving-changes')}`
                        : `${t('profile.save-changes')}`}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Dialog>
      )}
    </div>
  )
}

export default Account
