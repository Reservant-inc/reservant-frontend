import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";

interface GroupProps {
  id: number;
  name: string;
  restaurantCount: number;
  handleChangeActiveRestaurant: (id: number) => void;
  activeRestaurantId: number | null;
}

const Group: React.FC<GroupProps> = ({ id, name, restaurantCount, handleChangeActiveRestaurant, activeRestaurantId  }) => {
    const [t] = useTranslation("global");
    const [isPressed, setIsPressed] = useState<boolean>(false);

    //dummy data
    const [restaurants, setRestaurants] = useState([
        {
            "id": 0,
            "name": "McJohn's",
            "restaurantType": "Restaurant",
            "address": "ul. Koszykowa 86",
            "city": "Warszawa",
            "groupId": 0
          },
          {
            "id": 1,
            "name": "McJohn's 123",
            "restaurantType": "Restaurant",
            "address": "ul. Koszykowa 8612312",
            "city": "Warszawa",
            "groupId": 0
          }
      ]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`http://172.21.40.127:12038/my-restaurant-groups/${id}`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setRestaurants(data.restaurants);
          } catch (error) {
            console.error('Error fetching groups: ', error);
          };
          // fetchData();
        };
    
        fetchData();
      }, [id]);

      const handleIsPressed = (e: React.MouseEvent<HTMLHeadingElement>) => {
        e.preventDefault();
        setIsPressed((isPressed) => !isPressed);
      }


      return (
        <div className="border p-2 rounded m-2 overflow-hidden">
          <h2 className="text-xl font-semibold mb-2 truncate hover:cursor-pointer" onClick={handleIsPressed}>{name}</h2>

          {isPressed && <><p className='text-sm'>{t("restaurant-management.groups.counter")}: {restaurantCount}</p>
          <ul>
            {restaurants.map((restaurant) => (
              <li key={restaurant.id} className="transition duration-300 block border rounded my-1">
                <div 
                  // to={`/restaurants/${restaurant.id}`} 
                  className={`flex justify-between items-center transition duration-300 hover:bg-blue cursor-pointer block p-1 ${activeRestaurantId === restaurant.id ? 'bg-blue' : 'bg-white'}`}
                  onClick={() => handleChangeActiveRestaurant(restaurant.id)}>
                  {restaurant.name}
                </div>
              </li>
            ))}
          </ul></>}
        </div>
    ); 
};

export default Group;
