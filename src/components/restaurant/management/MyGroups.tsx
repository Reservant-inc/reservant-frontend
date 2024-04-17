import React, { useEffect, useState } from 'react';
import Group from './Group';
import "dotenv/config";
import { useTranslation } from "react-i18next";

const MyGroups = () => {
    const [t, i18n] = useTranslation("global");

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
      }
    };

    fetchData();
  }, []);

  const handleAddGroup = () => {
    // 
    console.log('Add a new group');
  };
  return (
    <div>
        <h1>{t("my-groups.groups-header")}</h1>
        <div>
            {groups.map((group) => (
                <Group key={group.id} {...group} />
            ))}
        </div>
        <button onClick={handleAddGroup}>
            <span>+</span>
            <span>{t("my-groups.add-group")}</span>
        </button>
    </div>
);
};

export default MyGroups;
