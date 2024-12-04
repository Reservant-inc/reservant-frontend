import React from 'react'
import { Outlet } from 'react-router-dom'
import EventListTabs from './EventListTabs'

const EventTab: React.FC = () => {
  return (
    <div className="flex flex-col rounded-lg w-full h-full">
      <div className="flex justify-between items-center dark:text-grey-1">
        <div className="px-2 py-1">
          <h1 className="text-lg font-mont-bd">Events</h1>
        </div>
        <EventListTabs />
      </div>
      <div className="w-full h-[calc(100%-3rem)] bg-white dark:bg-black dark:text-grey-1 rounded-lg rounded-tr-none shadow-md p-4">
        <Outlet />
      </div>
    </div>
  )
}

export default EventTab
