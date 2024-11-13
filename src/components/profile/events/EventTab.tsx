import React from 'react'
import { Outlet } from 'react-router-dom'
import EventListTabs from './EventListTabs'

const EventTab: React.FC = () => {
  return (
    <div className="flex flex-col bg-white rounded-lg w-full h-full p-4 gap-4">
      <div className="flex h-[2rem] justify-between items-center">
        <h1 className="font-mont-bd text-lg">Events</h1>
        <EventListTabs />
      </div>
      <div className="w-full h-[calc(100%-3rem)]">
        <Outlet />
      </div>
    </div>
  )
}

export default EventTab
