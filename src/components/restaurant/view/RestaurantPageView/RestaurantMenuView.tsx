import { Button, Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import MenuItemComponent from "../MenuItemComponent";
import { MenuItem } from "../../../../services/interfaces";
import { fetchGET, getImage } from "../../../../services/APIconn";

interface RestaurantMenuViewProps {
  addToCart: (item: MenuItem) => void;
}

const RestaurantMenuView: React.FC<RestaurantMenuViewProps> = ({
  addToCart,
}) => {
  const [menus, setMenus] = useState<any[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const restaurantId = 2; // na razie hardcoded, jak bedzie wiadomo co przekierowuje na te strone to sie wezmie z koncowki useParam

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const menusData = await fetchGET(
          `/my-restaurants/${restaurantId}/menus`,
        );
        setMenus(menusData || []);
        if (menusData.length > 0) {
          setActiveMenuId(menusData[0].menuId);
        }
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
    setActiveMenuId(id);
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
            className="m-4 flex flex-col gap-4 bg-grey-1 p-5"
          >
            <div className="flex gap-4">
              <Box
                component="img"
                src={getImage(menu.photo) as string}
                alt={menu.name}
                className="rounded-lg"
                sx={{ height: 300, width: 300 }}
              />
              <div className="flex flex-col">
                <h3 className="text-xl font-medium">{menu.name}</h3>
                <Typography variant="body2" color="textSecondary">
                  {menu.alternateName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {menu.menuType}
                </Typography>
                {menu.dateUntil && (
                  <Typography variant="body2" color="textSecondary">
                    Aktywne do {new Date(menu.dateUntil).toLocaleDateString()}
                  </Typography>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-col items-center">
              {menu.menuItems && menu.menuItems.length > 0 ? (
                menu.menuItems.map((item: MenuItem) => (
                  <div key={item.id} className="my-2 w-4/5">
                    <MenuItemComponent item={item} addToCart={addToCart} />
                  </div>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Brak dań dla tego menu.
                </Typography>
              )}
            </div>
          </div>
        ) : null,
      )}
    </div>
  );
};

export default RestaurantMenuView;
