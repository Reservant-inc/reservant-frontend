import React, { useEffect, useState } from "react";
import RestaurantData from "./RestaurantData";
import EmployeeManagement from "../../employees/EmployeeManagement";
import Cookies from "js-cookie";

interface RestaurantDetailsProps {
    activeRestaurantId: number | null;
}

type Restaurant = {
  id: number,
  name: string,
  restaurantType: string,
  nip: string,
  address: string,
  postalIndex: string,
  city: string,
  groupId: 0,
  groupName: string,
  rentalContract: string,
  alcoholLicense: string,
  businessPermission: string,
  idCard: string,
  tables: [{}],
  provideDelivery: boolean,
  logo: string,
  photos: string[],
  description: string,
  tags: string[]
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({activeRestaurantId}) => {
    //dummy data
    const [restaurant, setRestaurant] = useState<Restaurant>()

    useEffect(() => {
      if(activeRestaurantId != null){
        const fetchData = async () => {
          try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/my-restaurants/${activeRestaurantId}`, {
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
              },   
            });

            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setRestaurant(data);
          } catch (error) {
            console.error('Error fetching groups: ', error);
          };
        };

        fetchData();
      }
      }, [activeRestaurantId]);

      return ( 
        <div className="flex flex-col h-full">
            {activeRestaurantId != null ? (
              <div className="flex-grow grid grid-cols-3 grid-rows-4 gap-4">
                  <div className="col-span-2 row-span-2 border w-full h-full"> {(restaurant != undefined) && <RestaurantData restaurant={restaurant}/>}</div>
                  <div className="row-span-2 col-start-3 border w-full h-full">Oceny</div>
                  <div className="col-span-2 row-span-2 row-start-3 border w-full h-full"><EmployeeManagement activeRestaurantId={activeRestaurantId} /></div>
              </div>
            ) : (
              <h1>Select a restaurant</h1>
            )}
        </div>
    );
    
}
 
export default RestaurantDetails;