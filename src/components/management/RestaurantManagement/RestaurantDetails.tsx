import React, { useEffect, useState } from "react";
import EmployeeManagement from "../EmployeeManagement/EmployeeManagement";
import { RestaurantDetailsProps } from "../../../services/interfaces";
import { RestaurantDetailsType } from "../../../services/types";
import { fetchGET } from "../../../services/APIconn";
import { useNavigate } from "react-router-dom";
import Section from "./ManagementSection";

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  activeRestaurantId,
}) => { 
  const [restaurant, setRestaurant] = useState<RestaurantDetailsType>();
  const [page, setActivePage] = useState<number>(0)

  useEffect(() => {
    if (activeRestaurantId != null) {
      const fetchData = async () => {
        try {
          const data = await fetchGET(`/my-restaurants/${activeRestaurantId}`);
          setRestaurant(data);
        } catch (error) {
          console.error("Error fetching groups: ", error);
        }
      };

      fetchData();
    }
  }, [activeRestaurantId]);

  return (
    <div className="flex w-full flex rounded-xl py-4 pr-4 gap-4">
      <div className="rounded-xl w-full dark:bg-black bg-white">
        { 
          {
            0: <EmployeeManagement activeRestaurantId={activeRestaurantId} />,
            1: <div/>
          }[page]
        }
      </div>
      <div className="w-[32rem] flex gap-[2px]">
        <div className="relative w-[4rem] rounded-l-xl dark:bg-black bg-white">
          <div className="py-2 flex flex-col items-center">
            <Section currentPage={page} desiredPage={0} setActivePage={setActivePage} component={
              <svg className="h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1251_98416)">
                <path fillRule="evenodd" clipRule="evenodd" d="M9 0C5.96243 0 3.5 2.46243 3.5 5.5C3.5 8.53757 5.96243 11 9 11C12.0376 11 14.5 8.53757 14.5 5.5C14.5 2.46243 12.0376 0 9 0ZM5.5 5.5C5.5 3.567 7.067 2 9 2C10.933 2 12.5 3.567 12.5 5.5C12.5 7.433 10.933 9 9 9C7.067 9 5.5 7.433 5.5 5.5Z"/>
                <path d="M15.5 0C14.9477 0 14.5 0.447715 14.5 1C14.5 1.55228 14.9477 2 15.5 2C17.433 2 19 3.567 19 5.5C19 7.433 17.433 9 15.5 9C14.9477 9 14.5 9.44771 14.5 10C14.5 10.5523 14.9477 11 15.5 11C18.5376 11 21 8.53757 21 5.5C21 2.46243 18.5376 0 15.5 0Z"/>
                <path d="M19.0837 14.0157C19.3048 13.5096 19.8943 13.2786 20.4004 13.4997C22.5174 14.4246 24 16.538 24 19V21C24 21.5523 23.5523 22 23 22C22.4477 22 22 21.5523 22 21V19C22 17.3613 21.0145 15.9505 19.5996 15.3324C19.0935 15.1113 18.8625 14.5217 19.0837 14.0157Z"/>
                <path d="M6 13C2.68629 13 0 15.6863 0 19V21C0 21.5523 0.447715 22 1 22C1.55228 22 2 21.5523 2 21V19C2 16.7909 3.79086 15 6 15H12C14.2091 15 16 16.7909 16 19V21C16 21.5523 16.4477 22 17 22C17.5523 22 18 21.5523 18 21V19C18 15.6863 15.3137 13 12 13H6Z"/>
                </g>
              </svg>  
            }/>
            <Section currentPage={page} desiredPage={1} setActivePage={setActivePage} component={
              <svg className="h-6 w-6" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 226.014 226.014">
                <g>
                  <path d="M113.009,226.013c62.31,0,113.005-50.693,113.005-113.006S175.318,0.001,113.009,0.001C50.695,0.001,0,50.694,0,113.007
                    S50.695,226.013,113.009,226.013z M113.009,15.001c54.041,0,98.005,43.965,98.005,98.006s-43.964,98.006-98.005,98.006
                    C58.965,211.013,15,167.048,15,113.007S58.965,15.001,113.009,15.001z"/>
                  <path d="M113.009,179.855c36.858,0,66.847-29.988,66.847-66.848c0-36.861-29.988-66.848-66.847-66.848
                    c-36.862,0-66.85,29.986-66.85,66.848C46.159,149.866,76.146,179.855,113.009,179.855z M113.009,61.159
                    c28.587,0,51.847,23.258,51.847,51.848c0,28.588-23.26,51.848-51.847,51.848c-28.591,0-51.85-23.26-51.85-51.848
                    C61.159,84.417,84.418,61.159,113.009,61.159z"/>
                </g>
              </svg>
            }/>
          </div>
        </div>
        <div className="w-full rounded-r-xl dark:bg-black bg-white">

        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
