import React, { useEffect, useState } from 'react'
import MopedIcon from "@mui/icons-material/Moped";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { RestaurantDetailsType, ReviewType } from '../../../services/types';
import Menu from '../../restaurantManagement/menus/MenuList';
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
        <div className='w-full flex justify-center h-[calc(85%-1.75rem)]'>
          <Menu activeRestaurantId={restaurant.restaurantId} type={MenuScreenType.Preview}/>
        </div>
      </div>
    )
}

export default FocusedRestaurantDetails