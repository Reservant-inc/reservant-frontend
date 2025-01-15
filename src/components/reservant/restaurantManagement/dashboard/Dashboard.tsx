import React from 'react'
import Details from './Details'
import Statistics from './Statistics'
import { StatisticsScope } from '../../../../services/enums'

export interface StatisticsProps {
  scope: StatisticsScope
}

const Dashboard: React.FC<StatisticsProps> = ({ scope }) => {
  return (
    <div className="flex gap-2 h-full w-full items-center justify-center rounded-b-lg bg-white rounded-tr-lg dark:text-grey-1">
      <div className="w-[30%] h-full">
        <Details />
      </div>
      <div className="w-[70%] h-full">
        <Statistics scope={scope} />
      </div>
    </div>
  )
}

export default Dashboard
