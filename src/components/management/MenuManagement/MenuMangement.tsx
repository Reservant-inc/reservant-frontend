import React, { useEffect, useState, useRef } from "react";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuPopup, { MenuItem } from "./MenuPopup";
import { useTranslation } from "react-i18next";
import { fetchGET } from "../../../services/APIconn";
import defaultImage from "../../../assets/images/defaulImage.jpeg"

import { Card, CardContent } from "@mui/material";

interface MenuManagementProps {
    activeRestaurantId: number | null;
}

interface Menu {
    id: number;
    menuType: string;
    dateFrom: string;
    dateUntil: string | null;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ activeRestaurantId }) => {
    const { t } = useTranslation("global");

    const [categoriesByRestaurant, setCategoriesByRestaurant] = useState<{ [key: number]: string[] }>({});
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(0);
    const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isMenuItemByCategoryPopupOpen, setIsMenuItemByCategoryPopupOpen] = useState(false);
    const [editCategoryName, setEditCategoryName] = useState<string>("");
    const [menus, setMenus] = useState<any[]>([]);

    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeRestaurantId !== null) {
            fetchMenus(activeRestaurantId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeRestaurantId]);

    const fetchMenus = async (restaurantId: number): Promise<Menu[]> => {
        try {
            const menusData: Menu[] = await fetchGET(`/my-restaurants/${restaurantId}/menus`);
            console.log("Menus data:", menusData);
            setMenus(menusData);
            const uniqueMenuTypes = menusData.filter((menu, index, self) => self.findIndex(m => m.menuType === menu.menuType) === index).map(menu => menu.menuType);
            setCategoriesByRestaurant({ [activeRestaurantId || 0]: uniqueMenuTypes });
            return menusData;
        } catch (error) {
            console.error("Error fetching menus:", error);
            return [];
        }
    };

   

    const handleEditCategory = () => {
        if (selectedCategoryIndex !== null && categoriesByRestaurant[activeRestaurantId || 0]) {
            const selectedCategory = categoriesByRestaurant[activeRestaurantId || 0][selectedCategoryIndex];
            setEditCategoryName(selectedCategory);
            setIsEditPopupOpen(true);
        }
    };
    const handleSaveNewCategory = (values: { [key: string]: string }) => {
        const categoryValue = Object.values(values)[0];
        console.log(categoryValue);

        const updatedCategoriesByRestaurant = {
            ...categoriesByRestaurant,
            [activeRestaurantId || 0]: [
                ...(categoriesByRestaurant[activeRestaurantId || 0] || []), // Aktualne kategorie + nowa kategoria
                categoryValue
            ]
        };
    
        setCategoriesByRestaurant(updatedCategoriesByRestaurant);
        setIsCategoryPopupOpen(false);
    };
    

    const handleSaveEditedCategory = (values: { [key: string]: string }) => {
        if (selectedCategoryIndex !== null && categoriesByRestaurant[activeRestaurantId || 0]) {
            const categoryValue = Object.values(values)[0];
            const updatedCategories = [...categoriesByRestaurant[activeRestaurantId || 0]];
            updatedCategories[selectedCategoryIndex] = categoryValue;
            const updatedCategoriesByRestaurant = {
                ...categoriesByRestaurant,
                [activeRestaurantId || 0]: updatedCategories
            };

            setCategoriesByRestaurant(updatedCategoriesByRestaurant);
            setIsEditPopupOpen(false);
        }
    };

    const handleSaveNewMenuItem = (values: { [key: string]: string }) => {

    };

    const menuCategories: MenuItem[] = [
        {
            header: t("restaurant-management.menu.addNewCategory"),
        }
    ];

    const editMenuCategories: MenuItem[] = [
        {
            header: t("restaurant-management.menu.editCategory"),
            initialValue: editCategoryName
        }
    ];

    const menuItems: MenuItem[] = [
    {
        header: t("restaurant-management.menu.menuItemName")
    },
    {
        header: t("restaurant-management.menu.menuItemPrice")
    },
    {
        header: t("restaurant-management.menu.menuItemAlcoholPercentage")
    }
];


    return (
        <div ref={popupRef}className="w-full h-full p-2  flex-col space-y-2">
            <div className="flex items-center justify-center">
                <button
                    className="mr-1 rounded-lg bg-primary-2 p-1 w-8 h-8 dark:bg-secondary-2 dark:hover:bg-secondary dark:text-black"
                    onClick={() => setIsCategoryPopupOpen(true)}
                >
                    <AddIcon />
                </button>
                <button
                    className="mr-1 rounded-lg bg-primary-2 p-1 w-8 h-8 dark:bg-secondary-2 dark:hover:bg-secondary dark:text-black"
                    onClick={handleEditCategory}
                    disabled={selectedCategoryIndex === null}
                >
                    <EditIcon />
                </button>
                {(activeRestaurantId !== null && categoriesByRestaurant[activeRestaurantId]) ? (
                    categoriesByRestaurant[activeRestaurantId].map((category: string, index: number) => (
                        <button
                            key={index}
                            className={`mr-1 rounded-lg p-1 dark:text-black ${index === selectedCategoryIndex ? 'dark:bg-secondary' : 'dark:bg-secondary-2'}`}
                            onClick={() => setSelectedCategoryIndex(index === selectedCategoryIndex ? null : index)}
                        >
                            {category}
                        </button>
                    ))
                ) : null}
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
                        onSave= {() => setIsMenuItemByCategoryPopupOpen(false)}
                    />
                )}
            </div>
            <div>
                <button
                    className="mr-1 rounded-lg bg-primary-2 p-1 w-8 h-8 dark:bg-secondary-2 dark:hover:bg-secondary dark:text-black"
                    onClick={() => {setIsMenuItemByCategoryPopupOpen(true)}}
                >
                    <AddIcon />
                </button>
            </div>
            <div>
            <Card className="w-64 dark:bg-grey-4 dark:text-grey-1">
                    <img src={defaultImage} alt="default" className="w-full h-48 object-cover" />
                    <CardContent>
                        <div className="flex justify-between">
                            <h2 className="text-lg font-medium">Nazwa</h2>
                            <div>
                               <button
                                    className="mr-1 rounded-lg bg-primary-2 p-1 w-8 h-8 dark:bg-secondary-2 dark:hover:bg-secondary dark:text-black"
                                    >
                                    <EditIcon />
                                </button>
                                <button
                                    className="mr-1 rounded-lg bg-primary-2 p-1 w-8 h-8 dark:bg-secondary-2 dark:hover:bg-secondary dark:text-black"
                                    >
                                    <DeleteIcon />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm">Cena</p>
                        <p className="text-xs">Zawartość alkoholu: 0.5%</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MenuManagement;
