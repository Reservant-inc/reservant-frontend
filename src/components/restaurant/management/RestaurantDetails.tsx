import React, { useEffect, useState } from "react";
import RestaurantData from "./RestaurantData";

interface RestaurantDetailsProps {
    activeRestaurantId: number | null;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({activeRestaurantId}) => {
    //dummy data
    const [restaurant, setRestaurant] = useState({
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
        const fetchData = async () => {
          try {
            const response = await fetch(`http://172.21.40.127:12038/my-restaurants/${activeRestaurantId}`, );
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setRestaurant(data);
          } catch (error) {
            console.error('Error fetching groups: ', error);
          };
          // fetchData();
        };
    
        fetchData();
      }, [activeRestaurantId]);

    

      return ( 
        <div className="flex flex-col h-full">
            <div className="flex-grow grid grid-cols-3 grid-rows-4 gap-4">
                <div className="col-span-2 row-span-2 border w-full h-full"><RestaurantData restaurant={restaurant}/></div>
                <div className="row-span-2 col-start-3 border w-full h-full">Oceny</div>
                <div className="col-span-2 row-span-2 row-start-3 border w-full h-full">Zarzadzanie pracownikami</div>
            </div>
        </div>
    );
    
}
 
export default RestaurantDetails;