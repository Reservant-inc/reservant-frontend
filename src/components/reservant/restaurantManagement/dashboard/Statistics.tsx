import React, { useEffect, useState } from 'react'
import { StatisticsScope } from '../../../../services/enums'

interface StatisticsProps {
  scope: StatisticsScope
}

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

  return <div>{}</div>
}

export default Statistics
