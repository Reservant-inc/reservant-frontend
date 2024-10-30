import React, { useState } from "react";
import Menu from "./ManagementTabs";
import Cookies from "js-cookie";
import RestaurantListSection from "./restaurants/restaurantsList/RestaurantListSection";
import EmployeeManagement from "./employees/EmployeeManagement";
import RestaurantDetails from "./restaurants/RestaurantDetails";
import ReservationOrderHeader from "./reservations/HistoryTab";
import { UserInfo } from "../../services/types";
import { MenuScreenType } from "../../services/enums";
import MenuList from "./menus/MenuList";
import EmployeeRestaurantManagement from "./employees/EmployeeRestaurantManagement";
import IngredientTable from "./Warehouse/IngredientTable";


const RestaurantManager = () => {
  const [activeRestaurantId, setActiveRestaurantId] = useState<number>(-1);
  const [activeName, setActiveName] = useState<string>("");
  const [activePage, setActivePage] = useState<number>(0);

  const handleChangeActiveRestaurant = (restaurantId: number) => {
    setActiveRestaurantId(restaurantId);
    setActivePage(3)
  };
  
  const user: UserInfo = JSON.parse(Cookies.get("userInfo") as string);

  return (
    <div className="flex h-[calc(100%-3.5rem)] w-full bg-grey-1 bg-grey-1 dark:bg-grey-6">
      <div className="z-[0] flex flex-col w-full">
        
        <div className="flex h-full w-full flex-col gap-6 p-6">
          <div className="h-full w-full flex flex-col">
            <div className="flex ">
              <div className="flex  w-full flex-col gap-2 dark:bg-grey-7">
                <Menu setActivePage={setActivePage} activePage={activePage} activeRestaurantId={activeRestaurantId} setActiveRestaurantId={setActiveRestaurantId} handleChangeActiveRestaurant={handleChangeActiveRestaurant}/>
              </div>
              <h1 className="text-xl text-nowrap px-12 ">{activePage>2 && activeName}</h1>
          </div>

            <div
              id="asdasd"
              className="h-[90%] w-full rounded-b-lg rounded-tr-lg shadow-md"
            >
              {
                {
                  0: <div className="w-full h-full items-center justify-center dark:bg-black dark:text-grey-1 rounded-tr-lg rounded-b-lg flex bg-white"> STATS / PERSONAL DASHBOARD </div>,
                  1: <RestaurantListSection
                        handleChangeActiveRestaurant={
                          handleChangeActiveRestaurant
                        }
                        setActiveName={setActiveName}
                      />,
                  2: <EmployeeManagement />,
                  3:  <RestaurantDetails
                        activeRestaurantId={activeRestaurantId}
                      />,
                  4: <EmployeeRestaurantManagement activeRestaurantId={activeRestaurantId}/>,
                  5: <div className="bg-white dark:bg-black p-3 rounded-lg h-full">
                      <MenuList activeRestaurantId={activeRestaurantId} type={MenuScreenType.Management}/>
                    </div>,
                  6: <IngredientTable activeRestaurantId={activeRestaurantId}/>,
                  7: <ReservationOrderHeader activeRestaurantId={activeRestaurantId} />, //order history ma być częścią reservations???
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
