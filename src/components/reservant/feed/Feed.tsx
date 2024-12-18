import React from 'react'
import { EventListType } from '../../../services/enums'
import EventList from '../profile/events/EventList'

const Feed: React.FC = () => {
  return (
    <div className="w-full h-full flex bg-grey-1 justify-center p-4 dark:bg-grey-6">
      <div className="w-[800px] h-9/10 bg-white rounded-lg p-4 dark:bg-black dark:text-grey-1">
        <EventList listType={EventListType.History} />
      </div>
    </div>
  )
}

export default Feed
