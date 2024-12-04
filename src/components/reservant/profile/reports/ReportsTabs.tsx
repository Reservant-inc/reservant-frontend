import React from 'react'
import { useNavigate } from 'react-router-dom'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import Tab from '../../restaurantManagement/tabs/Tab'

const ReportsTabs: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex gap-2">
      <Tab
        path="created"
        title="Utworzone"
        icon={<AssignmentTurnedInIcon className="text-sm" />}
        id="ProfileCreatedEvents"
      />
    </div>
  )
}

export default ReportsTabs
