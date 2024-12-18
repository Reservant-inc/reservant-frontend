import React from 'react'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import Tab from '../../restaurantManagement/tabs/Tab'
import { useTranslation } from 'react-i18next'

const ReportsTabs: React.FC = () => {
  const [t] = useTranslation('global')

  return (
    <div className="flex gap-2">
      <Tab
        path="created"
        title={t('profile.reports.created')}
        icon={<AssignmentTurnedInIcon className="text-sm" />}
        id="ProfileCreatedEvents"
      />
    </div>
  )
}

export default ReportsTabs
