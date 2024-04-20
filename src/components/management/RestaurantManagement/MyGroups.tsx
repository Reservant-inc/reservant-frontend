import React, { useEffect, useState } from 'react';
import Group from './Group';
import "dotenv/config";
import { useTranslation } from "react-i18next";
import Popup from '../../reusableComponents/Popup';
import Cookies from 'js-cookie';
import { GroupType } from '../../../services/types';
import { MyGroupsProps } from '../../../services/interfaces';
import { fetchGET } from '../../../services/APIconn';

const MyGroups: React.FC<MyGroupsProps> = ({handleChangeActiveRestaurant, activeRestaurantId }) => { 

    const [t] = useTranslation("global");

    const [groups, setGroups] = useState<GroupType[]>([]);
      
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const response = await fetchGET('/my-restaurant-groups')
        setGroups(response);

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
