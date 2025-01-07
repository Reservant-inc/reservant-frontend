import React, { useEffect, useState } from 'react'
import { StatisticsScope } from '../../../../services/enums'
import { StatisticsProps } from './Dashboard'
import { useTranslation } from 'react-i18next'
import { StatisticsType } from '../../../../services/types'
import { FetchError } from '../../../../services/Errors'
import { fetchGET } from '../../../../services/APIconn'
import { format, subMonths, subWeeks } from 'date-fns'

enum Option {
  All = 'All',
  Group = 'Group',
  Single = 'Single'
}

enum TimePeriod {
  PastMonth = 'pastMonth',
  Past6Months = 'past6Months',
  PastYear = 'pastYear'
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

  const [popularItemsStats, setPopularItemsStats] = useState<
    { date: string; statistic: StatisticsType['popularItems'] }[]
  >([])
  const [customerCountStats, setCustomerCountStats] = useState<
    { date: string; statistic: StatisticsType['customerCount'] }[]
  >([])
  const [revenueStats, setRevenueStats] = useState<
    { date: string; statistic: StatisticsType['revenue'] }[]
  >([])
  const [reviewsStats, setReviewsStats] = useState<
    { date: string; statistic: StatisticsType['reviews'] }[]
  >([])

  const [timePeriod, setTimePeriod] = useState<TimePeriod>(TimePeriod.PastMonth)

  //assigns api route based on selected option. Empty strig if the object is not selected to avoid undefined value.
  const apiRoutes: Record<Option, string> = {
    [Option.All]: '',
    [Option.Group]: object
      ? `/my-restaurant-groups/${object.id}/statistics`
      : '',
    [Option.Single]: object ? `/my-restaurants/${object.id}/statistics` : ''
  }

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
    setTimePeriod(TimePeriod.PastMonth)
  }, [option])

  //checks whether object is undefined so as to not call the method on initial page load
  useEffect(() => {
    object != undefined && fetchStatistics()
  }, [object, timePeriod])

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

  const fetchDataForTimePeriod = async (startDate: Date, endDate: Date) => {
    const response = await fetchGET(
      `${apiRoutes[option]}?dateFrom=${format(startDate, 'yyyy-MM-dd')}&dateUntil=${format(endDate, 'yyyy-MM-dd')}`
    )
    return response
  }

  const formatTimePeriod = (startDate: Date, endDate: Date): string => {
    const formattedStartDate = format(startDate, 'MMMM dd, yyyy')
    const formattedEndDate = format(endDate, 'MMMM dd, yyyy')

    return `${formattedStartDate} - ${formattedEndDate}`
  }

  const fetchStatistics = async () => {
    let currentDate = new Date()

    let popularItems: {
      date: string
      statistic: StatisticsType['popularItems']
    }[] = []
    let customerCount: {
      date: string
      statistic: StatisticsType['customerCount']
    }[] = []
    let revenue: { date: string; statistic: StatisticsType['revenue'] }[] = []
    let reviews: { date: string; statistic: StatisticsType['reviews'] }[] = []

    switch (timePeriod) {
      case TimePeriod.PastMonth:
        for (let i = 0; i < 4; i++) {
          const startOfWeek = subWeeks(currentDate, i)
          const endOfWeek = subWeeks(currentDate, i - 1)
          const statistics = await fetchDataForTimePeriod(
            startOfWeek,
            endOfWeek
          )

          const date = formatTimePeriod(startOfWeek, endOfWeek)

          popularItems.push({
            date: date,
            statistic: statistics.popularItems
          })
          customerCount.push({
            date: date,
            statistic: statistics.customerCount
          })
          revenue.push({
            date: date,
            statistic: statistics.revenue
          })
          reviews.push({
            date: date,
            statistic: statistics.reviews
          })
        }
        break

      case TimePeriod.Past6Months:
        for (let i = 0; i < 6; i++) {
          const startOfMonth = subMonths(currentDate, i)
          const endOfMonth = subMonths(currentDate, i - 1)
          const statistics = await fetchDataForTimePeriod(
            startOfMonth,
            endOfMonth
          )

          const date = formatTimePeriod(startOfMonth, endOfMonth)

          popularItems.push({
            date: date,
            statistic: statistics.popularItems
          })
          customerCount.push({
            date: date,
            statistic: statistics.customerCount
          })
          revenue.push({
            date: date,
            statistic: statistics.revenue
          })
          reviews.push({
            date: date,
            statistic: statistics.reviews
          })
        }

        break

      case TimePeriod.PastYear:
        for (let i = 0; i < 12; i++) {
          const startOfYearMonth = subMonths(currentDate, i)
          const endOfYearMonth = subMonths(currentDate, i - 1)
          const statistics = await fetchDataForTimePeriod(
            startOfYearMonth,
            endOfYearMonth
          )

          const date = formatTimePeriod(startOfYearMonth, endOfYearMonth)

          popularItems.push({
            date: date,
            statistic: statistics.popularItems
          })
          customerCount.push({
            date: date,
            statistic: statistics.customerCount
          })
          revenue.push({
            date: date,
            statistic: statistics.revenue
          })
          reviews.push({
            date: date,
            statistic: statistics.reviews
          })
        }
        break

      default:
        break
    }
    setPopularItemsStats(popularItems)
    setCustomerCountStats(customerCount)
    setRevenueStats(revenue)
    setReviewsStats(reviews)
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
      {object && (
        <div>
          <label htmlFor="timePeriodSelect">Select Time Period:</label>
          <select
            id="timePeriodSelect"
            value={timePeriod}
            onChange={e => setTimePeriod(e.target.value as TimePeriod)}
          >
            <option value={TimePeriod.PastMonth}>Past Month</option>
            <option value={TimePeriod.Past6Months}>Past 6 Months</option>
            <option value={TimePeriod.PastYear}>Past Year</option>
          </select>
        </div>
      )}
      <div>
        {popularItemsStats.map(obj => (
          <div>
            <h1>{obj.date}</h1>
            <h1>{obj.statistic.toString()}</h1>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Statistics
