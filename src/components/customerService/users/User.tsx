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
import * as Yup from 'yup'
import TransactionHistory from '../../reservant/profile/TransactionHisotry'
import { TransactionListType } from '../../../services/enums'

const getImage = (photo: string | null, defaultImage: string) =>
  photo || defaultImage

const User: React.FC = () => {
  const [userInfo, setUserInfo] = useState<ComplaintUserInfo>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [banMessage, setBanMessage] = useState<string | null>(null)
  const [unbanMessage, setUnbanMessage] = useState<string | null>(null)

  const { userId } = useParams<{ userId: string }>()

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
        parts.push(`${values.days} day${values.days > 1 ? 's' : ''}`)
      if (values.hours > 0)
        parts.push(`${values.hours} hour${values.hours > 1 ? 's' : ''}`)
      if (values.minutes > 0)
        parts.push(`${values.minutes} minute${values.minutes > 1 ? 's' : ''}`)
      const message = `User ${userInfo?.firstName} ${userInfo?.lastName} was banned for ${parts.join(
        ' '
      )}.`

      setBanMessage(message)
    } catch (error) {
      console.error('Error banning user:', error)
    }
  }

  const handleUnbanUser = async () => {
    try {
      await fetchPOST(`/users/${userId}/unban`, {})
      setUnbanMessage(
        `User ${userInfo?.firstName} ${userInfo?.lastName} was unbanned.`
      )
    } catch (error) {
      console.error('Error unbanning user:', error)
      setUnbanMessage(null)
    }
  }

  return (
    <div className="z-[0] flex h-full w-full items-center justify-center gap-2 bg-grey-1 dark:bg-grey-6">
      <div className="flex flex-col gap-2 h-full w-1/2">
        {/* User details */}
        <div className="flex h-FIT w-full self-start flex-col bg-white rounded-lg p-4 gap-4 shadow-md">
          <div className="flex justify-between w-full">
            <h1 className="text-lg font-mont-bd">Account</h1>
            <div className="flex gap-2">
              <button
                className="border-[1px] rounded-lg p-1 text-primary hover:bg-primary hover:text-white"
                onClick={() => setIsDialogOpen(true)}
              >
                <GavelIcon className="w-4 h-4" />
                <span>Ban User</span>
              </button>
              <button
                className="border-[1px] rounded-lg p-1 text-primary hover:bg-primary hover:text-white"
                onClick={handleUnbanUser}
              >
                <DeleteForeverIcon className="w-4 h-4" />
                <span>Unban User</span>
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
                    <h1>Name: </h1>
                    <h1 className="text-md">{userInfo.firstName}</h1>
                  </div>
                  <div className="flex gap-2 items-center">
                    <h1>Last name: </h1>
                    <h1 className="text-md">{userInfo.lastName}</h1>
                  </div>
                  <div className="flex gap-2 items-center">
                    <h1>Phone number: </h1>
                    <h1 className="text-md">{userInfo.phoneNumber?.number}</h1>
                  </div>
                  <div className="flex gap-2 items-center">
                    <h1>Birth date: </h1>
                    <h1 className="text-md">{userInfo.birthDate}</h1>
                  </div>
                  <div className="flex gap-2 items-center">
                    <h1>Login: </h1>
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
          <h1 className="font-mont-bd text-lg">Transaction history</h1>
          <TransactionHistory listType={TransactionListType.CustomerService} />
        </div>
      </div>

      <div className="flex flex-col gap-2 h-full w-1/2">
        <div className="h-full w-full bg-white rounded-lg shadow-md p-4">
          <h1 className="font-mont-bd text-lg">Related complaints</h1>
        </div>
        <div className="h-full w-full bg-white rounded-lg shadow-md p-4">
          <h1 className="font-mont-bd text-lg">Visit history?</h1>
        </div>
      </div>

      {/* Ban User Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setBanMessage(null)
        }}
        title={`Ban User ${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`}
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
                Close
              </button>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={{ days: 0, hours: 0, minutes: 0 }}
            validationSchema={Yup.object({
              days: Yup.number()
                .min(0, 'Days must be 0 or more')
                .required('Days are required'),
              hours: Yup.number()
                .min(0, 'Hours must be between 0 and 23')
                .max(23, 'Hours must be between 0 and 23')
                .required('Hours are required'),
              minutes: Yup.number()
                .min(0, 'Minutes must be between 0 and 59')
                .max(59, 'Minutes must be between 0 and 59')
                .required('Minutes are required')
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
                        Days
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
                        Hours
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
                        Minutes
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
                          Ban must last at least 1 minute.
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
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formik.isSubmitting || isBanDisabled}
                      className={`text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md px-3 py-2 bg-white text-primary transition ${
                        isBanDisabled ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Ban
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
        title="Unban User"
      >
        <div className="p-4 flex flex-col justify-between min-h-[150px]">
          <p className="font-mont-bd">{unbanMessage}</p>
          <div className="flex justify-end">
            <button
              className="text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md p-3 bg-white text-primary transition"
              onClick={() => setUnbanMessage(null)}
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default User
