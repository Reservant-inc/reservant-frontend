import React, { useState } from "react";
import Menu from "./Menu";
import Cookies from "js-cookie";
import RestaurantListSection from "./restaurants/restaurantsList/RestaurantListSection";
import EmployeeManagement from "./employees/EmployeeManagement";
import RestaurantDetails from "./restaurants/RestaurantDetails";
import ReservationOrderHeader from "./reservations/ReservationOrderHeader";
import { getImage } from "../../services/APIconn";
import { UserInfo } from "../../services/types";
import DefaultPhoto from "../../assets/images/user.jpg"
import { MenuScreenType } from "../../services/enums";
import MenuList from "./menus/newMenus/MenuList";


const RestaurantManager = () => {
  const [activeRestaurantId, setActiveRestaurantId] = useState<number | null>(
    null,
  );
  const [activePage, setActivePage] = useState<number>(0);

  const handleChangeActiveRestaurant = (restaurantId: number) => {
    setActiveRestaurantId(restaurantId);
  };
  
  const [user, setUser] = useState<UserInfo>(JSON.parse(Cookies.get("userInfo") as string));

  const [activeSectionName, setActiveSectionName] = useState<string>(`Hello, ${user.firstName}`)
  
  return (
    <div className="flex h-[calc(100%-3.5rem)] w-full bg-grey-1 bg-grey-1 dark:bg-grey-6">
      <div className="z-[0] flex w-full">
        <div className="flex h-full w-[16%] flex-col gap-2 bg-white shadow-md dark:bg-black">
          <Menu setActivePage={setActivePage} activePage={activePage} setActiveSectionName={setActiveSectionName} handleChangeActiveRestaurant={handleChangeActiveRestaurant}/>
        </div>
        <div className="flex h-full w-[84%] flex-col gap-6 p-6">
          <div className="flex h-[10%] w-full items-center justify-between">
            <h1 className="font-mont-bd text-[35px]">{activeSectionName}</h1>
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-end">
                <h1 className="font-mont-md text-md">{`${user.firstName} ${user.lastName}`}</h1>
                <h1 className="font-mont-l text-sm">Owner</h1>
              </div>
              <img className="h-14 w-14 rounded-full" src={getImage(user.photo, DefaultPhoto)}/>
            </div>
          </div>
          <div
            id="asdasd"
            className="h-[calc(90%-1.5rem)] w-full rounded-lg shadow-md"
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
                3: <div className="bg-white dark:bg-black p-3 rounded-lg h-full">
                    <MenuList activeRestaurantId={1} type={MenuScreenType.Management}/>
                  </div>,
                6: <ReservationOrderHeader activeRestaurantId={1} />, //order history ma być częścią reservations???
              }[activePage]
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantManager;
