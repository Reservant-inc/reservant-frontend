import React, { useState } from "react";
import Menu from "./Menu";
import Cookies from "js-cookie";
import RestaurantListSection from "./restaurants/restaurantsList/RestaurantListSection";
import EmployeeManagement from "./employees/EmployeeManagement";
import RestaurantDetails from "./restaurants/RestaurantDetails";
import ReservationOrderHeader from "./reservations/ReservationOrderHeader";
import { UserInfo } from "../../services/types";
import { MenuScreenType } from "../../services/enums";
import MenuList from "./menus/MenuList";


const RestaurantManager = () => {
  const [activeRestaurantId, setActiveRestaurantId] = useState<number | null>(
    null,
  );
  const [activePage, setActivePage] = useState<number>(1);

  const handleChangeActiveRestaurant = (restaurantId: number) => {
    setActiveRestaurantId(restaurantId);
  };
  
  const user: UserInfo = JSON.parse(Cookies.get("userInfo") as string);

  const [activeSectionName, setActiveSectionName] = useState<string>(`Hello, ${user.firstName}`)
  
  return (
    <div className="flex h-[calc(100%-3.5rem)] w-full bg-grey-1 bg-grey-1 dark:bg-grey-6">
      <div className="z-[0] flex flex-col w-full">
        
        <div className="flex h-full w-full flex-col gap-6 p-6">
          <div className="h-full w-full flex flex-col">
            <div className="flex  w-full flex-col gap-2 dark:bg-black">
              <Menu setActivePage={setActivePage} activePage={activePage} setActiveSectionName={setActiveSectionName} handleChangeActiveRestaurant={handleChangeActiveRestaurant}/>
            </div>
            <div
              id="asdasd"
              className="h-[90%] w-full rounded-b-lg rounded-tr-lg shadow-md"
            >
              {
                {
                  1:
                    activeRestaurantId === null ? (
                      <RestaurantListSection
                        handleChangeActiveRestaurant={
                          handleChangeActiveRestaurant
                        }
                        setActiveSectionName={setActiveSectionName}
                      />
                    ) : (
                      <RestaurantDetails
                        activeRestaurantId={activeRestaurantId}
                      />
                    ),
                  2: <EmployeeManagement />,
                  3: <div className="bg-white dark:bg-black p-3 rounded-tr-lg rounded-b-lg h-full">
                      <MenuList activeRestaurantId={1} type={MenuScreenType.Management}/>
                    </div>,
                  6: <ReservationOrderHeader activeRestaurantId={1} />, //order history ma być częścią reservations???
                }[activePage]
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RestaurantManager;
