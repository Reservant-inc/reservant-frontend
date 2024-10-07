import React, { useEffect, useState } from 'react'
import MopedIcon from "@mui/icons-material/Moped";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { RestaurantDetailsType, ReviewType } from '../../../services/types';
import Menu from '../../restaurantManagement/menus/newMenus/MenuList';
import CustomRating from "../../reusableComponents/CustomRating";
import { useTranslation } from 'react-i18next';
import { getImage } from '../../../services/APIconn';
import DefaultImage from '../../../assets/images/defaulImage.jpeg'
import SearchIcon from "@mui/icons-material/Search";
import { MenuScreenType } from '../../../services/enums';

interface MenuProps {
    restaurant: RestaurantDetailsType
    reviews: ReviewType[]
}

const FocusedRestaurantDetails: React.FC<MenuProps> = ({ restaurant, reviews }) => {

    const [filterValue, setFilterValue] = useState<string>('')

    const [ t ] = useTranslation('global')
    
    const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length
    : 0;

    useEffect(() => {
      //tutaj filtrowanie
    },[filterValue])

    return (
      <div className='flex flex-col gap-7 h-[90vh] w-[50vw] min-w-[700px] bg-white dark:bg-black items-center rounded-lg p-3'>
        <div className='flex gap-4 items-center w-full h-[15%]'>
          <div className='flex gap-4 w-[60%]'>
            <img src={getImage(restaurant.logo, DefaultImage)} className='w-[7rem] h-[7rem] rounded-lg'/>
            <div className="flex flex-col w-[80%] justify-between">
              <h2 className="text-xl font-bold dark:text-white">{restaurant.name}</h2>
              <div className="flex items-center gap-2 dark:text-white">
                <h1 className='text-[16px]'>{averageRating.toFixed(2)}</h1>
                <CustomRating rating={averageRating} readOnly={true} className='text-[18px]'/>
                <h1 className='text-[16px]'>({reviews.length})</h1>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-[14px] dark:text-white">
                  {restaurant.address}, {restaurant.city}
                </h1>
                <div className="text-[14px] flex items-center gap-3">
                  {restaurant.provideDelivery && (
                    <div className="flex gap-2 items-center">
                      <MopedIcon className="dark:text-white w-4 h-4"/> 
                      <h1 className="text-[14px] dark:text-white">{t("home-page.delivery-fee")} 5,99 zł</h1>
                    </div>
                  )}
                  <div className="flex gap-1 items-center">
                    <h1 className="text-[12px] dark:text-white">
                      {t("home-page.is-delivering")}:
                    </h1>
                    {restaurant.provideDelivery ? (
                      <CheckCircleIcon className="text-green-500 dark:text-white w-4 h-4" />
                    ) : (
                      <CancelIcon className="text-red-500 dark:text-white w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='h-full w-[45%] flex flex-col-reverse'>
            <div className="flex h-8 items-center rounded-full border-[1px] border-grey-1 dark:border-grey-6 bg-grey-0 dark:bg-grey-5 px-2 font-mont-md">
                <input
                    type="text"
                    placeholder={"search by name"}
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="clean-input h-8 w-full p-2 placeholder:text-grey-2 dark:text-grey-1"
                />
                <SearchIcon className="h-6 w-6 hover:cursor-pointer dark:text-grey-2" />
            </div>
          </div>
          </div>
        <div className='w-[90%] flex justify-center h-[calc(85%-1.75rem)]'>
          <Menu activeRestaurantId={restaurant.restaurantId} type={MenuScreenType.Preview}/>
        </div>
      </div>
    )
}

export default FocusedRestaurantDetails