import React, { useEffect, useState } from "react";
import "dotenv/config";
import { useTranslation } from "react-i18next";
import Popup from "../../../../reusableComponents/Popup";
import { GroupType } from "../../../../../services/types";
import { MyGroupsProps } from "../../../../../services/interfaces";
import { fetchGET } from "../../../../../services/APIconn";
import { List, ListSubheader } from "@mui/material";
import Group from "./Group";

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
      <div className="h-full pl-1 overflow-y-scroll scroll">
        <List
          className="font-mont-md dark:bg-black"
          sx={{ width: "100%" }}
          component="nav"
        >
          {groups.map((group) => (
            <Group
              key={group.restaurantGroupId}
              {...group}
              handleChangeActiveRestaurant={handleChangeActiveRestaurant}
              activeRestaurantId={activeRestaurantId}
            />
          ))}
        </List>
      </div>
  );
};

export default MyGroups;
