import React from 'react'
import { Outlet } from 'react-router-dom'
import ReservationHistoryTabs from './ReservationHistoryTabs'

const ReservationHistoryTab: React.FC = () => {
  return (
    <div className="flex flex-col rounded-lg w-full h-full">
      <div className="flex justify-between items-center">
        <div className="px-2 py-1">
          <h1 className="text-lg font-mont-bd">Reservation history</h1>
        </div>
        <ReservationHistoryTabs />
      </div>
      <div className="w-full h-[calc(100%-3rem)] bg-white rounded-lg rounded-tr-none shadow-md p-4">
        <Outlet />
      </div>
    </div>
  )
}

export default ReservationHistoryTab
