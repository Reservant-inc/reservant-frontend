import React, { useEffect, useState } from 'react'
import { FetchError } from '../../../services/Errors'
import { fetchGET, fetchPOST } from '../../../services/APIconn'
import { useParams } from 'react-router-dom'
import { ComplaintUserInfo } from '../../../services/types'
import { CircularProgress, TextField } from '@mui/material'
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

const getImage = (photo: string | null, defaultImage: string) =>
  photo || defaultImage

const User: React.FC = () => {
  const [userInfo, setUserInfo] = useState<ComplaintUserInfo>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [banMessage, setBanMessage] = useState<string | null>(null)
  const [unbanMessage, setUnbanMessage] = useState<string | null>(null)

  const { userId } = useParams<{ userId: string }>()
  const { t } = useTranslation('global')

  useEffect(() => {
    if (userId) fetchUserData()
  }, [userId])

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

  const handleBanUser = async (values: {
    days: number
    hours: number
    minutes: number
  }) => {
    try {
      const timeSpan = `${values.days}.${values.hours}:${values.minutes}:00.0`
      const payload = { timeSpan }
      await fetchPOST(`/users/${userId}/ban`, JSON.stringify(payload))

      const parts = []
      if (values.days > 0)
        parts.push(
          `${values.days} ${t('customer-service.user.ban_duration.days')}`
        )
      if (values.hours > 0)
        parts.push(
          `${values.hours} ${t('customer-service.user.ban_duration.hours')}`
        )
      if (values.minutes > 0)
        parts.push(
          `${values.minutes} ${t('customer-service.user.ban_duration.minutes')}`
        )
      const message = `${t(
        'customer-service.user.ban_user_message_prefix'
      )} ${userInfo?.firstName} ${userInfo?.lastName} ${t(
        'customer-service.user.ban_user_message_suffix'
      )} ${parts.join(' ')}.`

      setBanMessage(message)
    } catch (error) {
      console.error('Error banning user:', error)
    }
  }

  const handleUnbanUser = async () => {
    try {
      await fetchPOST(`/users/${userId}/unban`, {})
      setUnbanMessage(
        `${t('customer-service.user.ban_user_message_prefix')} ${
          userInfo?.firstName
        } ${userInfo?.lastName} ${t('customer-service.user.unban_user_message')}`
      )
    } catch (error) {
      console.error('Error unbanning user:', error)
      setUnbanMessage(null)
    }
  }

  return (
    <div className="z-[0] flex h-full w-full items-center justify-center gap-2 bg-grey-1 dark:bg-grey-6">
      <div className="flex flex-col gap-2 h-full w-1/2">
        <div className="flex h-FIT w-full self-start flex-col bg-white rounded-lg p-4 gap-4 shadow-md">
          <div className="flex justify-between w-full">
            <h1 className="text-lg font-mont-bd">
              {t('customer-service.user.account')}
            </h1>
            <div className="flex gap-2">
              <button
                className="border-[1px] rounded-lg p-1 text-primary hover:bg-primary hover:text-white"
                onClick={() => setIsDialogOpen(true)}
              >
                <GavelIcon className="w-4 h-4" />
                <span>{t('customer-service.user.ban_user')}</span>
              </button>
              <button
                className="border-[1px] rounded-lg p-1 text-primary hover:bg-primary hover:text-white"
                onClick={handleUnbanUser}
              >
                <DeleteForeverIcon className="w-4 h-4" />
                <span>{t('customer-service.user.unban_user')}</span>
              </button>
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
                    <h1 className="text-md">{userInfo.phoneNumber?.number}</h1>
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
        </div>

        <div className="h-full w-full bg-white rounded-lg shadow-md p-4">
          <h1 className="font-mont-bd text-lg">
            {t('customer-service.user.transaction_history')}
          </h1>
          <TransactionHistory listType={TransactionListType.CustomerService} />
        </div>
      </div>

      <div className="flex flex-col gap-2 h-full w-1/2">
        <div className="h-full w-full bg-white rounded-lg shadow-md p-4 flex flex-col gap-2">
          <div className="h-[2rem]">
            <h1 className="font-mont-bd text-lg">
              {t('customer-service.user.related_complaints')}
            </h1>
          </div>
          <div className="h-[calc(100%-2rem)]">
            <ReportsList listType={ReportsListType.CustomerService} />
          </div>
        </div>
      </div>

      {/* Ban User Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setBanMessage(null)
        }}
        title={`${t('customer-service.user.ban_user_dialog_title')} ${
          userInfo?.firstName || ''
        } ${userInfo?.lastName || ''}`}
      >
        {banMessage ? (
          <div className="p-4 flex flex-col justify-between gap-4 min-h-[150px]">
            <p className="font-mont-bd">{banMessage}</p>
            <div className="flex justify-end">
              <button
                className="text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md p-3 bg-white text-primary transition"
                onClick={() => {
                  setIsDialogOpen(false)
                  setBanMessage(null)
                }}
              >
                {t('customer-service.user.close')}
              </button>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={{ days: 0, hours: 0, minutes: 0 }}
            validationSchema={Yup.object({
              days: Yup.number()
                .min(0, t('customer-service.user.ban_duration_error.days_min'))
                .required(t('customer-service.user.ban_duration.days')),
              hours: Yup.number()
                .min(
                  0,
                  t('customer-service.user.ban_duration_error.hours_range')
                )
                .max(
                  23,
                  t('customer-service.user.ban_duration_error.hours_range')
                )
                .required(t('customer-service.user.ban_duration.hours')),
              minutes: Yup.number()
                .min(
                  1,
                  t('customer-service.user.ban_duration_error.minutes_range')
                )
                .max(
                  59,
                  t('customer-service.user.ban_duration_error.minutes_range')
                )
                .required(t('customer-service.user.ban_duration.minutes'))
            })}
            onSubmit={(values, { resetForm }) => {
              handleBanUser(values)
              resetForm()
            }}
          >
            {formik => {
              const isBanDisabled =
                (formik.values.days === 0 &&
                  formik.values.hours === 0 &&
                  formik.values.minutes === 0) ||
                Object.keys(formik.errors).length > 0

              return (
                <Form>
                  <div className="flex flex-col gap-4 p-3 min-h-[330px] min-w-[300px]">
                    {/* Days */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="days" className="text-sm font-medium">
                        {t('customer-service.user.ban_duration.days')}
                      </label>
                      <Field
                        as={TextField}
                        name="days"
                        id="days"
                        type="number"
                        fullWidth
                        sx={{ height: 40 }}
                        error={
                          formik.touched.days && Boolean(formik.errors.days)
                        }
                        helperText={formik.touched.days && formik.errors.days}
                        className={`${
                          !(formik.touched.days && formik.errors.days)
                            ? 'border-black dark:border-white'
                            : 'border-red dark:border-red'
                        }`}
                      />
                    </div>

                    {/* Hours */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="hours" className="text-sm font-medium">
                        {t('customer-service.user.ban_duration.hours')}
                      </label>
                      <Field
                        as={TextField}
                        name="hours"
                        id="hours"
                        type="number"
                        fullWidth
                        sx={{ height: 40 }}
                        error={
                          formik.touched.hours && Boolean(formik.errors.hours)
                        }
                        helperText={formik.touched.hours && formik.errors.hours}
                        className={`${
                          !(formik.touched.hours && formik.errors.hours)
                            ? 'border-black dark:border-white'
                            : 'border-red dark:border-red'
                        }`}
                      />
                    </div>

                    {/* Minutes */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="minutes" className="text-sm font-medium">
                        {t('customer-service.user.ban_duration.minutes')}
                      </label>
                      <Field
                        as={TextField}
                        name="minutes"
                        id="minutes"
                        type="number"
                        fullWidth
                        sx={{ height: 40 }}
                        error={
                          formik.touched.minutes &&
                          Boolean(formik.errors.minutes)
                        }
                        helperText={
                          formik.touched.minutes && formik.errors.minutes
                        }
                        className={`${
                          !(formik.touched.minutes && formik.errors.minutes)
                            ? 'border-black dark:border-white'
                            : 'border-red dark:border-red'
                        }`}
                      />
                    </div>

                    {isBanDisabled &&
                      formik.values.days === 0 &&
                      formik.values.hours === 0 &&
                      formik.values.minutes === 0 && (
                        <p className="text-red text-sm">
                          {t(
                            'customer-service.user.ban_duration_error.min_duration'
                          )}
                        </p>
                      )}
                  </div>

                  <div className="flex justify-end gap-4 p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDialogOpen(false)
                        setBanMessage(null)
                        formik.resetForm()
                      }}
                      className="text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md p-3 bg-white text-primary transition"
                    >
                      {t('customer-service.user.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={formik.isSubmitting || isBanDisabled}
                      className={`text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md px-3 py-2 bg-white text-primary transition ${
                        isBanDisabled ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {t('customer-service.user.ban_user')}
                    </button>
                  </div>
                </Form>
              )
            }}
          </Formik>
        )}
      </Dialog>
      {/* Unban User Dialog */}
      <Dialog
        open={!!unbanMessage}
        onClose={() => setUnbanMessage(null)}
        title={t('customer-service.user.unban_user_dialog_title')}
      >
        <div className="p-4 flex flex-col justify-between min-h-[150px]">
          <p className="font-mont-bd">{unbanMessage}</p>
          <div className="flex justify-end">
            <button
              className="text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md p-3 bg-white text-primary transition"
              onClick={() => setUnbanMessage(null)}
            >
              {t('customer-service.user.close')}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default User
