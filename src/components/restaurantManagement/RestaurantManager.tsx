import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Cookies from "js-cookie";
import RestaurantDashboardSection from "./Dashboard/RestaurantDashboardSection";
import RestaurantListSection from "./restaurants/restaurantsList/RestaurantListSection";
import EmployeeManagement from "./employees/EmployeeManagement";
import MenuManagement from "./menus/MenuMangement";
import RestaurantDetails from "./restaurants/RestaurantDetails";
import OrderHistory from "./reservations/OrderHistory";
import ReservationOrderHeader from "./reservations/ReservationOrderHeader";
import { fetchGET, getImage } from "../../services/APIconn";
import { User, UserInfo } from "../../services/types";
import { AccountCircle } from "@mui/icons-material";
import { checkPrimeSync } from "crypto";
import { wait } from "@testing-library/user-event/dist/utils";
import DefaultPhoto from "../../assets/images/user.jpg";

const RestaurantManager = () => {
  const [activeRestaurantId, setActiveRestaurantId] = useState<number | null>(
    null
  );
  const [activePage, setActivePage] = useState<number>(0);

  const handleChangeActiveRestaurant = (restaurantId: number) => {
    setActiveRestaurantId(restaurantId);
  };

  const [user, setUser] = useState<UserInfo>(
    JSON.parse(Cookies.get("userInfo") as string)
  );

  const [activeSectionName, setActiveSectionName] = useState<string>(
    `Hello, ${user.firstName}`
  );

  return (
    <div className="flex flex-col h-full w-full bg-grey-1 dark:bg-grey-6 dark:text-white">
      {/* Menu na samej górze */}
      <div className="w-full bg-white shadow-md dark:bg-black">
        <Menu
          setActivePage={setActivePage}
          activePage={activePage}
          setActiveSectionName={setActiveSectionName}
          setActiveRestaurantId={setActiveRestaurantId}
        />
      </div>

      {/* Header z nazwą sekcji i informacjami o użytkowniku */}
      <div className="flex items-center justify-between p-6 bg-white shadow-md dark:bg-black">
        <h1 className="font-mont-bd text-[35px]">{activeSectionName}</h1>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <h1 className="font-mont-md text-md">{`${user.firstName} ${user.lastName}`}</h1>
            <h1 className="font-mont-l text-sm">Owner</h1>
          </div>
          <img
            className="h-14 w-14 rounded-full"
            src={getImage(user.photo, DefaultPhoto)}
            alt="User profile"
          />
        </div>
      </div>

      {/* Główna zawartość */}
      <div className="flex-grow p-6">
        <div className="h-full w-full rounded-lg shadow-md">
          {
            {
              0: <RestaurantDashboardSection />,
              1:
                activeRestaurantId === null ? (
                  <RestaurantListSection
                    handleChangeActiveRestaurant={handleChangeActiveRestaurant}
                    setActiveSectionName={setActiveSectionName}
                  />
                ) : (
                  <RestaurantDetails activeRestaurantId={activeRestaurantId} />
                ),
              2: <EmployeeManagement />,
              3: <MenuManagement activeRestaurantId={1} />,
              6: <ReservationOrderHeader activeRestaurantId={1} />, // Order history ma być częścią reservations?
            }[activePage]
          }
        </div>
      </div>
    </div>
  );
};

export default RestaurantManager;
