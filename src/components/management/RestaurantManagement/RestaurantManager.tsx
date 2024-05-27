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

  const user = JSON.parse(Cookies.get("userInfo") as string)

  const [activeSectionName, setActiveSectionName] = useState<string>(`Hello, ${user.firstName}`)

  return (
    <div className="flex h-[94%] w-full bg-grey-1 bg-grey-1 dark:bg-grey-3">
      <div className="z-[0] flex w-full">
        <div className="flex h-full w-[16%] flex-col gap-2 bg-white shadow-md dark:bg-black">
          <Menu setActivePage={setActivePage} activePage={activePage} setActiveSectionName={setActiveSectionName}/>
        </div>
        <div className="flex h-full w-[84%] flex-col gap-6 p-6">
          <div className="h-[10%] w-full flex justify-between items-center">
            <h1 className="text-[35px] font-mont-bd">{activeSectionName}</h1>
            <div className="flex justify-center items-center gap-4">
              <div className="flex flex-col items-end">
                <h1 className="font-mont-md text-md">{`${user.firstName} ${user.lastName}`}</h1>
                <h1 className="font-mont-l text-sm">Owner</h1>
              </div>
              <img className="h-14 w-14 rounded-full" src="https://l-ldesign.com.au/2016/wp-content/uploads/2020/01/profile-pic-katie-square.jpg"/>
            </div>
          </div>
          <div className="h-[calc(90%-1.5rem)] w-full bg-white rounded-lg shadow-md">
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
