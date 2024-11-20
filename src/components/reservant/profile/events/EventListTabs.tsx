import React from 'react'
import { useNavigate } from 'react-router-dom'
import PersonIcon from '@mui/icons-material/Person'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'

const EventListTabs: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex gap-1">
      <button
        id="ProfileCreatedEvents"
        onClick={() => navigate('created')}
        className={`flex items-center gap-2 bg-white text-primary text-sm px-2 border-[1px] rounded-md p-1 border-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
      >
        <AssignmentTurnedInIcon className="text-sm" />
        Utworzone
      </button>
      <button
        id="ProfileInterestedEvents"
        onClick={() => navigate('interested')}
        className={`flex items-center gap-2 bg-white text-primary text-sm px-2 border-[1px] rounded-md p-1 border-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
      >
        <FavoriteIcon className="text-sm" />
        Zainteresowane
      </button>
      <button
        id="ProfileParticipatedEvents"
        onClick={() => navigate('participates')}
        className={`flex items-center gap-2 bg-white text-primary text-sm px-2 border-[1px] rounded-md p-1 border-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
      >
        <PersonIcon className="text-sm" />
        Uczestniczysz
      </button>
    </div>
  )
}

export default EventListTabs
