import React, { useEffect, useState } from "react";
import RestaurantData from "./RestaurantData";
import EmployeeManagement from "../../employees/EmployeeManagement";
import Cookies from "js-cookie";

interface RestaurantDetailsProps {
    activeRestaurantId: number | null;
}

type Restaurant = {
  id: ,
  name : string,
  restaurantType : string,
  address : string,
  city : string,
  groupId: number,
  logo: string,
  description: string,
  provideDelivery: boolean,
  tags: string[]
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({activeRestaurantId}) => {
    //dummy data
    const [restaurant, setRestaurant] = useState<Restaurant>({
      "id": 0,
      "name": "McJohn's",
      "restaurantType": "Restaurant",
      "nip": "1231264550",
      "address": "ul. Koszykowa 86",
      "postalIndex": "00-000",
      "city": "Warszawa",
      "groupId": 0,
      "groupName": "McJohn's Restaurant Group",
      "rentalContract": "string",
      "alcoholLicense": "string",
      "businessPermission": "string",
      "idCard": "string",
      "tables": [
        {
          "id": 0,
          "capacity": 10
        }
      ],
      "provideDelivery": true,
      "logo": "string",
      "photos": [
        "string"
      ],
      "description": "Restaurant description",
      "tags": [
        "string"
      ]
    });

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
          fetchData();
        };
        
        fetchData();
      }
      }, [activeRestaurantId]);

    

      return ( 
        <div className="flex flex-col h-full">
            {activeRestaurantId != null ? (
              <div className="flex-grow grid grid-cols-3 grid-rows-4 gap-4">
                  <div className="col-span-2 row-span-2 border w-full h-full"><RestaurantData restaurant={restaurant}/></div>
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