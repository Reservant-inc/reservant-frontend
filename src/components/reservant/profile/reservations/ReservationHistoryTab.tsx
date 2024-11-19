import React from 'react'
import { Outlet } from 'react-router-dom'
import ReservationHistoryTabs from './ReservationHistoryTabs'

const ReservationHistoryTab: React.FC = () => {
  return (
    <div className="flex flex-col bg-white rounded-lg w-full h-full p-4 gap-4 shadow-md">
      <div className="flex h-[2rem] justify-between items-center">
        <h1 className="font-mont-bd text-lg">Events</h1>
        <ReservationHistoryTabs />
      </div>
      <div className="w-full h-[calc(100%-3rem)]">
        <Outlet />
      </div>
    </div>
  )
}

export default ReservationHistoryTab
