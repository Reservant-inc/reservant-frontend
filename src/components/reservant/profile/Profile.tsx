import React, { useEffect, useState } from 'react'
import { FetchError } from '../../../services/Errors'
import { fetchGET, getImage } from '../../../services/APIconn'
import { UserType } from '../../../services/types'
import DefaultImage from '../../../assets/images/user.jpg'
import { Outlet, useNavigate } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import ReportIcon from '@mui/icons-material/Report'
import GroupIcon from '@mui/icons-material/Group';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
    <div className=" flex h-full w-full items-center justify-center gap-5 bg-grey-1 p-4 dark:bg-grey-6">
      <div className="flex flex-col gap-3 self-start p-4 bg-white rounded-lg shadow-md dark:bg-black dark:text-white">
        <div className=" flex items-center justify-center gap-4 w-[200px]">
          <h1 className="font-mont-bd text-xl text-center">
            Menu
          </h1>
        </div>
        <button
          id="profileAccountSection"
          className="w-full p-3 flex gap-4 text-left dark:text-white rounded-md hover:bg-grey-0 hover:dark:bg-grey-5 transition"
          onClick={() => navigate('account')}
        >
          <AccountCircleIcon />
          <h1>Account</h1>
        </button>
        <button
          id="profileReservationSection"
          className="w-full p-3 flex gap-4 text-left dark:text-white rounded-md hover:bg-grey-0 hover:dark:bg-grey-5 transition"
          onClick={() => navigate('reservation-history/incoming')}
        >
          <CalendarTodayIcon />
          <h1>Reservations</h1>
        </button>
        <button
          id="profileEventsSection"
          className="w-full p-3 flex gap-4 text-left dark:text-white rounded-md hover:bg-grey-0 hover:dark:bg-grey-5 transition"
          onClick={() => navigate('event-history/created')}
        >
          <CelebrationIcon />
          <h1>Events</h1>
        </button>
        <button
          id="profileFriendsSection"
          className="w-full p-3 flex gap-4 text-left dark:text-white rounded-md hover:bg-grey-0 hover:dark:bg-grey-5 transition"
          onClick={() => navigate('friends')}
        >
          <GroupIcon />
          <h1>Friends</h1>
        </button>
        <button
          id="profileReportsSection"
          className="w-full p-3 flex gap-4 text-left dark:text-white rounded-md hover:bg-grey-0 hover:dark:bg-grey-5 transition"
          onClick={() => navigate('reports')}
        >
          <ReportIcon />
          <h1>Raports</h1>
        </button>
      </div>
      <div className="flex justify-center h-full w-[800px] rounded-lg dark:bg-grey-6">
        <Outlet />
      </div>
    </div>
  )
}

export default Profile
