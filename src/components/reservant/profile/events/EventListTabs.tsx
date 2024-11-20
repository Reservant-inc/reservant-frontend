import React from 'react'
import { useNavigate } from 'react-router-dom'

const EventListTabs: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex gap-1">
      <button
        id="ProfileCreatedEvents"
        onClick={() => navigate('created')}
        className={`bg-white text-primary text-sm px-2 border-[1px] rounded-md p-1 border-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
      >
        Utworzone
      </button>
      <button
        id="ProfileInterestedEvents"
        onClick={() => navigate('interested')}
        className={`bg-white text-primary text-sm px-2 border-[1px] rounded-md p-1 border-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
      >
        Zainteresowane
      </button>
      <button
        id="ProfileParticipatedEvents"
        onClick={() => navigate('participates')}
        className={`bg-white text-primary text-sm px-2 border-[1px] rounded-md p-1 border-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
      >
        Uczestniczysz
      </button>
    </div>
  )
}

export default EventListTabs
