import React, { useEffect, useState } from 'react'
import { StatisticsScope } from '../../../../services/enums'
import { StatisticsProps } from './Dashboard'
import { useTranslation } from 'react-i18next'
import { MenuItemType, StatisticsType } from '../../../../services/types'
import { FetchError } from '../../../../services/Errors'
import { fetchGET } from '../../../../services/APIconn'
import { format, subMonths, subWeeks } from 'date-fns'
import { BarChart } from '@mui/x-charts/BarChart'

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

type datasetType = {
  date: string
  statistic:
    | StatisticsType['popularItems']
    | StatisticsType['customerCount']
    | StatisticsType['revenue']
    | StatisticsType['reviews']
}

const Statistics: React.FC<StatisticsProps> = ({ scope }) => {
  const [t] = useTranslation('global')

  const [option, setOption] = useState<Option>(
    scope === StatisticsScope.All ? Option.Group : Option.Single
  )

  //these can be restaurants or groups, depending on selected option.
  const [objects, setObjects] = useState<{ name: string; id: number }[]>()

  //selected object assigned based on optional select.
  const [object, setObject] = useState<{ name: string; id: number }>()

  const [popularItemsStats, setPopularItemsStats] = useState<datasetType[]>([])
  const [customerCountStats, setCustomerCountStats] = useState<datasetType[]>(
    []
  )
  const [revenueStats, setRevenueStats] = useState<datasetType[]>([])
  const [reviewsStats, setReviewsStats] = useState<datasetType[]>([])

  const [timePeriod, setTimePeriod] = useState<TimePeriod>(TimePeriod.PastMonth)

  //assigns api route based on selected option. Empty strig if the object is not selected to avoid undefined value.
  const apiRoutes: Record<Option, string> = {
    [Option.All]: '/my-restaurants/statistics',
    [Option.Group]: object
      ? `/my-restaurant-groups/${object.id}/statistics`
      : '',
    [Option.Single]: object ? `/my-restaurants/${object.id}/statistics` : ''
  }

  useEffect(() => {
    switch (option) {
      case Option.All:
        fetchStatistics()
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
    setPopularItemsStats([])
    setCustomerCountStats([])
    setRevenueStats([])
    setReviewsStats([])
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
    const formattedStartDate = format(startDate, 'dd.MM.yy')
    const formattedEndDate = format(endDate, 'dd.MM.yy')

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

  console.log(customerCountStats.map(stat => stat.date).reverse())
  console.log(customerCountStats.map(stat => stat.date))

  return (
    <div className="p-4 h-full w-full flex flex-col gap-4">
      <div className="flex w-full">
        <h1 className="text-lg font-mont-bd">
          {t('restaurant-management.statistics.statistics')}
        </h1>
      </div>
      <div className="flex gap-4">
        {scope === StatisticsScope.All && (
          <>
            <div className="flex gap-2 items-center">
              <h1 className="text-sm font-mont-bd">Group:</h1>
              <select
                value={option}
                onChange={e => {
                  setOption(e.target.value as Option)
                }}
                className="border-[1px] rounded-md border-grey-4 pr-8 py-1 text-sm h-8"
              >
                <option value={Option.All}>All restaurants</option>
                <option value={Option.Group}>Restaurant group</option>
                <option value={Option.Single}>Restaurant</option>
              </select>
            </div>

            {option === Option.Group && (
              <div className="flex gap-2 items-center">
                <h1 className="text-sm font-mont-bd">Group:</h1>
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
                  className="border-[1px] rounded-md border-grey-4 pr-8 py-1 text-sm h-8"
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
              <div className="flex gap-2 items-center">
                <h1 className="text-sm font-mont-bd">Restaurant:</h1>
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
                  className="border-[1px] rounded-md border-grey-4 pr-8 py-1 text-sm h-8"
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
        {(object || option === Option.All) && (
          <div className="flex gap-2 items-center">
            <h1 className="text-sm font-mont-bd">Time period:</h1>
            <select
              id="timePeriodSelect"
              value={timePeriod}
              onChange={e => setTimePeriod(e.target.value as TimePeriod)}
              className="border-[1px] rounded-md border-grey-4 pr-8 py-1 text-sm h-8"
            >
              <option value={TimePeriod.PastMonth}>Past Month</option>
              <option value={TimePeriod.Past6Months}>Past 6 Months</option>
              <option value={TimePeriod.PastYear}>Past Year</option>
            </select>
          </div>
        )}
      </div>
      <div className="flex h-full w-full gap-4 p-4 bg-grey-0 rounded-lg">
        <div className="h-full w-1/4 min-w-[300px]">
          <h1>Customer count:</h1>
          {customerCountStats.length > 0 ? (
            <BarChart
              xAxis={[
                {
                  scaleType: 'band',
                  data: customerCountStats.map(stat => stat.date).reverse(),
                  tickLabelStyle: {
                    angle: -45,
                    textAnchor: 'end',
                    fontSize: 10
                  }
                }
              ]}
              yAxis={[
                {
                  label: 'Customer count'
                }
              ]}
              series={[
                {
                  type: 'bar',
                  data: customerCountStats
                    .map(stat => {
                      const customerCount = stat.statistic as {
                        date: string
                        customers: number
                      }[]

                      const result = customerCount.reduce(
                        (sum, item) => sum + item.customers,
                        0
                      )

                      return result
                    })
                    .reverse()
                }
              ]}
              grid={{ horizontal: true }}
              barLabel="value"
              margin={{ bottom: 100 }}
              width={350}
              height={350}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <h1 className="text-sm text-grey-2">No data available</h1>
            </div>
          )}
        </div>
        <div className="h-full w-1/4 min-w-[300px]">
          <h1>Revenue:</h1>
          {revenueStats.length > 0 ? (
            <BarChart
              xAxis={[
                {
                  scaleType: 'band',
                  data: revenueStats.map(stat => stat.date).reverse(),
                  tickLabelStyle: {
                    angle: -45,
                    textAnchor: 'end',
                    fontSize: 10
                  }
                }
              ]}
              yAxis={[{ label: 'Revenue' }]}
              series={[
                {
                  type: 'bar',
                  data: revenueStats
                    .map(stat => {
                      const revenueCount = stat.statistic as {
                        date: string
                        revenue: number
                      }[]

                      const result = revenueCount.reduce(
                        (sum, item) => sum + item.revenue,
                        0
                      )

                      return result
                    })
                    .reverse()
                }
              ]}
              grid={{ horizontal: true }}
              margin={{ bottom: 100 }}
              barLabel="value"
              width={350}
              height={350}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <h1 className="text-sm text-grey-2">No data available</h1>
            </div>
          )}
        </div>
        <div className="h-full w-1/4 min-w-[300px]">
          <h1>Review:</h1>
          {reviewsStats.length > 0 ? (
            <BarChart
              xAxis={[
                {
                  scaleType: 'band',
                  data: reviewsStats.map(stat => stat.date).reverse(),
                  tickLabelStyle: {
                    angle: -45,
                    textAnchor: 'end',
                    fontSize: 10
                  }
                }
              ]}
              yAxis={[{ label: 'Reviews' }]}
              series={[
                {
                  type: 'bar',
                  data: reviewsStats
                    .map(stat => {
                      const reviewsCount = stat.statistic as {
                        date: string
                        count: number
                      }[]

                      const result = reviewsCount.reduce(
                        (sum, item) => sum + item.count,
                        0
                      )

                      return result
                    })
                    .reverse()
                }
              ]}
              grid={{ horizontal: true }}
              margin={{ bottom: 100 }}
              barLabel="value"
              width={350}
              height={350}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <h1 className="text-sm text-grey-2">No data available</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Statistics
