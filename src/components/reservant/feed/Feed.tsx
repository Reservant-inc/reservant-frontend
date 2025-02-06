import React from 'react'
import { EventListType } from '../../../services/enums'
import EventList from '../profile/events/EventList'
import { useTranslation } from 'react-i18next'

const Feed: React.FC = () => {
  const [t] = useTranslation('global')

  return (
    <div className="w-full min-h-screen flex flex-col bg-white p-2 dark:bg-black">
      <div className="flex flex-col items-center w-full">
        <div className="w-[800px] text-xl py-2 text-center dark:text-grey-1">
          {t('profile.events.events-feed')}
        </div>
        <div className="w-[800px] bg-white rounded-lg p-4 dark:bg-black dark:text-grey-1 border-[1px] dark:border-white border-black">
          <EventList listType={EventListType.History} />
        </div>
      </div>
    </div>
  )
}

export default Feed
