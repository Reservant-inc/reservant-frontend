import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

interface GroupProps {
  id: number;
  name: string;
  restaurantCount: number;}

const Group: React.FC<GroupProps> = ({ id, name, restaurantCount }) => {
    const [t, i18n] = useTranslation("global");

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
            "name": "McJohn's12312321",
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
          }
        };
    
        fetchData();
      }, [id]);


  return (
    <div className="border p-4 rounded">
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <p className='text-sm'>{t("my-groups.restaurants-count")}: {restaurantCount}</p>
      <ul>
        {restaurants.map((restaurant) => (
            <Link
            to={`/my-restaurants/${restaurant.id}`}
          >
            <li key={restaurant.id} className="border m-2 p-1 rounded">
            
                {restaurant.name}
              
          </li>
          </Link>
        ))}
        
      </ul>
    </div>
  );
};

export default Group;
