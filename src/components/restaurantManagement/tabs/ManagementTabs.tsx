import { ListItemButton } from "@mui/material";
import React, { useState } from "react";
import PeopleAltSharpIcon from "@mui/icons-material/PeopleAltSharp";
import LocalDiningSharpIcon from "@mui/icons-material/LocalDiningSharp";
import useWindowDimensions from "../../../hooks/useWindowResize";
import {
  ArrowBack,
  Dashboard,
  Dining,
  History,
  Warehouse,
} from "@mui/icons-material";
import ReviewsManagement from "../ReviewsMenagment";
import Tab from "./Tab";
import { useNavigate, useParams } from "react-router-dom";

const ManagementTabs: React.FC = ({}) => {
  const navigate = useNavigate();

  const size = useWindowDimensions();

  const { restaurantId } = useParams();

  return (
    <div id="menu-wrapper" className="text-sm">
      {restaurantId === undefined ? (
        <div className="flex gap-2">
          <Tab path="dashboard" title="Dashboard" icon={<Dashboard />} />
          <Tab
            path="restaurants"
            title="Restaurants"
            icon={<LocalDiningSharpIcon />}
          />
          <Tab
            path="employee-management"
            title="Employee management"
            icon={<PeopleAltSharpIcon />}
          />
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="flex items-center justify-center pl-2">
            <ListItemButton
              id="menu-listItem-back-button"
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-grey-0 hover:bg-white dark:bg-grey-5 dark:text-grey-1 dark:hover:bg-black `}
              onClick={() => navigate("restaurants")}
            >
              <ArrowBack className="h-6 w-6" />
            </ListItemButton>
          </div>
          <Tab
            path={`restaurant/${restaurantId}/restaurant-dashboard`}
            title="Restaurant dashboard"
            icon={<Dashboard />}
          />
          <Tab
            path={`restaurant/${restaurantId}/restaurant-employee-management`}
            title="Employee management"
            icon={<PeopleAltSharpIcon />}
          />
          <Tab
            path={`restaurant/${restaurantId}/menu-management`}
            title="Menu management"
            icon={<Dining />}
          />
          <Tab
            path={`restaurant/${restaurantId}/warehouse-management`}
            title="Warehouse management"
            icon={<Warehouse />}
          />
          <Tab
            path={`restaurant/${restaurantId}/reservation-history`}
            title="Reservation history"
            icon={<History />}
          />
          {/* <div className="p-0">
          <ListItemButton
            id="menu-listItem-restaurant-reviews-button"
            className={` ${activePage === 8 ? "bg-white dark:bg-black" : "bg-grey-0 dark:bg-grey-5"}  dark:text-grey-1 w-full h-full rounded-t-lg px-4`}
            onClick={() => {
              setActivePage(8);
            }}
          >
            <div className="flex items-center gap-4 w-full">
              <History className='w-6 h-6' />
              {size.width > 700 &&
                <h1 className="text-nowrap">
                  Reviews
                </h1>
              }
            </div>
          </ListItemButton>
        </div> */}
        </div>
      )}
    </div>
  );
};

export default ManagementTabs;