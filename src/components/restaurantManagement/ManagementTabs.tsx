import {  ListItemButton } from "@mui/material";
import React from "react";
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp';
import LocalDiningSharpIcon from '@mui/icons-material/LocalDiningSharp';
import useWindowDimensions from "../../hooks/useWindowResize";
import { ArrowBack, Dashboard, Dining, History, Warehouse } from "@mui/icons-material";

interface MenuInterface {
    setActivePage: Function
    setActiveRestaurantId: Function
    activeRestaurantId: number
    activePage: number
    handleChangeActiveRestaurant: Function
}

const Menu:React.FC<MenuInterface> = ({ setActivePage, activePage, activeRestaurantId, setActiveRestaurantId }) => {
  
    const size = useWindowDimensions();

  return (
    <div id="menu-wrapper" className="text-sm">
      {(activeRestaurantId < 0) ? 
      <div className="flex gap-2">
        <div className="p-0">
          <ListItemButton
            id="menu-listItem-restaurants-button"
            className={` ${activePage === 0 ? "bg-white dark:bg-black" : "bg-grey-0 dark:bg-grey-5"}  dark:text-grey-1 w-full h-full rounded-t-lg px-4`}
            onClick={() => setActivePage(0)}
          >
            <div className="flex items-center gap-4">
              <Dashboard className='w-6 h-6' />
              {size.width > 700 &&
                <h1>
                  Dashboard
                </h1>
              }
            </div>
          </ListItemButton>
        </div>
        <div className="p-0">
          <ListItemButton
            id="menu-listItem-restaurants-button"
            className={` ${activePage === 1 ? "bg-white dark:bg-black" : "bg-grey-0 dark:bg-grey-5"}  dark:text-grey-1 w-full h-full rounded-t-lg px-4`}
            onClick={() => 
              setActivePage(1)
            }
          >
            <div className="flex items-center gap-4">
              <LocalDiningSharpIcon className='w-6 h-6' />
              {size.width > 700 &&
                <h1>
                  Restaurants
                </h1>
              }
            </div>
          </ListItemButton>
        </div>
        <div className="p-0">
          <ListItemButton
            id="menu-listItem-employees-all--button"
            className={` ${activePage === 2 ? "bg-white dark:bg-black" : "bg-grey-0 dark:bg-grey-5"}  dark:text-grey-1 w-full h-full rounded-t-lg px-4`}
            onClick={() => setActivePage(2)}
          >
            <div className="flex items-center gap-4 w-full">
              <PeopleAltSharpIcon
               className='w-6 h-6'
              />
              {size.width > 700 &&
              <h1>
                Employee management
              </h1>
              }
            </div>
          </ListItemButton>
        </div>
      </div>
      :
      <div className="flex gap-2">
        <div className="flex items-center justify-center pl-2">
          <ListItemButton
            id="menu-listItem-back-button"
            className={`  bg-grey-0 hover:bg-white dark:bg-grey-5 dark:hover:bg-black  dark:text-grey-1 w-8 h-8 rounded-full flex justify-center items-center `}
            onClick={() => {
              setActiveRestaurantId(-1);
              setActivePage(1);
            }}
          >
            <ArrowBack className='w-6 h-6' />
          </ListItemButton>
        </div>
        <div className="p-0">
          <ListItemButton
            id="menu-listItem-restaurant-dash-button"
            className={` ${activePage === 3 ? "bg-white dark:bg-black" : "bg-grey-0 dark:bg-grey-5"}  dark:text-grey-1 w-full h-full max-h-[40px] rounded-t-lg px-4`}
            onClick={() => {
              setActivePage(3);
            }}
          >
            <div className="flex items-center gap-4 w-full">
              <Dashboard className='w-6 h-6' />
              {size.width > 700 &&
                <h1 className="text-nowrap">
                  Restaurant dashboard
                </h1>
              }
            </div>
          </ListItemButton>
        </div>
        <div className="p-0">
          <ListItemButton
            id="menu-listItem-restaurant-emp-button"
            className={` ${activePage === 4 ? "bg-white dark:bg-black" : "bg-grey-0 dark:bg-grey-5"}  dark:text-grey-1 w-full h-full rounded-t-lg px-4`}
            onClick={() => {
              setActivePage(4);
            }}
          >
            <div className="flex items-center gap-4 w-full">
              <PeopleAltSharpIcon className='w-6 h-6' />
              {size.width > 700 &&
                <h1 className="text-nowrap">
                  Employee management
                </h1>
              }
            </div>
          </ListItemButton>
        </div>
        <div className="p-0">
          <ListItemButton
            id="menu-listItem-restaurant-menu-button"
            className={` ${activePage === 5 ? "bg-white dark:bg-black" : "bg-grey-0 dark:bg-grey-5"}  dark:text-grey-1 w-full h-full rounded-t-lg px-4`}
            onClick={() => {
              setActivePage(5);
            }}
          >
            <div className="flex items-center gap-4 w-full">
              <Dining className='w-6 h-6' />
              {size.width > 700 &&
                <h1 className="text-nowrap">
                  Menus management
                </h1>
              }
            </div>
          </ListItemButton>
        </div>
        <div className="p-0">
          <ListItemButton
            id="menu-listItem-restaurant-warehouse-button"
            className={` ${activePage === 6 ? "bg-white dark:bg-black" : "bg-grey-0 dark:bg-grey-5"}  dark:text-grey-1 w-full h-full rounded-t-lg px-4`}
            onClick={() => {
              setActivePage(6);
            }}
          >
            <div className="flex items-center gap-4 w-full">
              <Warehouse className='w-6 h-6' />
              {size.width > 700 &&
                <h1 className="text-nowrap">
                  Warehouse management
                </h1>
              }
            </div>
          </ListItemButton>
        </div>
        <div className="p-0">
          <ListItemButton
            id="menu-listItem-restaurant-history-button"
            className={` ${activePage === 7 ? "bg-white dark:bg-black" : "bg-grey-0 dark:bg-grey-5"}  dark:text-grey-1 w-full h-full rounded-t-lg px-4`}
            onClick={() => {
              setActivePage(7);
            }}
          >
            <div className="flex items-center gap-4 w-full">
              <History className='w-6 h-6' />
              {size.width > 700 &&
                <h1 className="text-nowrap">
                  Reservation history
                </h1>
              }
            </div>
          </ListItemButton>
        </div>
      </div>
      }
    </div>
  );
};

export default Menu;
