import React from 'react'
import EventHistory from '../profile/EventHistory'

const Feed: React.FC = () => {
  return (
    <div className="w-full h-full flex justify-center bg-grey-1 p-4">
      <div className="h-[90vh] w-[700px] bg-white shadow-md rounded-lg">
        <EventHistory />
      </div>
    </div>
  )
}

export default Feed
