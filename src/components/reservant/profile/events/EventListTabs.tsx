import React from 'react'
import PersonIcon from '@mui/icons-material/Person'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import Tab from '../../restaurantManagement/tabs/Tab'
import { useTranslation } from 'react-i18next'

const EventListTabs: React.FC = () => {
  const [t] = useTranslation('global')

  return (
    <div className="flex gap-2">
      <Tab
        path="created"
        title={t('profile.events.created')}
        icon={<AssignmentTurnedInIcon className="text-sm" />}
        id="ProfileCreatedEvents"
      />
      <Tab
        path="interested"
        title={t('profile.events.interested')}
        icon={<FavoriteIcon className="text-sm" />}
        id="ProfileInterestedEvents"
      />
      <Tab
        path="participates"
        title={t('profile.events.participating')}
        icon={<PersonIcon className="text-sm" />}
        id="ProfileParticipatedEvents"
      />
    </div>
  )
}

export default EventListTabs
