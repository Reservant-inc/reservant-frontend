import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import PeopleIcon from '@mui/icons-material/People'
import CallMadeIcon from '@mui/icons-material/CallMade'
import CallReceivedIcon from '@mui/icons-material/CallReceived'
import Tab from '../../restaurantManagement/tabs/Tab'

const FriendsListTabs: React.FC = () => {
  const navigate = useNavigate()
  const [t] = useTranslation('global')

  return (
    <div className="flex gap-1">
      <Tab
        path="list"
        title={t('profile.friends.friends-tab')}
        icon={<PeopleIcon className="text-sm" />}
        id="ProfileFriendsList"
      />
      <Tab
        path="outgoing"
        title={t('profile.friends.outgoing-tab')}
        icon={<CallMadeIcon className="text-sm" />}
        id="ProfileOutgoingRequests"
      />
      <Tab
        path="incoming"
        title={t('profile.friends.incoming-tab')}
        icon={<CallReceivedIcon className="text-sm" />}
        id="ProfileIncomingRequests"
      />
    </div>
  )
}

export default FriendsListTabs
