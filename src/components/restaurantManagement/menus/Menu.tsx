import React, { useEffect, useState } from 'react'
import SearchIcon from "@mui/icons-material/Search";
import { RestaurantDetailsType } from '../../../services/types';

interface MenuProps {
    activeRestaurant: number
}

const Menu: React.FC<MenuProps> = (activeRestaurant) => {

    const [filterValue, setFilterValue] = useState<string>()
    
    useEffect(() => {
        //tutaj filtrowanie
    },[filterValue])

    return (
        <div className='w-full'>
            <div className="flex h-10 w-full items-center rounded-full border-[1px] border-grey-1 dark:border-grey-6 bg-grey-0 dark:bg-grey-5 px-2 font-mont-md">
                <input
                    type="text"
                    placeholder={"filter"}
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="clean-input h-8 w-full p-2 placeholder:text-grey-2 dark:text-grey-1"
                />
                <SearchIcon className="h-[25px] w-[25px] hover:cursor-pointer dark:text-grey-2" />
            </div>
        </div>
    )
}

export default Menu