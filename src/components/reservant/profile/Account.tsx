import React, { useEffect, useState, useTransition } from 'react'
import { FetchError } from '../../../services/Errors'
import {
  fetchFilesPOST,
  fetchGET,
  fetchPOST,
  fetchPUT,
  getImage
} from '../../../services/APIconn'
import {
  PaginationType,
  TransactionType,
  UserType
} from '../../../services/types'
import { styled } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

import DefaultImage from '../../../assets/images/user.jpg'
import { Form, Formik, Field } from 'formik'
import * as yup from 'yup'
import EditSharpIcon from '@mui/icons-material/EditSharp'
import InfiniteScroll from 'react-infinite-scroll-component'
import { CircularProgress } from '@mui/material'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Dialog from '../../reusableComponents/Dialog'
import ErrorMes from '../../reusableComponents/ErrorMessage'
import { Key, Visibility, VisibilityOff } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

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

const UserEditSchema = yup.object({
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^\+\d{11}$/,
      'Phone number must be in international format (e.g., +48123456789)'
    ),
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name should be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name should be at least 2 characters')
})

const Account: React.FC = () => {
  const [page, setPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [userInfo, setUserInfo] = useState<UserType>({} as UserType)
  const [wallet, setWallet] = useState<number>(0)
  const [transactions, setTransactions] = useState<TransactionType[]>([])
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [photoFileName, setPhotoFileName] = useState<string>(userInfo.photo)
  const [photoPath, setPhotoPath] = useState<string>('')
  const [isChangingPass, setIsChangingPass] = useState<boolean>(false)
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState<boolean>(false)
  const [showMoneyDialog, setShowMoneyDialog] = useState<boolean>(false)
  const [value, setValue] = useState<number>(0)

  const [t] = useTranslation('global')

  const initialValues = {
    phoneNumber: userInfo.phoneNumber,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName
  }

  const passValues = {
    oldPassword: '',
    newPassWord: '',
    repeatPassword: ''
  }
  const passEditSchema = yup.object({
    oldPassword: yup.string().required('Phone number is required'),
    newPassWord: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        t('errors.user-register.password.matches')
      )
      .required(t('errors.user-register.password.required')),

    repeatPassword: yup
      .string()
      .oneOf(
        [yup.ref('newPassWord'), ''],
        t('errors.user-register.confirmPassword.matches')
      )
      .required(t('errors.user-register.confirmPassword.required'))
  })

  useEffect(() => {
    fetchWalletBalance()
    fetchUserData()
  }, [])

  const fetchWalletBalance = async () => {
    try {
      const res = await fetchGET('/wallet/status')
      setWallet(res.balance)
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      } else {
        console.error('Unexpected error')
      }
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

  const fetchTransactions = async () => {
    try {
      const result: PaginationType = await fetchGET(
        `/wallet/history?page=${page}`
      )
      const newTransactions = result.items as TransactionType[]

      if (newTransactions.length < 10) {
        setHasMore(false)
      } else {
        if (!hasMore) setHasMore(true)
      }

      if (page > 0) {
        setTransactions(prevTransactions => [
          ...prevTransactions,
          ...newTransactions
        ])
      } else {
        setTransactions(newTransactions)
      }
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      } else {
        console.error('Unexpected error:', error)
      }
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [page])

  const updateUserData = async (userData: any) => {
    try {
      await fetchPUT(
        '/user',
        JSON.stringify({
          phoneNumber: userData.phoneNumber,
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
  const updatePass = async (userData: any) => {
    alert('Password changed')
  }

  const addFunds = async () => {
    try {
      const body = JSON.stringify({
        title: 'Funds deposit',
        amount: value
      })

      await fetchPOST('/wallet/add-money', body)

      if (page === 0) {
        fetchTransactions()
      } else {
        setPage(0)
      }

      fetchWalletBalance()
    } catch (error) {
      if (error instanceof FetchError) console.error(error.formatErrors())
      else console.error(error)
    }
  }

  const formatDate = (timestamp: string): string => {
    return format(new Date(timestamp), 'yyyy-MM-dd, HH:mm')
  }

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex h-fit flex-col w-full bg-white rounded-lg p-4 gap-4 shadow-md">
        <div className="flex justify-between w-full">
          <h1 className="text-lg font-mont-bd">Account</h1>
          <div className="flex gap-2">
            <button
              className="flex items-center justify-center gap-1 px-4 text-sm border-[1px] rounded-lg p-1 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white"
              onClick={() => setIsChangingPass(prev => !prev)}
            >
              <>
                <Key className="w-4 h-4" />
                <h1>Change password</h1>
              </>
            </button>
            <button
              className="flex items-center justify-center gap-1 px-4 text-sm border-[1px] rounded-lg p-1 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white"
              onClick={() => setIsEditing(prev => !prev)}
            >
              <>
                <EditSharpIcon className="w-4 h-4" />
                <h1>Edit personal data</h1>
              </>
            </button>
            <button className="flex items-center justify-center gap-1 px-4 text-sm border-[1px] rounded-md p-1 border-error text-error transition hover:scale-105 hover:bg-error hover:text-white">
              <DeleteForeverIcon className="w-4 h-4" />
              Delete account
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
              <h1>Name: </h1>
              <h1 className="text-md">{userInfo.firstName}</h1>
            </div>
            <div className="flex gap-2 items-center">
              <h1>Last name: </h1>
              <h1 className="text-md">{userInfo.lastName}</h1>
            </div>
            <div className="flex gap-2 items-center">
              <h1>Phone number: </h1>
              <h1 className="text-md">{userInfo.phoneNumber}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white w-full h-fit rounded-lg p-4 shadow-md">
        <div className="flex justify-between">
          <h1 className="text-lg font-mont-bd">Wallet</h1>
          <button
            className="flex items-center justify-center gap-1 px-4 text-sm border-[1px] rounded-md p-1 border-green text-green transition hover:scale-105 hover:bg-green hover:text-white"
            onClick={() => setShowMoneyDialog(prev => !prev)}
          >
            <AttachMoneyIcon className="w-4 h-4" />
            Add wallet funds
          </button>
        </div>
        <div className="flex flex-col gap-2 justify-center pt-2">
          <h1 className="text-sm font-mont-bd">{`Account balance: ${wallet} zł`}</h1>
          <h1 className="text-sm">Transaction history:</h1>
          <div
            id="scrollableDiv"
            className="w-full h-[300px] rounded-lg overflow-y-auto scroll bg-grey-0"
          >
            <InfiniteScroll
              dataLength={transactions.length}
              next={() => setPage(prevPage => prevPage + 1)}
              hasMore={hasMore}
              loader={
                <CircularProgress className="self-center text-grey-2 w-10 h-10" />
              }
              scrollableTarget="scrollableDiv"
              className="overflow-y-hidden flex flex-col rounded-lg p-2"
            >
              <div className="flex flex-col gap-1 h-full items-center divide-y-[1px] divide-grey-2">
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="flex w-full p-2 justify-between text-sm"
                    >
                      <div className="flex gap-2 items-center">
                        <h1>
                          {transaction.amount > 0 ? (
                            <AddIcon className="text-green" />
                          ) : (
                            <RemoveIcon className="text-error" />
                          )}
                        </h1>
                        <h1 className="">{transaction.title}:</h1>
                        <h1>{transaction.amount} PLN</h1>
                      </div>
                      <h1>{formatDate(transaction.time.toString())}</h1>
                    </div>
                  ))
                ) : (
                  <h1 className="text-grey-2 text-sm">No transactions yet</h1>
                )}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </div>

      {isEditing && (
        <Dialog
          open={isEditing}
          onClose={() => setIsEditing(false)}
          title={`Editing user information...`} //@TODO translation
        >
          <div className="w-[650px] h-[300px] p-6 flex  justify-between">
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
                <Form className="flex justify-center h-full">
                  <div className="flex justify-between flex-col w-full">
                    <div className="flex-col gap-2 flex w-full">
                      <div>
                        <div
                          className={`  flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${errors.firstName && touched.firstName ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                        >
                          <label htmlFor="name">Name:</label>
                          <Field
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="w-full "
                            //@TODO translation
                          />
                          <label>*</label>
                        </div>
                        {errors.firstName && touched.firstName && (
                          <ErrorMes msg={errors.firstName} />
                        )}
                      </div>

                      <div>
                        <div
                          className={`  flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${errors.lastName && touched.lastName ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                        >
                          <label htmlFor="name">Last name:</label>
                          <Field
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="w-full "
                            //@TODO translation
                          />
                          <label>*</label>
                        </div>
                        {errors.lastName && touched.lastName && (
                          <ErrorMes msg={errors.lastName} />
                        )}
                      </div>
                      <div>
                        <div
                          className={`  flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${errors.phoneNumber && touched.phoneNumber ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                        >
                          <label htmlFor="name">Phone number:</label>
                          <Field
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            className="w-full "
                            //@TODO translation
                          />
                          <label>*</label>
                        </div>
                        {errors.phoneNumber && touched.phoneNumber && (
                          <ErrorMes msg={errors.phoneNumber} />
                        )}
                      </div>
                    </div>
                    <button
                      className="border-[1px]  self-center  px-2 h-8 w-[200px] text-sm rounded-lg p-1 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Dialog>
      )}

      {showMoneyDialog && (
        <Dialog
          onClose={() => {
            setShowMoneyDialog(false)
            setValue(0)
          }}
          title={`Add funds`}
        >
          <div className="p-6 flex flex-col gap-6">
            <div className="flex gap-2 items-center">
              <label htmlFor="fundsInput" className="font-mont-md">
                Add funds to your wallet
              </label>
              <input
                id="fundsInput"
                type="number"
                min={5}
                max={1000}
                value={value}
                onChange={e => setValue(parseInt(e.target.value))}
                className="border-[1px] border-grey-1 px-2 py-1 w-20 rounded-sm"
              />
              <h1>PLN</h1>
            </div>
            <button
              className="self-end flex items-center justify-center gap-1 px-4 text-sm border-[1px] rounded-md p-1 border-green text-green transition hover:scale-105 hover:bg-green hover:text-white"
              onClick={() => {
                setShowMoneyDialog(prev => !prev)
                addFunds()
                setValue(0)
              }}
            >
              Confirm
            </button>
          </div>
        </Dialog>
      )}

      {isChangingPass && (
        <Dialog
          open={isChangingPass}
          onClose={() => setIsChangingPass(false)}
          title={`Changing password...`} //@TODO translation
        >
          <div className="w-[650px] h-[300px] p-6 ">
            <Formik
              initialValues={passValues}
              validationSchema={passEditSchema}
              enableReinitialize
              onSubmit={(values, { setSubmitting }) => {
                updatePass(values)
                setSubmitting(false)
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="flex justify-center h-full">
                  <div className="flex justify-between flex-col w-full">
                    <div className="flex-col gap-2 flex w-full">
                      <div>
                        <div
                          className={` relative flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${errors.oldPassword && touched.oldPassword ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                        >
                          <label htmlFor="name">Old password:</label>
                          <Field
                            type={showOldPassword ? 'text' : 'password'}
                            id="oldPassword"
                            name="oldPassword"
                            className="w-full "
                            //@TODO translation
                          />
                          <span
                            id="showPassOld"
                            className="absolute text-grey-2 right-0 top-1/4 cursor-pointer dark:text-grey-0 hover:text-primary "
                            onClick={() => {
                              setShowOldPassword(prev => !prev)
                            }}
                          >
                            {showOldPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </span>{' '}
                        </div>
                        {errors.oldPassword && touched.oldPassword && (
                          <ErrorMes msg={errors.oldPassword} />
                        )}
                      </div>

                      <div>
                        <div
                          className={` relative flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${errors.newPassWord && touched.newPassWord ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                        >
                          <label htmlFor="name">New password:</label>
                          <Field
                            type={showNewPassword ? 'text' : 'password'}
                            id="newPassWord"
                            name="newPassWord"
                            className="w-full "
                            //@TODO translation
                          />
                          <span
                            id="showPassNew"
                            className="absolute text-grey-2 right-0 top-1/4 cursor-pointer dark:text-grey-0 hover:text-primary "
                            onClick={() => {
                              setShowNewPassword(prev => !prev)
                            }}
                          >
                            {showNewPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </span>{' '}
                        </div>
                        {errors.newPassWord && touched.newPassWord && (
                          <ErrorMes msg={errors.newPassWord} />
                        )}
                      </div>
                      <div>
                        <div
                          className={`  relative flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${errors.repeatPassword && touched.repeatPassword ? 'border-error text-error' : 'border-black text-black dark:text-grey-1 dark:border-white'}`}
                        >
                          <label htmlFor="name">Repeat password:</label>
                          <Field
                            type={showRepeatPassword ? 'text' : 'password'}
                            id="repeatPassword"
                            name="repeatPassword"
                            className="w-full "
                            //@TODO translation
                          />
                          <span
                            id="showPassRep"
                            className="absolute text-grey-2 right-0 top-1/4 cursor-pointer dark:text-grey-0 hover:text-primary "
                            onClick={() => {
                              setShowRepeatPassword(prev => !prev)
                            }}
                          >
                            {showRepeatPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </span>
                        </div>
                        {errors.repeatPassword && touched.repeatPassword && (
                          <ErrorMes msg={errors.repeatPassword} />
                        )}
                      </div>
                    </div>
                    <button
                      className="border-[1px]  self-center  px-2 h-8 w-[200px] text-sm rounded-lg p-1 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
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
