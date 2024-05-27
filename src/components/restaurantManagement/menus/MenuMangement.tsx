import React, { useEffect, useState, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuPopup, { MenuItemInterface } from "./MenuPopup";
import { useTranslation } from "react-i18next";
import { fetchGET, fetchPOST, fetchPUT } from "../../../services/APIconn";
import MenuItem from "./MenuItem";

interface MenuManagementProps {
  activeRestaurantId: number | null;
}

interface Menu {
  menuId: number;
  menuType: string;
  dateFrom: string;
  dateUntil: string | null;
  menuItems: MenuItemData[];
}

interface MenuItemData {
  menuItemId: number;
  name: string;
  price: number;
  alcoholPercentage: number;
}

const MenuManagement: React.FC<MenuManagementProps> = ({
  activeRestaurantId,
}) => {
  const { t } = useTranslation("global");

  const [categoriesByRestaurant, setCategoriesByRestaurant] = useState<{
    [key: number]: string[];
  }>({});
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<
    number | null
  >(0);
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isMenuItemByCategoryPopupOpen, setIsMenuItemByCategoryPopupOpen] =
    useState(false);
  const [isMenuItemEditPopupOpen, setIsMenuItemEditPopupOpen] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState<string>("");
  const [editedMenuItem, setEditedMenuItem] = useState<MenuItemData | null>(
    null,
  );
  const [menus, setMenus] = useState<any[]>([]);

  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRestaurantId !== null) {
      console.log(activeRestaurantId);
      fetchMenus(activeRestaurantId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRestaurantId]);

  useEffect(() => {
    fetchMenuForSelectedCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuItemEditPopupOpen, isMenuItemByCategoryPopupOpen]);

  useEffect(() => {
    const isMenuFetched =
      selectedCategoryIndex !== null &&
      menus.length > selectedCategoryIndex &&
      menus[selectedCategoryIndex].menuItems.length > 0;

    if (!isMenuFetched) {
      fetchMenuForSelectedCategory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menus, selectedCategoryIndex, setIsMenuItemEditPopupOpen]);

  const fetchMenuForSelectedCategory = async () => {
    if (
      selectedCategoryIndex !== null &&
      menus.length > selectedCategoryIndex
    ) {
      const menuId = menus[selectedCategoryIndex].menuId;
      try {
        const menuData = await fetchGET(`/menus/${menuId}`);

        console.log("Menu for selected category:", menuData);
        if (!menuData.menuItems || menuData.menuItems.length === 0) {
          return;
        }
        setMenus((prevMenus) => {
          const updatedMenus = [...prevMenus];
          updatedMenus[selectedCategoryIndex] = {
            ...updatedMenus[selectedCategoryIndex],
            menuItems: menuData.menuItems || [],
          };
          return updatedMenus;
        });
      } catch (error) {
        console.error("Error fetching menu for selected category:", error);
      }
    }
  };

  const fetchMenus = async (restaurantId: number): Promise<Menu[]> => {
    try {
      const menusData: Menu[] = await fetchGET(
        `/my-restaurants/${restaurantId}/menus`,
      );
      console.log("Menus data:", menusData);
      const validatedMenusData = menusData.map((menu) => ({
        ...menu,
        menuItems: menu.menuItems || [], // Jeśli brakuje menuItems, ustaw na pustą tablicę
      }));

      const allMenuTypes = validatedMenusData.map((menu) => menu.menuType);

      setMenus(validatedMenusData);
      setCategoriesByRestaurant({ [activeRestaurantId || 0]: allMenuTypes });
      return validatedMenusData;
    } catch (error) {
      console.error("Error fetching menus:", error);
      return [];
    }
  };

  const handleEditCategory = () => {
    if (
      selectedCategoryIndex !== null &&
      categoriesByRestaurant[activeRestaurantId || 0]
    ) {
      const selectedCategory =
        categoriesByRestaurant[activeRestaurantId || 0][selectedCategoryIndex];
      setEditCategoryName(selectedCategory);
      setIsEditPopupOpen(true);
    }
  };
  const handleSaveNewCategory = async (values: { [key: string]: string }) => {
    const categoryValue = Object.values(values)[0];
    console.log(categoryValue);

    try {
      const response = await fetchPOST(
        "/menus",
        JSON.stringify({
          restaurantId: activeRestaurantId,
          menuType: categoryValue,
        }),
      );
      console.log("Response:", response);

      setIsCategoryPopupOpen(false);

      if (activeRestaurantId !== null) {
        fetchMenus(activeRestaurantId);
      }
    } catch (error) {
      console.error("Error saving new category:", error);
    }
  };

  const handleSaveEditedCategory = async (values: {
    [key: string]: string;
  }) => {
    if (
      selectedCategoryIndex !== null &&
      categoriesByRestaurant[activeRestaurantId || 0]
    ) {
      const categoryValue = Object.values(values)[0];
      console.log(categoryValue);

      try {
        const menuId = menus[selectedCategoryIndex].id;
        const response = await fetchPUT(
          `/menus/${menuId}`,
          JSON.stringify({ menuType: categoryValue }),
        );
        console.log("Response:", response);

        setIsEditPopupOpen(false);

        if (activeRestaurantId !== null) {
          fetchMenus(activeRestaurantId);
        }
      } catch (error) {
        console.error("Error while editing category:", error);
      }
    }
  };

  const handleSaveNewMenuItem = async (values: { [key: string]: string }) => {
    try {
      const body = JSON.stringify({
        restaurantId: activeRestaurantId,
        name: values.Name,
        price: values.Price,
        alcoholPercentage: values["Alcohol percentage"],
      });
      const response = await fetchPOST("/menu-items", body);
      console.log("Response:", response);
      if (selectedCategoryIndex !== null && menus[selectedCategoryIndex]) {
        // Dodaj warunek sprawdzający, czy selectedCategoryIndex nie jest null
        const menuItemId = response.id;
        const menuId = menus[selectedCategoryIndex].id;
        const response2 = await fetchPOST(
          `/menus/${menuId}/items`,
          JSON.stringify({ itemIds: [menuItemId] }),
        );
        console.log(response2);
        setIsMenuItemByCategoryPopupOpen(false);
      }
    } catch (error) {
      console.error("error while posting ne menu item:", error);
    }
  };

  const handleEditMenuItem = (menuItem: MenuItemData) => {
    setEditedMenuItem(menuItem);
    setIsMenuItemEditPopupOpen(true);
  };

  const handleSaveEditedMenuItem = async (values: {
    [key: string]: string;
  }) => {
    try {
      if (editedMenuItem) {
        const { menuItemId: id } = editedMenuItem;
        console.log(values);
        const body = JSON.stringify({
          name: values.Name,
          price: values.Price,
          alcoholPercentage: values["Alcohol percentage"],
        });
        const response = await fetchPUT(`/menu-items/${id}`, body);
        console.log(response);
        setIsMenuItemEditPopupOpen(false);
      }
    } catch (error) {
      console.error("Error while saving edited menu item:", error);
    }
  };

  const handleDeleteMenuItem = () => {
    //brak końcówki
  };

  const menuCategories: MenuItemInterface[] = [
    {
      header: t("restaurant-management.menu.addNewCategory"),
    },
  ];

  const editMenuCategories: MenuItemInterface[] = [
    {
      header: t("restaurant-management.menu.editCategory"),
      initialValue: editCategoryName,
    },
  ];

  const menuItems: MenuItemInterface[] = [
    {
      header: t("restaurant-management.menu.menuItemName"),
    },
    {
      header: t("restaurant-management.menu.menuItemPrice"),
    },
    {
      header: t("restaurant-management.menu.menuItemAlcoholPercentage"),
    },
  ];
  const editedMenuItems: MenuItemInterface[] = [
    {
      header: t("restaurant-management.menu.menuItemName"),
      initialValue: editedMenuItem?.name || "",
    },
    {
      header: t("restaurant-management.menu.menuItemPrice"),
      initialValue: editedMenuItem?.price.toString() || "",
    },
    {
      header: t("restaurant-management.menu.menuItemAlcoholPercentage"),
      initialValue: editedMenuItem?.alcoholPercentage?.toString() || "",
    },
  ];

  return (
    <div ref={popupRef} className="h-full w-full bg-white rounded-lg shadow-md flex-col  space-y-2 p-2">
      <div className="flex items-center justify-center">
        <button
          id="MenuManagementAddCategoryButton" //do czego to w sumie jest...?
          className="mr-1 h-8 w-8 rounded-lg bg-primary p-1 dark:bg-secondary-2 dark:text-black dark:hover:bg-secondary"
          onClick={() => setIsCategoryPopupOpen(true)}
        >
          <AddIcon />
        </button>
        <button
          id="MenuManagementEditCategoryButton"
          className="mr-1 h-8 w-8 rounded-lg bg-primary p-1 dark:bg-secondary-2 dark:text-black dark:hover:bg-secondary"
          onClick={handleEditCategory}
          disabled={selectedCategoryIndex === null}
        >
          <EditIcon />
        </button>
        {activeRestaurantId !== null &&
        categoriesByRestaurant[activeRestaurantId]
          ? categoriesByRestaurant[activeRestaurantId].map(
              (category: string, index: number) => (
                <button
                  id="MenuManagementCategorySelectButton"
                  key={index}
                  className={`mr-1 rounded-lg p-1 dark:text-black ${index === selectedCategoryIndex ? "dark:bg-secondary" : "dark:bg-secondary-2"}`}
                  onClick={() =>
                    setSelectedCategoryIndex(
                      index === selectedCategoryIndex ? null : index,
                    )
                  }
                >
                  {category}
                </button>
              ),
            )
          : null}
        {isCategoryPopupOpen && (
          <MenuPopup
            items={menuCategories}
            onSave={handleSaveNewCategory}
            onClose={() => setIsCategoryPopupOpen(false)}
          />
        )}
        {isEditPopupOpen && (
          <MenuPopup
            items={editMenuCategories}
            onSave={handleSaveEditedCategory}
            onClose={() => setIsEditPopupOpen(false)}
          />
        )}
        {isMenuItemByCategoryPopupOpen && ( // Nowy popup
          <MenuPopup
            items={menuItems}
            mainHeader={t("restaurant-management.menu.addNewMenuItem")}
            onClose={() => setIsMenuItemByCategoryPopupOpen(false)}
            onSave={handleSaveNewMenuItem}
          />
        )}
        {isMenuItemEditPopupOpen && (
          <MenuPopup
            items={editedMenuItems}
            mainHeader={t("restaurant-management.menu.editMenuItem")}
            onClose={() => {
              setIsMenuItemEditPopupOpen(false);
            }}
            onSave={handleSaveEditedMenuItem}
          />
        )}
      </div>
      <div>
        <button
          id="MenuManagementAddButton" //to też nie wiem do czego w zasadzie
          className="mr-1 h-8 w-8 rounded-lg bg-primary p-1 dark:bg-secondary-2 dark:text-black dark:hover:bg-secondary"
          onClick={() => {
            setIsMenuItemByCategoryPopupOpen(true);
          }}
        >
          <AddIcon />
        </button>
      </div>
      <div className="m-1 flex flex-wrap">
        {selectedCategoryIndex !== null && menus[selectedCategoryIndex] && (
          <>
            {menus[selectedCategoryIndex]?.menuItems.map(
              (menuItem: MenuItemData) => (
                <MenuItem
                  key={menuItem.menuItemId}
                  name={menuItem.name}
                  price={menuItem.price}
                  alcoholPercentage={menuItem.alcoholPercentage}
                  onDelete={handleDeleteMenuItem}
                  onEdit={() => handleEditMenuItem(menuItem)}
                />
              ),
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
