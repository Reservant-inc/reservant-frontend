import React, { useEffect, useState } from 'react'
import { FetchError } from '../../../services/Errors'
import { fetchDELETE, fetchGET, fetchPOST } from '../../../services/APIconn'
import { useParams } from 'react-router-dom'
import { ComplaintUserInfo } from '../../../services/types'
import { CircularProgress } from '@mui/material'
import DefaultImage from '../../../assets/images/user.jpg'
import GavelIcon from '@mui/icons-material/Gavel'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { Formik, Form, Field } from 'formik'
import Dialog from '../../reusableComponents/Dialog'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import TransactionHistory from '../../reservant/profile/TransactionHistory'
import { ReportsListType, TransactionListType } from '../../../services/enums'
import ReportsList from '../../reservant/profile/reports/ReportsList'
import ReviewsList from '../../reservant/restaurantManagement/restaurants/restaurantReviews/ReviewsList'
import { Snackbar, Alert } from '@mui/material'

const getImage = (photo: string | null, defaultImage: string) =>
  photo || defaultImage

const User: React.FC = () => {
  const [userInfo, setUserInfo] = useState<ComplaintUserInfo>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [deleteCountdown, setDeleteCountdown] = useState<number>(5)
  const [isDeleteDisabled, setIsDeleteDisabled] = useState<boolean>(true)
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [unbanSnackbarOpen, setUnbanSnackbarOpen] = useState<boolean>(false)
  const [snackbarBanManager, setSnackbarBanManager] = useState<boolean>(false)
  const [snackbarUserDeleted, setSnackbarUserDeleted] = useState<boolean>(false)
  const [snackbarUserDeleteAccessDenied, setSnackbarUserDeleteAccessDenied] = useState<boolean>(false)

  const { userId } = useParams<{ userId: string }>()
  const { t } = useTranslation('global')

  useEffect(() => {
    if (userId) fetchUserData()
  }, [userId])

  useEffect(() => {
    if (isDeleteDialogOpen) {
      setDeleteCountdown(5)
      setIsDeleteDisabled(true)

      const timer = setInterval(() => {
        setDeleteCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            setIsDeleteDisabled(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    } else {
      return undefined
    }
  }, [isDeleteDialogOpen])

  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      const response = await fetchGET(`/users/${userId}`)
      setUserInfo(response)
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    try {
      await fetchDELETE(`/users/${userId}`)
      setSnackbarUserDeleted(true)
    } catch (error) {
      if (error instanceof FetchError) {
        // const errors = error.formatErrors()
        if (error.status === 400) {
          setSnackbarUserDeleteAccessDenied(true)
        } else {
          // console.error(errors)
        }
      }
    } finally {
      setIsDeleteDialogOpen(false)
      fetchUserData()
    }
  }

  const handleBanUser = async (values: {
    days: number
    hours: number
    minutes: number
  }) => {
    try {
      const timeSpan = `${values.days}.${values.hours}:${values.minutes}:00.0`
      const payload = { timeSpan }
      await fetchPOST(`/users/${userId}/ban`, JSON.stringify(payload))
      setSnackbarOpen(true)
    } catch (error) {
        if (error instanceof FetchError) {
          // const errors = error.formatErrors()
          if (error.status === 400) {
            setSnackbarBanManager(true)
          } else {
            // console.error(errors)
          }
        }
    } finally {
      fetchUserData()
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleUnbanSnackbarClose = () => setUnbanSnackbarOpen(false)

  const handleSnackbarBanManagerClose = () => setSnackbarBanManager(false)

  const handleSnackbarUserDeletedClose = () => setSnackbarUserDeleted(false)

  const handleSnackbarUserDeleteAccessDeniedClose = () => setSnackbarUserDeleteAccessDenied(false)

  const handleUnbanUser = async () => {
    try {
      await fetchPOST(`/users/${userId}/unban`, {})
      setUnbanSnackbarOpen(true)
    } catch (error) {
      console.error('Error unbanning user:', error)
    } finally {
      fetchUserData()
    }
  }

  return (
    <div className="z-[0] flex h-full w-full items-center overflow-y-auto scroll justify-center gap-2 bg-grey-1 dark:bg-grey-6">
      <div className="flex flex-col gap-2 h-full w-1/2">
        <div className="flex h-[40%] w-full self-start flex-col bg-white dark:bg-black rounded-lg p-4 gap-4 shadow-md">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <CircularProgress className="text-grey-2" />
            </div>
          ) : (
            <>
              <div className="flex justify-between w-full">
                <h1 className="text-lg font-mont-bd">
                  {t('customer-service.user.account')}
                </h1>
                <div className="flex gap-2">
                  {userInfo?.phoneNumber === null ? (
                    <p className="text-sm text-grey-4 italic">
                      {t('customer-service.user.account_deleted')}
                    </p>
                  ) : (
                    <>
                      {userInfo?.bannedUntil ? (
                        <button
                          className="border-[1px] rounded-lg p-1 text-primary dark:border-secondary dark:text-secondary hover:text-black dark:hover:text-white dark:hover:border-white"
                          onClick={handleUnbanUser}
                        >
                          <DeleteForeverIcon className="w-4 h-4" />
                          <span>{t('customer-service.user.unban_user')}</span>
                        </button>
                      ) : (
                        <button
                          className="border-[1px] rounded-lg p-1 text-primary dark:text-secondary dark:hover:text-white hover:text-black"
                          onClick={() => setIsDialogOpen(true)}
                        >
                          <GavelIcon className="w-4 h-4" />
                          <span>{t('customer-service.user.ban_user')}</span>
                        </button>
                      )}
                      <button
                        className="border-[1px] rounded-lg p-1 text-red  dark:hover:text-white hover:text-black"
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        <DeleteForeverIcon className="w-4 h-4" />
                        <span>{t('customer-service.user.delete_user')}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 w-full">
                {userInfo ? (
                  <>
                    <img
                      src={getImage(userInfo.photo, DefaultImage)}
                      alt="User Profile"
                      className="h-32 w-32 rounded-full"
                    />
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex gap-2 items-center">
                        <h1>{t('customer-service.user.name')}:</h1>
                        <h1 className="text-md">{userInfo.firstName}</h1>
                      </div>
                      <div className="flex gap-2 items-center">
                        <h1>{t('customer-service.user.last_name')}:</h1>
                        <h1 className="text-md">{userInfo.lastName}</h1>
                      </div>
                      <div className="flex gap-2 items-center">
                        <h1>{t('customer-service.user.phone_number')}:</h1>
                        <h1 className="text-md">
                          {userInfo.phoneNumber?.number}
                        </h1>
                      </div>
                      <div className="flex gap-2 items-center">
                        <h1>{t('customer-service.user.birth_date')}:</h1>
                        <h1 className="text-md">{userInfo.birthDate}</h1>
                      </div>
                      <div className="flex gap-2 items-center">
                        <h1>{t('customer-service.user.login')}:</h1>
                        <h1 className="text-md">{userInfo.login}</h1>
                      </div>
                    </div>
                  </>
                ) : (
                  <CircularProgress />
                )}
              </div>
            </>
          )}
        </div>

        <div className="h-[60%] w-full bg-white dark:bg-black rounded-lg shadow-md p-4">
          <TransactionHistory listType={TransactionListType.CustomerService} />
        </div>
      </div>

      <div className="flex flex-col gap-2 h-full w-1/2">
        <div className="h-full w-full bg-white dark:bg-black rounded-lg shadow-md p-4 flex flex-col gap-2">
          <div className="h-[2rem]">
            <h1 className="font-mont-bd text-lg">
              {t('customer-service.user.related_complaints')}
            </h1>
          </div>
          <div className="h-[calc(100%-2rem)]">
            <ReportsList listType={ReportsListType.CustomerService} />
          </div>
        </div>

        <div className="h-full w-full rounded-lg shadow-md p-4 flex flex-col gap-2 bg-white dark:bg-black">
          <div className="h-[2rem]">
            <h1 className="font-mont-bd text-lg">
              {t('customer-service.user.related-opinions')}
            </h1>
          </div>
          <div className="h-[calc(100%-2rem)]">
            <ReviewsList />
          </div>
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
        title={`${t('customer-service.user.ban_user_dialog_title')} ${userInfo?.firstName || ''} ${
          userInfo?.lastName || ''
        }`}
      >
        <Formik
          initialValues={{ timeValue: 1, timeUnit: 'Hours' }}
          validationSchema={Yup.object({
            timeValue: Yup.number()
              .min(1, t('customer-service.user.ban_duration_error.min_duration'))
              .required(t('customer-service.user.ban_duration.required'))
          })}
          onSubmit={(values, { resetForm }) => {
            handleBanUser({
              days: values.timeUnit === 'Days' ? values.timeValue : 0,
              hours: values.timeUnit === 'Hours' ? values.timeValue : 0,
              minutes: values.timeUnit === 'Minutes' ? values.timeValue : 0
            });

            setIsDialogOpen(false); 
            resetForm();
          }}
        >
          {formik => (
            <Form className="h-[200px] flex flex-col justify-between p-4">
              <div className="flex flex-col gap-4">
                <div
                  className={`flex items-center gap-4 p-2 border-2 rounded-md ${
                    formik.touched.timeValue && formik.errors.timeValue
                      ? 'border-red'
                      : 'border-primary dark:border-secondary'
                  }`}
                >
                  <Field
                    as="select"
                    name="timeUnit"
                    className="text-sm cursor-pointer rounded-md p-2 bg-white dark:bg-black dark:text-white w-1/2"
                  >
                    <option value="Minutes">{t('customer-service.user.ban_duration.minutes')}</option>
                    <option value="Hours">{t('customer-service.user.ban_duration.hours')}</option>
                    <option value="Days">{t('customer-service.user.ban_duration.days')}</option>
                  </Field>

                  <Field
                    name="timeValue"
                    type="number"
                    className="text-sm rounded-md p-2 bg-white dark:bg-black dark:text-white w-2/3"
                  />
                </div>

                {formik.touched.timeValue && formik.errors.timeValue && (
                  <p className="text-red text-sm mt-2">{formik.errors.timeValue}</p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md p-3 bg-white text-primary transition"
                >
                  {t('customer-service.user.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={formik.isSubmitting || !!formik.errors.timeValue}
                  className={`text-nowrap text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md px-3 py-2 bg-white text-primary transition ${
                    formik.errors.timeValue ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {t('customer-service.user.ban_user')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title={`${t('customer-service.user.delete_user_dialog_title')} ${
          userInfo?.firstName || ''
        } ${userInfo?.lastName || ''}`}
      >
        <div className="p-4 flex flex-col justify-between min-h-[150px]">
          <p className="font-mont-bd dark:text-white">
            {t('customer-service.user.delete_user_confirmation', {
              firstName: userInfo?.firstName,
              lastName: userInfo?.lastName
            })}
          </p>
          <div className="flex justify-end gap-4">
            <button
              className="text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md p-3 bg-white text-primary transition"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t('customer-service.user.cancel')}
            </button>
            <button
              className={`text-sm dark:border-red border-red hover:scale-105 hover:bg-red dark:hover:bg-red dark:hover:text-white hover:text-white dark:text-red dark:hover:bg-red dark:hover:text-black dark:bg-black border-[1px] rounded-md p-3 bg-white text-red transition ${
                isDeleteDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleDeleteUser}
              disabled={isDeleteDisabled}
            >
              {t('customer-service.user.delete')}{' '}
              {isDeleteDisabled && `(${deleteCountdown})`}
            </button>
          </div>
        </div>
      </Dialog>

      <Snackbar
        open={snackbarUserDeleteAccessDenied}
        autoHideDuration={5000}
        onClose={handleSnackbarUserDeleteAccessDeniedClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarUserDeleteAccessDeniedClose} severity="error" variant="filled">
          {t('snackbar.user-delete-access-denied')}
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackbarUserDeleted}
        autoHideDuration={5000}
        onClose={handleSnackbarUserDeletedClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarUserDeletedClose} severity="success" variant="filled">
          {t('snackbar.user-deleted')}
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" variant="filled">
          {t('snackbar.user-banned')}
        </Alert>
      </Snackbar>
      <Snackbar
        open={unbanSnackbarOpen}
        autoHideDuration={5000}
        onClose={handleUnbanSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleUnbanSnackbarClose} severity="success" variant="filled">
          {t('snackbar.user-unbanned')}
        </Alert>
      </Snackbar>
      <Snackbar
        open={snackbarBanManager}
        autoHideDuration={5000}
        onClose={handleSnackbarBanManagerClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarBanManagerClose} severity="error" variant="filled">
          {t('snackbar.ban-access-denied')}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default User
