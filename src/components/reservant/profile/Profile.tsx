import React, { useEffect, useState } from 'react'
import { FetchError } from '../../../services/Errors'
import { fetchGET, getImage } from '../../../services/APIconn'
import { UserType } from '../../../services/types'
import DefaultImage from '../../../assets/images/user.jpg'
import { Outlet, useNavigate } from 'react-router-dom'
import { CircularProgress } from '@mui/material'

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserType>()
  const [loading, setLoading] = useState<boolean>(true)

  const navigate = useNavigate()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const userdata = await fetchGET('/user')

      setUser(userdata)
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log('Unexpected error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="z-[0] flex h-full w-full items-center justify-center gap-5 bg-grey-1 p-4 dark:bg-grey-6">
      <div className="flex flex-col gap-3 self-start p-4 bg-white rounded-lg shadow-md dark:bg-black dark:text-white">
        <div className="mb-5 flex items-center gap-4 w-[200px]">
          {loading ? (
            <CircularProgress className="text-grey-1" />
          ) : (
            user && (
              <>
                <img
                  src={getImage(user.photo, DefaultImage)}
                  className="h-8 w-8 rounded-full"
                />
                <h1 className="font-mont-bd text-xl">
                  {user.firstName} {user.lastName}
                </h1>
              </>
            )
          )}
        </div>
        <button
          id="profileAccountSection"
          className="border-[1px] rounded-md p-1 bg-white dark:bg-black border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          onClick={() => navigate('account')}
        >
          <h1 className="text-sm">Account</h1>
        </button>
        <button
          id="profileReservationSection"
          className="border-[1px] rounded-md p-1 bg-white dark:bg-black border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          onClick={() => navigate('reservation-history/incoming')}
        >
          <h1 className="text-sm">Reservations</h1>
        </button>
        <button
          id="profileEventsSection"
          className="border-[1px] rounded-md p-1 bg-white dark:bg-black border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          onClick={() => navigate('event-history/created')}
        >
          <h1 className="text-sm">Events</h1>
        </button>
        <button
          id="profileFriendsSection"
          className="border-[1px] rounded-md p-1 bg-white dark:bg-black border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          onClick={() => navigate('friends')}
        >
          <h1 className="text-sm">Friends</h1>
        </button>
        <button
          id="profileReportsSection"
          className="border-[1px] rounded-md p-1 bg-white dark:bg-black border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          onClick={() => navigate('reports')}
        >
          <h1 className="text-sm">Reports</h1>
        </button>
      </div>
      <div className="flex justify-center h-full w-[800px] rounded-lg dark:bg-grey-6">
        <Outlet />
      </div>
    </div>
  )
}

export default Profile
