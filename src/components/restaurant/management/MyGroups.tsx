import React, { useEffect, useState } from 'react';
import Group from './Group';
import "dotenv/config";
import { useTranslation } from "react-i18next";
import Popup from '../../popup/Popup';

interface MyGroupsProps {
  handleChangeActiveRestaurant: (id: number) => void;
  activeRestaurantId: number | null;
}

const MyGroups: React.FC<MyGroupsProps> = ({handleChangeActiveRestaurant, activeRestaurantId }) => {
    const [t] = useTranslation("global");

    //test dummy data - delete later
    const [groups, setGroups] = useState([
        {
          id: 1,
          name: 'Group 1',
          restaurantCount: 3
        },
        {
          id: 2,
          name: 'Group 2',
          restaurantCount: 2
        },
        {
          id: 3,
          name: 'Group 3',
          restaurantCount: 1
        }
        ,
        {
          id: 4,
          name: 'Group 4',
          restaurantCount: 5
        }
      ]);
      


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://172.21.40.127:12038/my-restaurant-groups');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups: ', error);
      };
      // fetchData();
    };

    fetchData();
  }, []);

  // const handleAddGroup = () => {
  //   
  //   console.log('Add a new group');
  // };
  return (
    <div>
        <h1 className='font-bold'>{t("restaurant-management.groups.header")}</h1>
        <div>
            {groups.map((group) => (
                <Group key={group.id} {...group} handleChangeActiveRestaurant={handleChangeActiveRestaurant} activeRestaurantId={activeRestaurantId}/>
            ))}
        </div>
        <Popup buttonText={t("restaurant-management.groups.add-button")} bgColor="white">
          <p>Form to create a group</p>
        </Popup>
    </div>
);
};

export default MyGroups;
