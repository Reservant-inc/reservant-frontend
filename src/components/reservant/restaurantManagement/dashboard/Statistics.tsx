import React, { useEffect, useState } from 'react'
import { StatisticsScope } from '../../../../services/enums'
import { StatisticsProps } from './Dashboard'

enum Option {
  All,
  Group,
  Single
}

const Statistics: React.FC<StatisticsProps> = ({ scope }) => {
  const [option, setOption] = useState<Option>(
    scope === StatisticsScope.All ? Option.All : Option.Single
  )

  useEffect(() => {}, [])

  return (
    <div className="p-4">
      <div className="flex w-full">
        <h1 className="text-lg font-mont-bd">Statistics</h1>
      </div>
      {scope === StatisticsScope.All && (
        <>
          <select
            value={option}
            onChange={e => setOption(Number(e.target.value) as Option)}
          >
            <option value={Option.All}>All restaurants</option>
            <option value={Option.Group}>Restaurant group</option>
            <option value={Option.Single}>Restaurant</option>
          </select>
          {option === Option.Group && <select></select>}
          {option === Option.Single && <select></select>}
        </>
      )}
    </div>
  )
}

export default Statistics
