import React, { useEffect, useState } from 'react'
import { FetchError } from '../../../services/Errors'
import { fetchGET, fetchPOST } from '../../../services/APIconn'
import { useParams, useNavigate } from 'react-router-dom'
import { ComplaintUserInfo } from '../../../services/types'
import { CircularProgress } from '@mui/material'
import DefaultImage from '../../../assets/images/user.jpg'
import GavelIcon from '@mui/icons-material/Gavel'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { Formik, Form, Field } from 'formik'
import Dialog from '../../reusableComponents/Dialog'

const getImage = (photo: string | null, defaultImage: string) =>
  photo || defaultImage

const User: React.FC = () => {
  const [userInfo, setUserInfo] = useState<ComplaintUserInfo>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [banMessage, setBanMessage] = useState<string | null>(null)
  const [unbanMessage, setUnbanMessage] = useState<string | null>(null)

  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()

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

      // Tworzenie wiadomości o banie
      const parts = []
      if (values.days > 0)
        parts.push(`${values.days} day${values.days > 1 ? 's' : ''}`)
      if (values.hours > 0)
        parts.push(`${values.hours} hour${values.hours > 1 ? 's' : ''}`)
      if (values.minutes > 0)
        parts.push(`${values.minutes} minute${values.minutes > 1 ? 's' : ''}`)
      const message = `User ${userInfo?.firstName} ${userInfo?.lastName} was banned for ${parts.join(' ')}.`

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
        onClose={() => setIsDialogOpen(false)}
        title="Ban User"
      >
        {banMessage ? (
          <div className="flex flex-col justify-between min-h-[150px] min-w-[400px] px-6 py-4">
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-lg font-semibold text-center">{banMessage}</p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setIsDialogOpen(false)
                  setBanMessage(null)
                }}
                className="ml-4 p-3 text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md bg-white text-primary transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={{ days: 0, hours: 0, minutes: 0 }}
            onSubmit={values => handleBanUser(values)}
          >
            {({ values, isSubmitting }) => {
              const isBanDisabled =
                values.days === 0 && values.hours === 0 && values.minutes === 0

              return (
                <Form>
                  <div className="flex flex-col justify-between min-h-[400px] min-w-[400px] px-6 py-4">
                    <div className="flex flex-col gap-4">
                      {/* D */}
                      <div>
                        <label
                          htmlFor="days"
                          className="block text-sm font-medium mb-1"
                        >
                          Days
                        </label>
                        <Field
                          as="select"
                          name="days"
                          id="days"
                          className="w-full p-2 border rounded-md"
                        >
                          {[...Array(31)].map((_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </Field>
                      </div>

                      {/* Hr */}
                      <div>
                        <label
                          htmlFor="hours"
                          className="block text-sm font-medium mb-1"
                        >
                          Hours
                        </label>
                        <Field
                          as="select"
                          name="hours"
                          id="hours"
                          className="w-full p-2 border rounded-md"
                        >
                          {[...Array(24)].map((_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </Field>
                      </div>

                      {/* Min */}
                      <div>
                        <label
                          htmlFor="minutes"
                          className="block text-sm font-medium mb-1"
                        >
                          Minutes
                        </label>
                        <Field
                          as="select"
                          name="minutes"
                          id="minutes"
                          className="w-full p-2 border rounded-md"
                        >
                          {[...Array(60)].map((_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </Field>
                      </div>

                      {/* Warningi */}
                      {isBanDisabled && (
                        <p className="text-red text-sm">
                          Ban must last at least 1 minute long.
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsDialogOpen(false)}
                        className="ml-4 text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md p-3 bg-white text-primary transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || isBanDisabled}
                        className={`text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md px-3 bg-white text-primary transition ${
                          isBanDisabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        Ban
                      </button>
                    </div>
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
        <div className="flex flex-col justify-between px-6 py-4">
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-lg font-semibold text-center">{unbanMessage}</p>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setUnbanMessage(null)}
              className="ml-4 text-sm p-3 border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md bg-white text-primary transition"
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
