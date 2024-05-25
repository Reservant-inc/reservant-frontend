import React, { useState } from "react";
import Menu from "./Menu";
import Cookies from "js-cookie";
import { userInfo } from "os";
import RestaurantDashboardSection from "./Sections/RestaurantDashboardSection";
import RestaurantListSection from "./Sections/RestaurantList/RestaurantListSection";
import EmployeeManagement from "../EmployeeManagement/EmployeeManagement";
import MenuManagement from "../MenuManagement/MenuMangement";

const RestaurantManager = () => {
  const [editable, setEditable] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<number>(0)
  const [activeSectionName, setActiveSectionName] = useState<string>(`Hello, ${JSON.parse(Cookies.get("userInfo") as string).firstName}`)

  return (
    <div className="flex h-full w-full bg-grey-1 bg-grey-1 dark:bg-grey-3">
      <div className="z-[0] flex flex w-full">
        <div className="flex h-full w-[25rem] flex-col gap-2 bg-white shadow-md dark:bg-black">
          <Menu setActivePage={setActivePage} activePage={activePage} setActiveSectionName={setActiveSectionName}/>
        </div>
        <div className="flex h-full w-full flex-col gap-6 p-6">
          <div className="h-[4rem] w-full flex items-center">
            <h1 className="text-3xl font-bold">{activeSectionName}</h1>
            <div>

            </div>
          </div>
          <div className="h-[70vh] w-full bg-white rounded-sm shadow-md">
          {
            {
              0: <RestaurantDashboardSection />,
              1: <RestaurantListSection />,
              2: <EmployeeManagement />,
              3: <MenuManagement activeRestaurantId={1} />
            }[activePage]
          }
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantManager;
