import React from 'react'
import { EventListType } from '../../../services/enums'
import EventList from '../profile/events/EventList'
import { useTranslation } from 'react-i18next';

const Feed: React.FC = () => {

  const [t] = useTranslation('global');
  return (
    <div className="w-full min-h-screen flex flex-col bg-grey-1 p-2 dark:bg-grey-6">
      <div className="flex flex-col items-center w-full">
        <div className="w-[800px] text-xl py-2 text-center">
          {t('profile.events.events-feed')}
        </div>
        <div className="w-[800px] bg-white rounded-lg p-4 dark:bg-black dark:text-grey-1">
          <EventList listType={EventListType.History} />
        </div>
      </div>
    </div>
  );
};

export default Feed
 