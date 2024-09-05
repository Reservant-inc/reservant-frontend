import React, { useState } from "react";
import Menu from "./Menu";
import Cookies from "js-cookie";
import RestaurantDashboardSection from "./Dashboard/RestaurantDashboardSection";
import RestaurantListSection from "./restaurants/restaurantsList/RestaurantListSection";
import EmployeeManagement from "./employees/EmployeeManagement";
import MenuManagement from "./menus/MenuMangement";
import RestaurantDetails from "./restaurants/RestaurantDetails";
import OrderHistory from "./reservations/OrderHistory";
import ReservationOrderHeader from "./reservations/ReservationOrderHeader";

const RestaurantManager = () => {
  const [activeRestaurantId, setActiveRestaurantId] = useState<number | null>(
    null,
  );
  const [activePage, setActivePage] = useState<number>(0);

  const user = JSON.parse(Cookies.get("userInfo") as string);

  const [activeSectionName, setActiveSectionName] = useState<string>(
    `Hello, ${user.firstName}`,
  );

  const handleChangeActiveRestaurant = (restaurantId: number) => {
    setActiveRestaurantId(restaurantId);
  };

  return (
    <div className="flex h-[calc(100%-3.5rem)] w-full bg-grey-1 bg-grey-1 dark:bg-grey-6">
      <div className="z-[0] flex w-full">
        <div className="flex h-full w-[16%] flex-col gap-2 bg-white shadow-md dark:bg-black">
          <Menu
            setActivePage={setActivePage}
            activePage={activePage}
            setActiveSectionName={setActiveSectionName}
            setActiveRestaurantId={setActiveRestaurantId}
          />
        </div>
        <div className="flex h-full w-[84%] flex-col gap-6 p-6">
          <div className="flex h-[10%] w-full items-center justify-between">
            <h1 className="font-mont-bd text-[35px]">{activeSectionName}</h1>
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-end">
                <h1 className="text-md font-mont-md">{`${user.firstName} ${user.lastName}`}</h1>
                <h1 className="font-mont-l text-sm">Owner</h1>
              </div>
              <img
                className="h-14 w-14 rounded-full"
                src="https://l-ldesign.com.au/2016/wp-content/uploads/2020/01/profile-pic-katie-square.jpg"
              />
            </div>
          </div>
          <div
            id="asdasd"
            className="h-[calc(90%-1.5rem)] w-full rounded-lg shadow-md"
          >
            {
              {
                0: <RestaurantDashboardSection />,
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
                3: <MenuManagement activeRestaurantId={1} />,
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
