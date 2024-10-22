import {  ListItemButton } from "@mui/material";
import React, { useState } from "react";
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp';
import LocalDiningSharpIcon from '@mui/icons-material/LocalDiningSharp';
import useWindowDimensions from "../../hooks/useWindowResize";
import { ArrowBack, ArrowBackIos, Dashboard, Dining, History, TrendingUp, Warehouse } from "@mui/icons-material";

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
    <div id="menu-wrapper" className="">
      {(activeRestaurantId < 0) ? 
      <div className="flex gap-2">
        <div className="p-0">
          <ListItemButton
            id="menu-listItem-restaurants-button"
            className={` ${activePage === 0 ? "bg-white" : "bg-grey-0"} w-full h-full rounded-t-lg px-4`}
            onClick={() => setActivePage(0)}
          >
            <div className="flex items-center gap-4">
              <TrendingUp className='w-6 h-6' />
              {size.width > 700 &&
                <h1>
                  Stats
                </h1>
              }
            </div>
          </ListItemButton>
        </div>
        <div className="p-0">
          <ListItemButton
            id="menu-listItem-restaurants-button"
            className={` ${activePage === 1 ? "bg-white" : "bg-grey-0"} w-full h-full rounded-t-lg px-4`}
            onClick={() => 
              setActivePage(3)
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
            className={` ${activePage === 2 ? "bg-white" : "bg-grey-0"} w-full h-full rounded-t-lg px-4`}
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
        <div className="p-0">
          <ListItemButton
            id="menu-listItem-back-button"
            className={`  bg-white w-full h-full rounded-t-lg px-4`}
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
            className={` ${activePage === 3 ? "bg-white" : "bg-grey-0"} w-full h-full rounded-t-lg px-4`}
            onClick={() => {
              setActivePage(3);
            }}
          >
            <div className="flex items-center gap-4 w-full">
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
            id="menu-listItem-restaurant-emp-button"
            className={` ${activePage === 4 ? "bg-white" : "bg-grey-0"} w-full h-full rounded-t-lg px-4`}
            onClick={() => {
              setActivePage(4);
            }}
          >
            <div className="flex items-center gap-4 w-full">
              <PeopleAltSharpIcon className='w-6 h-6' />
              {size.width > 700 &&
                <h1>
                  Employee management
                </h1>
              }
            </div>
          </ListItemButton>
        </div>
        <div className="p-0">
          <ListItemButton
            id="menu-listItem-restaurant-menu-button"
            className={` ${activePage === 5 ? "bg-white" : "bg-grey-0"} w-full h-full rounded-t-lg px-4`}
            onClick={() => {
              setActivePage(5);
            }}
          >
            <div className="flex items-center gap-4 w-full">
              <Dining className='w-6 h-6' />
              {size.width > 700 &&
                <h1>
                  Menus management
                </h1>
              }
            </div>
          </ListItemButton>
        </div>
        <div className="p-0">
          <ListItemButton
            id="menu-listItem-restaurant-warehouse-button"
            className={` ${activePage === 6 ? "bg-white" : "bg-grey-0"} w-full h-full rounded-t-lg px-4`}
            onClick={() => {
              setActivePage(6);
            }}
          >
            <div className="flex items-center gap-4 w-full">
              <Warehouse className='w-6 h-6' />
              {size.width > 700 &&
                <h1>
                  Warehouse management
                </h1>
              }
            </div>
          </ListItemButton>
        </div>
        <div className="p-0">
          <ListItemButton
            id="menu-listItem-restaurant-history-button"
            className={` ${activePage === 7 ? "bg-white" : "bg-grey-0"} w-full h-full rounded-t-lg px-4`}
            onClick={() => {
              setActivePage(7);
            }}
          >
            <div className="flex items-center gap-4 w-full">
              <History className='w-6 h-6' />
              {size.width > 700 &&
                <h1>
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
