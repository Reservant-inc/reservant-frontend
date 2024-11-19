import React, { useEffect, useState } from 'react'
import { FetchError } from '../../services/Errors'
import { fetchGET, fetchPOST, fetchPUT, getImage } from '../../services/APIconn'
import { PaginationType, TransactionType, UserType } from '../../services/types'
import DefaultImage from '../../assets/images/user.jpg'
import { Form, Formik, Field } from 'formik'
import * as yup from 'yup'
import EditSharpIcon from '@mui/icons-material/EditSharp'
import InfiniteScroll from 'react-infinite-scroll-component'
import { CircularProgress } from '@mui/material'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'

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

  const initialValues = {
    phoneNumber: userInfo.phoneNumber,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName
  }

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
          photo: userInfo.photo
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

  const addFunds = async () => {
    try {
      const body = JSON.stringify({
        title: 'deposit',
        amount: 100
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
    const date = new Date(timestamp)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0')

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day}, ${hours}:${minutes}`
  }

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex h-fit flex-col w-full bg-white rounded-lg p-4 gap-4">
        <div className="flex justify-between w-full">
          <h1 className="text-lg font-mont-bd">Account</h1>
          <div className="flex gap-2">
            <button
              className="flex items-center justify-center gap-1 px-4 text-sm border-[1px] rounded-lg p-1 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white"
              onClick={() => setIsEditing(prev => !prev)}
            >
              {isEditing ? (
                <>
                  <CloseSharpIcon className="w-4 h-4" />
                  <h1>Cancel editing</h1>
                </>
              ) : (
                <>
                  <EditSharpIcon className="w-4 h-4" />
                  <h1>Edit account</h1>
                </>
              )}
            </button>
            <button className="flex items-center justify-center gap-1 px-4 text-sm border-[1px] rounded-lg p-1 border-error text-error transition hover:scale-105 hover:bg-error hover:text-white">
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
          {isEditing ? (
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
                <Form className="w-full">
                  <div className="flex justify-between w-full">
                    <div className="flex-col gap-2 flex w-full">
                      <div className="flex items-center gap-2">
                        <label htmlFor="firstName" className="p-0">
                          Name:
                        </label>
                        <Field
                          name="firstName"
                          type="text"
                          className={`w-[150px] rounded-md p-0 italic ${touched.phoneNumber && Boolean(errors.phoneNumber) ? 'border-error' : 'border-grey-2'}`}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <label htmlFor="lastName" className="p-0">
                          Last name:
                        </label>
                        <Field
                          name="lastName"
                          type="text"
                          className={`w-[150px] rounded-md p-0 italic ${touched.phoneNumber && Boolean(errors.phoneNumber) ? 'border-error' : 'border-grey-2'}`}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <label htmlFor="phoneNumber" className="p-0">
                          Phone number:
                        </label>
                        <Field
                          name="phoneNumber"
                          type="text"
                          className={`w-[150px] rounded-md p-0 italic ${touched.phoneNumber && Boolean(errors.phoneNumber) ? 'border-error' : 'border-grey-2'}`}
                        />
                      </div>
                    </div>
                    <button
                      className="border-[1px] self-end px-2 h-8 w-[200px] text-sm rounded-lg p-1 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
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
          )}
        </div>
      </div>
      <div className="bg-white w-full h-fit rounded-lg p-4">
        <div className="flex justify-between">
          <h1 className="text-lg font-mont-bd">Wallet</h1>
          <button
            className="flex items-center justify-center gap-1 px-4 text-sm border-[1px] rounded-lg p-1 border-green text-green transition hover:scale-105 hover:bg-green hover:text-white"
            onClick={() => addFunds()}
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
                      className="flex w-full p-2 hover:bg-grey-1 dark:hover:bg-grey-5 justify-between"
                    >
                      <div className="flex gap-2">
                        <h1 className="">{transaction.title}:</h1>
                        <h1>{transaction.amount}</h1>
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
    </div>
  )
}

export default Account
