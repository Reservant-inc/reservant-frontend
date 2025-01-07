import React, { useEffect, useState } from 'react'
import { StatisticsScope } from '../../../../services/enums'
import { StatisticsProps } from './Dashboard'
import { useTranslation } from 'react-i18next'
import {
  PaginationType,
  RestaurantDetailsType,
  StatisticsType
} from '../../../../services/types'
import { FetchError } from '../../../../services/Errors'
import { fetchGET } from '../../../../services/APIconn'

enum Option {
  All = 'All',
  Group = 'Group',
  Single = 'Single'
}

const Statistics: React.FC<StatisticsProps> = ({ scope }) => {
  const [t] = useTranslation('global')

  const [option, setOption] = useState<Option>(
    scope === StatisticsScope.All ? Option.All : Option.Single
  )

  //these can be restaurants or groups, depending on selected option.
  const [objects, setObjects] = useState<{ name: string; id: number }[]>()

  //selected object assigned based on optional select.
  const [object, setObject] = useState<{ name: string; id: number }>()

  //assigns api route based on selected option. Empty strig if the object is not selected to avoid undefined value.
  const apiRoutes: Record<Option, string> = {
    [Option.All]: '',
    [Option.Group]: object
      ? `/my-restaurant-groups/${object.id}/statistics`
      : '',
    [Option.Single]: object ? `/my-restaurants/${object.id}/statistics` : ''
  }

  const [statistics, setStatistics] = useState<StatisticsType[]>()

  useEffect(() => {
    switch (option) {
      case Option.All:
        break
      case Option.Group:
        fetchGroups()
        break
      case Option.Single:
        fetchRestaurants()
        break
    }

    setObject(undefined)
  }, [option])

  //checks whether object is undefined so as to not call the method on initial page load
  useEffect(() => {
    object != undefined && fetchStatistics()
  }, [object])

  const fetchGroups = async () => {
    try {
      const response = await fetchGET('/my-restaurant-groups')

      const mappedGroups: { name: string; id: number }[] = response.map(
        (group: { restaurantGroupId: number; name: string }) => ({
          id: group.restaurantGroupId,
          name: group.name
        })
      )

      setObjects(mappedGroups)
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      } else {
        console.error('Unexpected error occurred', error)
      }
    }
  }

  const fetchRestaurants = async () => {
    try {
      const response = await fetchGET('/my-restaurants?perPage=-1')

      const mappedRestaurants: { name: string; id: number }[] = response.map(
        (restaurant: { restaurantId: number; name: string }) => ({
          id: restaurant.restaurantId,
          name: restaurant.name
        })
      )

      setObjects(mappedRestaurants)
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      } else {
        console.error('Unexpected error occurred', error)
      }
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await fetchGET(apiRoutes[option])

      console.log(response)

      setStatistics(response)
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      } else {
        console.error('Unexpected error occurred', error)
      }
    }
  }

  return (
    <div className="p-4">
      <div className="flex w-full">
        <h1 className="text-lg font-mont-bd">
          {t('restaurant-management.statistics.statistics')}
        </h1>
      </div>
      {scope === StatisticsScope.All && (
        <>
          <select
            value={option}
            onChange={e => {
              setOption(e.target.value as Option)
            }}
          >
            <option value={Option.All}>All restaurants</option>
            <option value={Option.Group}>Restaurant group</option>
            <option value={Option.Single}>Restaurant</option>
          </select>
          {option === Option.Group && (
            <div>
              <label htmlFor="groupSelect">Group:</label>
              <select
                id="groupSelect"
                value={object?.id ?? ''}
                onChange={e => {
                  const selectedId = Number(e.target.value)
                  const selectedObject = objects?.find(
                    obj => obj.id === selectedId
                  )
                  setObject(selectedObject)
                }}
              >
                <option value="" disabled>
                  Select a group
                </option>
                {objects?.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {option === Option.Single && (
            <div>
              <label htmlFor="restaurantSelect">Restaurant:</label>
              <select
                id="restaurantSelect"
                value={object?.id ?? ''}
                onChange={e => {
                  const selectedId = Number(e.target.value)
                  const selectedObject = objects?.find(
                    obj => obj.id === selectedId
                  )
                  setObject(selectedObject)
                }}
              >
                <option value="" disabled>
                  Select a restaurant
                </option>
                {objects?.map(restaurant => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Statistics
