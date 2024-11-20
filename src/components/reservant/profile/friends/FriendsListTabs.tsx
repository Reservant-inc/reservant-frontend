import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const FriendsListTabs: React.FC = () => {
  const navigate = useNavigate()
  const [t] = useTranslation('global')

  return (
    <div className="flex gap-1">
      <button
        id="ProfileFriendsList"
        onClick={() => navigate('list')}
        className={`dark:bg-grey-6 bg-white text-primary text-sm px-2 border-[1px] rounded-lg p-1 border-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
      >
        {t('profile.friends.friends-tab')}
      </button>
      <button
        id="ProfileOutgoingRequests"
        onClick={() => navigate('outgoing')}
        className={`dark:bg-grey-6 bg-white text-primary text-sm px-2 border-[1px] rounded-lg p-1 border-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
      >
        {t('profile.friends.outgoing-tab')}
      </button>
      <button
        id="ProfileIncomingRequests"
        onClick={() => navigate('incoming')}
        className={`dark:bg-grey-6 bg-white text-primary text-sm px-2 border-[1px] rounded-lg p-1 border-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
      >
        {t('profile.friends.incoming-tab')}
      </button>
    </div>
  )
}

export default FriendsListTabs
