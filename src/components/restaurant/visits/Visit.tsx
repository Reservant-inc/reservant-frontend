import React, { useState } from "react";
import { RestaurantDetailsType } from "../../../services/types";
import MenuList from "../../restaurantManagement/menus/newMenus/MenuList";
import { MenuScreenType } from "../../../services/enums";
import Cart from "../Cart";

interface VisitProps {
    restaurant: RestaurantDetailsType
}


const Visit: React.FC<VisitProps> = ({ restaurant }) => {
    const [isOrdering, setIsOrdering] = useState<boolean>(false)

    return (
        <div className="h-[90vh] w-[50vw] min-w-[700px] flex justify-center items-center">
            {
                !isOrdering ? (
                    <div className="w-full h-full">
                        {/* reservation logic */}
                        <button onClick={() => setIsOrdering(true)}>Confirm</button>
                    </div>
                ) : (
                    <div className="relative w-full h-full px-3 py-3 flex flex-col gap-5 items-center">
                        <h1 className="text-2xl font-mont-bd dark:text-white">Order food for your reservation</h1>
                        <MenuList activeRestaurantId={restaurant.restaurantId} type={MenuScreenType.Order} />
                        <div className="flex flex-row-reverse w-full">
                            <button className="px-3 py-1 text-lg rounded-lg font-mont-md text-primary hover:text-white hover:bg-primary dark:hover:bg-secondary dark:hover:text-black dark:text-secondary border-[1px] border-primary dark:border-secondary">
                                Skip order
                            </button>
                        </div>
                        <Cart />
                    </div>
                )
            }
        </div>
    )
}

export default Visit