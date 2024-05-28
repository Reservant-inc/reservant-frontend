import React, { useState } from "react";
import Menu from "./Menu";
import Cookies from "js-cookie";
import { userInfo } from "os";
import RestaurantDashboardSection from "./Sections/RestaurantDashboardSection";
import RestaurantListSection from "./Sections/RestaurantList/RestaurantListSection";
import EmployeeManagement from "../EmployeeManagement/EmployeeManagement";
import MenuManagement from "../MenuManagement/MenuMangement";
import useWindowDimensions from "../../../hooks/useWindowResize";

const RestaurantManager = () => {
  const [editable, setEditable] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<number>(0)
  const [activeSectionName, setActiveSectionName] = useState<string>(`Hello, ${JSON.parse(Cookies.get("userInfo") as string).firstName}`)

  const size = useWindowDimensions();

  return (
    <div className="flex h-[94%] w-full bg-grey-1 bg-grey-1 dark:bg-grey-3">
      <div className="z-[0] flex w-full">
        { size.width>810 &&
        <div className="flex h-full w-[15%] flex-col gap-2 bg-white shadow-md dark:bg-black">  
            <Menu setActivePage={setActivePage} activePage={activePage} setActiveSectionName={setActiveSectionName}/>
        </div>
        }  
        <div className={`${size.width>810?"w-[85%]":" w-[100%]"} flex h-full  flex-col gap-6 p-6 dark: text-grey-1`}>
          <div className="h-[5%] w-full flex items-center">
            <h1 className="text-3xl font-bold">{activeSectionName}</h1>
            <div>

            </div>
          </div>
          <div className="h-[calc(95%-1.5rem)] w-full bg-white dark:bg-black dark:text-grey-1 rounded-lg shadow-md">
          {
            {
              0: <RestaurantDashboardSection />,
              1: <RestaurantListSection />,
              2: <EmployeeManagement/>,
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
