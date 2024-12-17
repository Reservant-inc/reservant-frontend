import React, { useEffect, useState } from 'react'
import { FetchError } from '../../../services/Errors'
import { fetchGET } from '../../../services/APIconn'
import { useParams } from 'react-router-dom'
import { UserInfo } from '../../../services/types'
import { CircularProgress } from '@mui/material'

const User: React.FC = () => {
  const [user, setUser] = useState<UserInfo>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { userId } = useParams<{ userId: string }>()

  useEffect(() => {
    if (userId) fetchUserData()
  }, [userId])

  const fetchUserData = async () => {
    try {
      setIsLoading(true)

      const response = await fetchGET(`/users/${userId}`)

      setUser(response)
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : user ? (
        <div className="h-full w-full flex flex-col">
          <h1 className="text-lg font-semibold p-2">
            {user.firstName} {user.lastName}
          </h1>
          <div className="h-full w-full bg-white rounded-lg shadow-md"></div>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <h1 className="font-mont-bd text-2xl">No user selected</h1>
        </div>
      )}
    </>
  )
}

export default User
