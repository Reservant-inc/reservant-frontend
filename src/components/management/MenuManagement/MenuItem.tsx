import React from "react";
import { Card, CardContent } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DefaultMenuItem from '../../../assets/images/defaultMenuItemImage.png'
import DefaultDrinkItem from '../../../assets/images/defaultDrinkItemImage.png';
import { useTranslation } from "react-i18next";

interface MenuItemProps {
    name: string;
    price: number;
    alcoholPercentage: number;
    menuType: string; 
    onDelete: () => void;
    onEdit: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ name, price, alcoholPercentage, menuType, onDelete, onEdit }) => {
    const { t } = useTranslation("global");
    const imagePath = menuType === 'Alcohol' ? DefaultDrinkItem : DefaultMenuItem;
    const alcoholPercenrageVisable = menuType === 'Alcohol' ? true : false;
    
    return (
        <Card className="w-64 dark:bg-grey-4 dark:text-grey-1 m-1">
            <CardContent className="flex flex-col">
                <img src={imagePath} alt="DefaultMenuItem" className="w-full h-auto mb-2" />
                <div className="flex justify-between items-start">
                    <h2 className="text-lg font-medium flex-grow">{name}</h2>
                    <div className="flex space-x-1">
                        <button
                            className="rounded-lg bg-primary-2 p-1 w-8 h-8 dark:bg-secondary-2 dark:hover:bg-secondary dark:text-black"
                            onClick={onEdit}
                        >
                            <EditIcon />
                        </button>
                        <button
                            className="rounded-lg bg-primary-2 p-1 w-8 h-8 dark:bg-secondary-2 dark:hover:bg-secondary dark:text-black"
                            onClick={onDelete}
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                </div>
                <p className="text-sm">{price} PLN</p>
                {(alcoholPercenrageVisable) && <p className="text-xs">{t("restaurant-management.menu.menuItemAlcoholPercentage")}: {alcoholPercentage}</p>}
            </CardContent>
        </Card>
    );
};

export default MenuItem;
