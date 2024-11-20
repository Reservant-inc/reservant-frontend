import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import PeopleIcon from '@mui/icons-material/People'
import CallMadeIcon from '@mui/icons-material/CallMade'
import CallReceivedIcon from '@mui/icons-material/CallReceived'

const FriendsListTabs: React.FC = () => {
  const navigate = useNavigate()
  const [t] = useTranslation('global')

  return (
    <div className="flex gap-1">
      <button
        id="ProfileFriendsList"
        onClick={() => navigate('list')}
        className={`flex items-center gap-2 dark:bg-grey-6 bg-white text-primary text-sm px-2 border-[1px] rounded-lg p-1 border-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
      >
        <PeopleIcon className="text-sm" />
        {t('profile.friends.friends-tab')}
      </button>
      <button
        id="ProfileOutgoingRequests"
        onClick={() => navigate('outgoing')}
        className={`flex items-center gap-2 dark:bg-grey-6 bg-white text-primary text-sm px-2 border-[1px] rounded-lg p-1 border-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
      >
        <CallMadeIcon className="text-sm" />
        {t('profile.friends.outgoing-tab')}
      </button>
      <button
        id="ProfileIncomingRequests"
        onClick={() => navigate('incoming')}
        className={`flex items-center gap-2 dark:bg-grey-6 bg-white text-primary text-sm px-2 border-[1px] rounded-lg p-1 border-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
      >
        <CallReceivedIcon className="text-sm" />
        {t('profile.friends.incoming-tab')}
      </button>
    </div>
  )
}

export default FriendsListTabs
