import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating
} from '@mui/material'
import CustomRating from '../../../../reusableComponents/CustomRating'
import { ReviewType, User } from '../../../../../services/types'
import {
  fetchPUT,
  fetchDELETE,
  fetchGET,
  getImage
} from '../../../../../services/APIconn'
import { useTranslation } from 'react-i18next'
import ConfirmationDialog from '../../../../reusableComponents/ConfirmationDialog'

interface RestaurantReviewProps {
  review: ReviewType
  refreshReviews: () => void
  user: User | null
  onReviewDeleted?: () => void
  isOwnerView?: boolean
  restaurantId: number
  isCustomerServiceView?: boolean
}

const RestaurantReview: React.FC<RestaurantReviewProps> = ({
  review,
  refreshReviews,
  user,
  onReviewDeleted,
  isOwnerView,
  restaurantId,
  isCustomerServiceView = false,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRespondDialogOpen, setIsRespondDialogOpen] = useState(false)
  const [isDeleteResponseDialogOpen, setIsDeleteResponseDialogOpen] =
    useState(false)
  const [editedStars, setEditedStars] = useState<number>(review.stars)
  const [editedContents, setEditedContents] = useState<string>(review.contents)
  const [responseContents, setResponseContents] = useState<string>(
    review.restaurantResponse || ''
  )
  const [restaurant, setRestaurant] = useState<{ name: string; logo: string | null } | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false) // State for expansion
  

  const [t] = useTranslation('global')

  // Pobieranie danych restauracji
  useEffect(() => {
  
      const fetchRestaurantData = async () => {
        try {
          const restaurantData = await fetchGET(`/restaurants/${restaurantId}`);
          setRestaurant({ name: restaurantData.name, logo: restaurantData.logo });
          console.log(restaurantData)
        } catch (error) {
          console.error('Błąd przy pobieraniu danych restauracji:', error);
        }
      };
      fetchRestaurantData();
    
  }, [isCustomerServiceView, restaurantId, review.restaurantResponse,]);

  const handleEditClick = () => {
    setEditedStars(review.stars)
    setEditedContents(review.contents)
    setIsEditDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsEditDialogOpen(false)
  }

  const handleSaveEdit = async () => {
    try {
      const updatedReview = {
        stars: editedStars,
        contents: editedContents
      }
      await fetchPUT(
        `/reviews/${review.reviewId}`,
        JSON.stringify(updatedReview)
      )
      refreshReviews()
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Error updating review:', error)
    }
  }

  const handleDeleteReview = async () => {
    try {
      await fetchDELETE(`/reviews/${review.reviewId}`)
      refreshReviews()
      onReviewDeleted && onReviewDeleted()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  const handleRespondClick = () => {
    setIsRespondDialogOpen(true)
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded) // Toggle the expansion state
  }

  const handleSaveResponse = async () => {
    try {
      const responseBody = {
        restaurantResponseText: responseContents // restaurant's response content
      }

      await fetchPUT(
        `/reviews/${review.reviewId}/restaurant-response`,
        JSON.stringify(responseBody)
      )

      // Close the dialog and refresh the reviews
      setIsRespondDialogOpen(false)
      refreshReviews()
    } catch (error) {
      console.error('Error saving restaurant response:', error)
    }
  }

  const handleDeleteResponse = async () => {
    try {
      await fetchDELETE(`/reviews/${review.reviewId}/restaurant-response`)
      setIsDeleteResponseDialogOpen(false)
      refreshReviews()
    } catch (error) {
      console.error('Error deleting restaurant response:', error)
    }
  }

  return (
    <div className="flex flex-col gap-1 p-2 rounded-lg dark:bg-grey-6 bg-grey-0">
      {isCustomerServiceView && restaurant && (
        <div className="flex items-center gap-4 mb-2">
          <p className="font-semibold text-lg">Restaurant: {restaurant.name}</p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 ">
          <Avatar className="h-7 w-7">
            <h1 className="text-sm">
              {`${review.authorFullName.split(' ')[0].charAt(0)}${review.authorFullName.split(' ')[0].charAt(0)}`}
            </h1>
          </Avatar>
          <p className="text-sm">{review.authorFullName}</p>
          <p className="text-sm">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
        <CustomRating
          rating={review.stars}
          readOnly={true}
          className="text-[20px]"
        />
      </div>

      <div className="review-content flex flex-col items-start p-1">
        <h1>
          <h1 className="text-sm">
            {isExpanded || review.contents.length <= 100
              ? review.contents
              : `${review.contents.substring(0, 100)}...`}
          </h1>
          {review.contents.length > 100 && !isExpanded && (
            <span
              className="text-grey-2 cursor-pointer text-sm"
              onClick={toggleExpand}
            >
              {t('general.read-more')}
            </span>
          )}
          {isExpanded && (
            <span
              className="text-grey-2 cursor-pointer text-sm"
              onClick={toggleExpand}
            >
              {t('general.read-less')}
            </span>
          )}
        </h1>
      </div>

      <div className="flex items-center">
        {review.dateEdited && (
          <span className="flex-grow italic text-xs text-grey-3">
            {t('reviews.edited-at')}:{' '}
            {new Date(review.dateEdited).toLocaleDateString()}
          </span>
        )}
        <div className="review-actions flex items-center gap-1 ml-auto">
          {!isCustomerServiceView && review.authorId === user?.userId && (
            <>
              <Button
                id="RestaurantReviewEditButton"
                className="rounded-lg text-primary dark:text-secondary"
                onClick={handleEditClick}
              >
                {t('general.edit')}
              </Button>
              <Button
                id="RestaurantReviewDeleteButton"
                className="rounded-lg text-primary dark:text-secondary"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                {t('general.delete')}
              </Button>
            </>
          )}
          {user?.roles?.includes('RestaurantOwner') && isOwnerView && (
            <Button
              onClick={handleRespondClick}
              className="text-primary dark:text-secondary"
            >
              {review.restaurantResponse ? '' : t('reviews.respond')}
            </Button>
          )}
        </div>
      </div>

      {review.restaurantResponse && (
        <div className="bg-grey-1 dark:bg-grey-5 response-section p-4 rounded-lg border-l-4 border-primary dark:border-secondary flex items-start gap-4">
          <Avatar
            src={getImage(restaurant?.logo || '', '/path/to/default/logo.png')}
            alt="Restaurant Logo"
          />
          
          <div className="response-content flex-grow text-sm">
            <p>{new Date(review.answeredAt).toLocaleDateString()}</p>
            <p >{review.restaurantResponse}</p>
            {!isCustomerServiceView && (
              <div className="flex justify-end">
                <Button
                  onClick={handleRespondClick}
                  className="text-primary dark:text-secondary pb-0"
                >
                  {t('reviews.edit-response')}
                </Button>
                <Button
                  onClick={() => setIsDeleteResponseDialogOpen(true)}
                  className="text-primary dark:text-secondary pb-0"
                >
                  {t('general.delete')}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{t('reviews.edit-review')}</DialogTitle>
        <DialogContent>
          <h2>{t('reviews.rating')}:</h2>
          <Rating
            name="star-rating-edit"
            value={editedStars}
            onChange={(event, newValue) =>
              setEditedStars(newValue || review.stars)
            }
          />
          <textarea
            rows={4}
            value={editedContents}
            onChange={e => setEditedContents(e.target.value)}
            className="w-full p-4 border rounded dark:bg-grey-700 dark:text-white dark:border-grey-500"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            className="text-primary dark:text-secondary"
          >
            {t('general.cancel')}
          </Button>
          <Button
            onClick={handleSaveEdit}
            className="text-primary dark:text-secondary"
          >
            {t('general.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isRespondDialogOpen}
        onClose={() => setIsRespondDialogOpen(false)}
      >
        <DialogTitle>{t('reviews.add-response')}</DialogTitle>
        <DialogContent>
          <textarea
            rows={4}
            value={responseContents}
            onChange={e => setResponseContents(e.target.value)}
            className="w-[400px] p-4 border rounded dark:bg-grey-700 dark:text-white dark:border-grey-500"
            placeholder={t('reviews.response-placeholder')}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsRespondDialogOpen(false)}
            className="text-primary dark:text-secondary"
          >
            {t('general.cancel')}
          </Button>
          <Button
            onClick={handleSaveResponse}
            className="text-primary dark:text-secondary"
          >
            {t('general.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={isDeleteResponseDialogOpen}
        onClose={() => setIsDeleteResponseDialogOpen(false)}
        onConfirm={handleDeleteResponse}
        confirmationText={t('reviews.response-delete-confirmation')}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteReview}
        confirmationText={t('reviews.review-delete')}
      />
    </div>
  )
}

export default RestaurantReview
