import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetchGET } from "../../../../services/APIconn";
import FocusedRestaurantMenuItem from "./FocusedRestaurantMenuItem";
import { MenuItemWithDescriptionType, MenuWithDescriptionType } from "../../../../services/types";
import { useTranslation } from "react-i18next";

interface FocusedRestaurantMenuListProps {
  restaurantId: number;
}

const FocusedRestaurantMenuList: React.FC<FocusedRestaurantMenuListProps> = ({
  restaurantId,
}) => {
  const [menus, setMenus] = useState<MenuWithDescriptionType[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation("global");

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const menusData = await fetchGET(`/restaurants/${restaurantId}/menus`);
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
        setIsLoading(true);
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
        } finally {
          setIsLoading(false);
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
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
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
              whiteSpace: "nowrap",
              margin: "4px 0",
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
            className="mb-4 mr-4 mt-4 h-full w-full overflow-y-auto rounded-lg bg-grey-1 p-5"
          >
            <h3 className="text-xl font-medium">{menu.name}</h3>
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <CircularProgress />
              </div>
            ) : menu.menuItems && menu.menuItems.length > 0 ? (
              menu.menuItems.map((item: MenuItemWithDescriptionType) => (
                <FocusedRestaurantMenuItem key={item.id} item={item} />
              ))
            ) : (
              <p>{t('home-page.no-menu')}</p>
            )}
          </div>
        ) : null,
      )}
    </div>
  );
};

export default FocusedRestaurantMenuList;
