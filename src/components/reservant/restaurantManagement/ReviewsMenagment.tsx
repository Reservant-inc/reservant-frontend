import React, { useEffect, useState } from 'react'
import RestaurantReviewsFilters from './restaurants/restaurantReviews/RestaurantReviewsFilters'
import RestaurantReview from './restaurants/restaurantReviews/RestaurantReview'
import { ReviewType, User } from '../../../services/types'
import { useTranslation } from 'react-i18next'
import { fetchGET } from '../../../services/APIconn'
import { Pagination, Tooltip } from '@mui/material'
import { SwapVert as SwapVertIcon } from '@mui/icons-material'
import { useParams } from 'react-router-dom'

const ReviewsManagement: React.FC = () => {
  const [filteredAndSortedReviews, setFilteredAndSortedReviews] = useState<
    ReviewType[] | null
  >(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [ratingFilter, setRatingFilter] = useState<number>(0) // Track selected rating filter
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { t } = useTranslation('global')
  const [perPage] = useState<number>(5)
  const [user, setUser] = useState<User | null>(null)

  const { restaurantId } = useParams()

  const activeRestaurantId =
    restaurantId === undefined ? -1 : parseInt(restaurantId)

  // Function to fetch reviews with filtering and sorting applied
  const fetchReviews = async () => {
    try {
      // Fetch data from API with the selected sort order and page settings
      const data = await fetchGET(
        `/restaurants/${activeRestaurantId}/reviews?page=${currentPage - 1}&perPage=${perPage}&orderBy=${
          sortOrder === 'asc' ? 'DateAsc' : 'DateDesc'
        }`
      )
      // Apply local filter for star rating
      const filteredReviews = data.items?.filter((review: ReviewType) => {
        return ratingFilter === 0 || review.stars === ratingFilter
      })

      setFilteredAndSortedReviews(filteredReviews || [])
      setTotalPages(data.totalPages || 0)
    } catch (error) {
      console.error('Error fetching restaurant reviews:', error)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchGET('/user')
        setUser(user)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [currentPage, perPage, activeRestaurantId, sortOrder, ratingFilter]) // Add ratingFilter as a dependency

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col gap-2 h-full w-full bg-white dark:bg-black dark:text-grey-1 rounded-lg p-4 relative">
        {' '}
        {/* Now the main container has a relative position */}
        {/* Filter and Sort Controls */}
        <div className="flex w-full gap-2">
          <RestaurantReviewsFilters
            setValue={setRatingFilter}
            value={ratingFilter}
          />
          <Tooltip title={t('reviews.sort')}>
            <button
              className="border-[1px] border-primary dark:border-secondary rounded-lg text-primary dark:text-secondary dark:hover:bg-secondary hover:bg-primary hover:text-white dark:hover:text-black"
              onClick={toggleSortOrder}
            >
              <SwapVertIcon />
            </button>
          </Tooltip>
        </div>
        {/* Display Filtered and Sorted Reviews */}
        <div className="flex-1 overflow-y-auto h-full ">
          {' '}
          {/* Scrollable review section */}
          {filteredAndSortedReviews === null ||
          filteredAndSortedReviews.length === 0 ? (
            <div className="text-center">
              <h1>{t('reviews.no-reviews')}</h1>
            </div>
          ) : (
            <div className="flex gap-2">
              {/* Kolumna 1 */}
              <div className="flex flex-col gap-2 w-1/2">
                {filteredAndSortedReviews
                  .filter((_, index) => index % 2 === 0) // Parzyste indeksy
                  .map(review => (
                    <RestaurantReview
                      key={review.reviewId}
                      review={review}
                      refreshReviews={fetchReviews}
                      user={user}
                      isOwnerView={true}
                      restaurantId={activeRestaurantId}
                    />
                  ))}
              </div>

              {/* Kolumna 2 */}
              <div className="flex flex-col gap-2 w-1/2">
                {filteredAndSortedReviews
                  .filter((_, index) => index % 2 !== 0) // Nieparzyste indeksy
                  .map(review => (
                    <RestaurantReview
                      key={review.reviewId}
                      review={review}
                      refreshReviews={fetchReviews}
                      user={user}
                      isOwnerView={true}
                      restaurantId={activeRestaurantId}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
        {/* Pagination at the Bottom */}
        <div className="flex justify-end absolute bottom-4 right-4">
          {' '}
          {/* Using absolute positioning for pagination */}
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            variant="outlined"
            shape="rounded"
          />
        </div>
      </div>
    </div>
  )
}

export default ReviewsManagement
