import React from 'react'
import { useNavigate } from 'react-router-dom'

const ReservationHistoryTabs: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex gap-1">
      <button
        onClick={() => navigate('incoming')}
        className={`bg-white text-primary text-sm px-2 border-[1px] rounded-md p-1 border-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
      >
        Nadchodzące
      </button>
      <button
        onClick={() => navigate('finished')}
        className={`bg-white text-primary text-sm px-2 border-[1px] rounded-md p-1 border-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
      >
        Przeszłe
      </button>
    </div>
  )
}

export default ReservationHistoryTabs
