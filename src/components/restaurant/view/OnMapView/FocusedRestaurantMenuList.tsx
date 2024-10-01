import React, { useEffect, useState } from 'react'
import MopedIcon from "@mui/icons-material/Moped";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { RestaurantDetailsType, ReviewType } from '../../../../services/types';
import Menu from '../../../restaurantManagement/menus/Menu';
import CustomRating from "../../../reusableComponents/CustomRating";
import { useTranslation } from 'react-i18next';
import { getImage } from '../../../../services/APIconn';
import DefaultImage from '../../../../assets/images/defaulImage.jpeg'

interface MenuProps {
    restaurant: RestaurantDetailsType
    reviews: ReviewType[]
}

const FocusedRestaurantDetails: React.FC<MenuProps> = ({ restaurant, reviews }) => {

    const [ t ] = useTranslation('global')
    
    const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length
    : 0;

    return (
      <div className='flex flex-col gap-7 h-[90vh] w-[50vw] bg-white dark:bg-black items-center rounded-lg pt-7'>
        <div className='flex gap-4 items-center w-[90%]'>
          <img src={getImage(restaurant.logo, DefaultImage)} className='w-[7rem] h-[7rem] rounded-lg'/>
          <div className="flex flex-col gap-2 w-[80%]">
            <h2 className="text-2xl font-bold dark:text-white">{restaurant.name}</h2>
            <div className="flex items-center gap-2 dark:text-white">
              <h1>{averageRating.toFixed(2)}</h1>
              <CustomRating rating={averageRating} readOnly={true}/>
              <h1>({reviews.length})</h1>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-sm dark:text-white">
                {restaurant.address}, {restaurant.city}
              </h1>
              <div className="text-sm flex items-center gap-3">
                {restaurant.provideDelivery && (
                  <div className="flex gap-2 items-center">
                    <MopedIcon className="dark:text-white w-5 h-5"/> 
                    <h1 className="dark:text-white">{t("home-page.delivery-fee")} 5,99 zł</h1>
                  </div>
                )}
                <div className="flex gap-1 items-center">
                  <h1 className="dark:text-white">
                    {t("home-page.is-delivering")}:
                  </h1>
                  {restaurant.provideDelivery ? (
                    <CheckCircleIcon className="text-green-500 dark:text-white w-5 h-5" />
                  ) : (
                    <CancelIcon className="text-red-500 dark:text-white w-5 h-5" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-[90%] flex justify-center'>
          <Menu activeRestaurant={restaurant.restaurantId}/>
        </div>
      </div>
    )
}

export default FocusedRestaurantDetails