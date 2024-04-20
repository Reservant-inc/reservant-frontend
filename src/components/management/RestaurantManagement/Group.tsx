import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { GroupProps } from '../../../services/interfaces';
import { RestaurantType } from '../../../services/types';
import { fetchGET } from '../../../services/APIconn';

const Group: React.FC<GroupProps> = ({ id, name, restaurantCount, handleChangeActiveRestaurant, activeRestaurantId  }) => {
    const [t] = useTranslation("global");
    const [isPressed, setIsPressed] = useState<boolean>(false);

    const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          try {

            const response = await fetchGET(`/my-restaurant-groups/${id}`)
            setRestaurants(response.restaurants);

          } catch (error) {
            console.error('Error fetching groups: ', error);
          };
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
