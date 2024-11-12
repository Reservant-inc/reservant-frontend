import React, { useEffect, useState } from 'react'
import { FetchError } from '../../services/Errors'
import { fetchGET, getImage } from '../../services/APIconn'
import { UserType } from '../../services/types'
import DefaultImage from '../../assets/images/user.jpg'
import { Outlet, useNavigate } from 'react-router-dom'

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserType>()

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
    }
  }

  return (
    <div className="z-[0] flex h-full w-full items-center justify-center gap-5 bg-grey-1 p-4">
      <div className="flex flex-col gap-3 self-start p-4 bg-white rounded-lg shadow-md">
        <div className="mb-5 flex items-center gap-4">
          {user && (
            <>
              <img
                src={getImage(user.photo, DefaultImage)}
                className="h-8 w-8 rounded-full"
              />
              <h1 className="font-mont-bd text-xl">
                {user.firstName} {user.lastName}
              </h1>
            </>
          )}
        </div>
        <button
          className="border-[1px] rounded-lg p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          onClick={() => navigate('account')}
        >
          <h1 className="text-sm">Account</h1>
        </button>
        <button
          className="border-[1px] rounded-lg p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          onClick={() => navigate('reservation-history')}
        >
          <h1 className="text-sm">Reservations</h1>
        </button>
        <button
          className="border-[1px] rounded-lg p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          onClick={() => navigate('event-history')}
        >
          <h1 className="text-sm">Events</h1>
        </button>
        <button
          className="border-[1px] rounded-lg p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          onClick={() => navigate('friends')}
        >
          <h1 className="text-sm">Friends</h1>
        </button>
      </div>
      <div className="flex justify-center h-full w-[650px] rounded-lg">
        <Outlet />
      </div>
    </div>
  )
}

export default Profile
