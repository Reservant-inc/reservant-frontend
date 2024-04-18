import React, { useEffect, useState } from 'react';
import Group from './Group';
import "dotenv/config";
import { useTranslation } from "react-i18next";
import Popup from '../../reusableComponents/Popup';
import Cookies from 'js-cookie';

interface MyGroupsProps {
  handleChangeActiveRestaurant: (id: number) => void;
  activeRestaurantId: number | null;
}

type Group = {
  id: number,
  name: string,
  restaurantCount: number
}

const MyGroups: React.FC<MyGroupsProps> = ({handleChangeActiveRestaurant, activeRestaurantId }) => {
    const [t] = useTranslation("global");

    //test dummy data - delete later
    const [groups, setGroups] = useState<Group[]>([]);
      


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/my-restaurant-groups`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}` as string,
          },   
        });

        if (!response.ok) {
          const error = await response.json()
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data)

        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups: ', error);
      };
    };

    fetchData();
  }, []);

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
