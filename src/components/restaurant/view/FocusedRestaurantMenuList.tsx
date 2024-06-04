import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetchGET } from "../../../services/APIconn";
import FocusedRestaurantMenuItem from "./FocusedRestaurantMenuItem";
import { MenuItem } from "../../../services/interfaces";

interface FocusedRestaurantMenuListProps {
  restaurantId: number;
}

const FocusedRestaurantMenuList: React.FC<FocusedRestaurantMenuListProps> = ({
  restaurantId,
}) => {
  const [menus, setMenus] = useState<any[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const menusData = await fetchGET(
          `/my-restaurants/${restaurantId}/menus`,
        );
        // console.log(menusData);
        setMenus(menusData || []);
      } catch (error) {
        console.error("Error fetching menus:", error);
        setMenus([]);
      }
    };

    fetchMenus();
  }, [restaurantId]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (activeMenuId !== null) {
        try {
          const menuData = await fetchGET(`/menus/${activeMenuId}`);
          //   console.log(
          //     `Fetched menu items for menuId ${activeMenuId}:`,
          //     menuData,
          //   );
          setMenus((prevMenus) => {
            const updatedMenus = [...prevMenus];
            const menuIndex = updatedMenus.findIndex(
              (menu) => menu.menuId === activeMenuId,
            );
            if (menuIndex !== -1) {
              updatedMenus[menuIndex] = {
                ...updatedMenus[menuIndex],
                menuItems: menuData.menuItems || [],
              };
            }
            return updatedMenus;
          });
        } catch (error) {
          console.error(
            `Error fetching menu items for menuId ${activeMenuId}:`,
            error,
          );
        }
      }
    };

    fetchMenuItems();
  }, [activeMenuId]);

  const handleMenuClick = (id: number) => {
    setActiveMenuId(id === activeMenuId ? null : id);
  };

  const isDarkMode = document.documentElement.classList.contains("dark");

  return (
    <div className="m-2">
      <div className="space-x-2">
        {menus.map((menu) => (
          <Button
            key={menu.menuId}
            variant={activeMenuId === menu.menuId ? "contained" : "outlined"}
            sx={{
              borderColor:
                activeMenuId !== menu.menuId && isDarkMode
                  ? "#64c3a6"
                  : "#a94c79",
              color:
                activeMenuId === menu.menuId
                  ? isDarkMode
                    ? "#fefefe"
                    : "#fefefe"
                  : isDarkMode
                    ? "#64c3a6"
                    : "#a94c79",
              backgroundColor:
                activeMenuId === menu.menuId
                  ? isDarkMode
                    ? "#64c3a6"
                    : "#a94c79"
                  : "transparent",
            }}
            onClick={() => handleMenuClick(menu.menuId)}
          >
            {menu.name}
          </Button>
        ))}
      </div>
      {menus.map((menu) =>
        activeMenuId === menu.menuId ? (
          <div
            key={menu.menuId}
            className="m-4 max-h-[400px] overflow-y-auto rounded-lg bg-grey-1 p-5"
          >
            <h3 className="text-xl font-medium">{menu.name}</h3>
            {menu.menuItems ? (
              menu.menuItems.map((item: MenuItem) => (
                <FocusedRestaurantMenuItem key={item.id} item={item} />
              ))
            ) : (
              <p>Brak dań dla tego menu.</p>
            )}
          </div>
        ) : null,
      )}
    </div>
  );
};

export default FocusedRestaurantMenuList;
