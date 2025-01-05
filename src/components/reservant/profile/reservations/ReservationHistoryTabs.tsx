import React from 'react'
import Tab from '../../restaurantManagement/tabs/Tab'
import { useTranslation } from 'react-i18next';

const ReservationHistoryTabs: React.FC = () => {
    const [t] = useTranslation('global');

  return (
    <div className="flex gap-2">
      <Tab path="incoming" title={t('reservation.incoming')} id="incoming_reservations" />
      <Tab path="finished" title={t('reservation.past')} id="finished" />
    </div>
  )
}

export default ReservationHistoryTabs
