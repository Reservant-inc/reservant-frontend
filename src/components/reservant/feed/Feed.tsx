import React from 'react'
import { EventListType } from '../../../services/enums'
import EventList from '../profile/events/EventList'

const Feed: React.FC = () => {
  return (
    <div className="w-full h-full bg-grey-1 flex justify-center p-4">
      <div className="w-[700px] h-9/10 bg-white rounded-lg shadow-md p-4">
        <EventList listType={EventListType.History} />
      </div>
    </div>
  )
}

export default Feed
