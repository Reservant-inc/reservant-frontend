import React from 'react'
import { useNavigate } from 'react-router-dom'
import PersonIcon from '@mui/icons-material/Person'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import Tab from '../../restaurantManagement/tabs/Tab'

const EventListTabs: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex gap-2">
      <Tab
        path="created"
        title="Utworzone"
        icon={<AssignmentTurnedInIcon className="text-sm" />}
        id="ProfileCreatedEvents"
      />
      <Tab
        path="interested"
        title="Zainteresowane"
        icon={<FavoriteIcon className="text-sm" />}
        id="ProfileInterestedEvents"
      />
      <Tab
        path="participates"
        title="Uczestniczysz"
        icon={<PersonIcon className="text-sm" />}
        id="ProfileParticipatedEvents"
      />
    </div>
  )
}

export default EventListTabs
