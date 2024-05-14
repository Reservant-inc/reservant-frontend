import React, { useEffect, useState } from "react";
import Group from "./Group";
import "dotenv/config";
import { useTranslation } from "react-i18next";
import Popup from "../../reusableComponents/Popup";
import { GroupType } from "../../../services/types";
import { MyGroupsProps } from "../../../services/interfaces";
import { fetchGET } from "../../../services/APIconn";
import { List, ListSubheader } from "@mui/material";

const MyGroups: React.FC<MyGroupsProps> = ({
  handleChangeActiveRestaurant,
  activeRestaurantId,
}) => {
  const [t] = useTranslation("global");

  const [groups, setGroups] = useState<GroupType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchGET("/my-restaurant-groups");
        setGroups(response);
      } catch (error) {
        console.error("Error fetching groups: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-full w-full flex flex-col justify-between items-between">
      <div className="overflow-y-scroll scroll">
      <List
        className="dark:bg-black font-mont-md"
        sx={{ width: "100%", maxWidth: 360 }}
        component="nav"
        subheader={
          <div className="flex flex-col font-thin text-md h-14 justify-center items-center">
            <h1 className="text-primary-2 font-mont-md dark:text-secondary">MY GROUPS</h1>
          </div>
        }
      >
        {groups.map((group) => (
          <Group
            key={group.id}
            {...group}
            handleChangeActiveRestaurant={handleChangeActiveRestaurant}
            activeRestaurantId={activeRestaurantId}
          />
        ))}
       </List> 
      </div>
      {/* <Popup
        buttonText={t("restaurant-management.groups.add-button")}
        bgColor="white"
        >
        <p>Form to create a group</p>
      </Popup> */}
    </div>
  );
};

export default MyGroups;
