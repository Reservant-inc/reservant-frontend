import React from 'react'
import { Outlet } from 'react-router-dom'
import EventListTabs from './EventListTabs'

const EventTab: React.FC = () => {
  return (
    <div className="flex flex-col bg-white rounded-lg w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="font-mont-bd text-lg">Events</h1>
        <EventListTabs />
      </div>
      <Outlet />
    </div>
  )
}

export default EventTab
