import React from 'react'
import Tab from '../../restaurantManagement/tabs/Tab'

const ReservationHistoryTabs: React.FC = () => {
  return (
    <div className="flex gap-2">
      <Tab path="incoming" title="Nadchodzące" id="incoming_reservations" />
      <Tab path="finished" title="Przeszłe" id="finished" />
    </div>
  )
}

export default ReservationHistoryTabs
