import React, { useState } from "react";
import { Card, CardContent } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DefaultMenuItem from '../../../assets/images/defaultMenuItemImage.png';
import DefaultDrinkItem from '../../../assets/images/defaultDrinkItemImage.png';
import { useTranslation } from "react-i18next";
import ConfirmationDialog from "../../reusableComponents/ConfirmationDialog";
import { getImage } from "../../../services/APIconn";

interface MenuItemProps {
    name: string;
    price: number;
    alcoholPercentage: number;
    menuType: string;
    photo?: string; // Optional prop
    onDelete: () => void;
    onEdit: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ name, price, alcoholPercentage, menuType, photo, onDelete, onEdit }) => {
    const { t } = useTranslation("global");
    const defaultImage = menuType === 'Alcohol' ? DefaultDrinkItem : DefaultMenuItem;
    const imagePath = photo || defaultImage;
    const alcoholPercentageVisible = menuType === 'Alcohol';
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const handleDeleteConfirmation = () => {
        setConfirmationOpen(true);
    };

    const handleDeleteConfirmed = () => {
        onDelete();
        setConfirmationOpen(false);
    };

    const handleDeleteCancelled = () => {
        setConfirmationOpen(false);
    };
    
    return (
        <Card className="w-64 dark:bg-grey-4 dark:text-grey-1 m-1 rounded-lg">
            <CardContent className="flex flex-col">
                <img src={getImage("/uploads/660d8373-056e-4206-945b-ac82a170403b.jpg")} alt="MenuItemImage" className="w-full h-auto mb-2 rounded-lg" />
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
                            onClick={handleDeleteConfirmation}
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                </div>
                <p className="text-sm">{price} PLN</p>
                {alcoholPercentageVisible && <p className="text-xs">{t("restaurant-management.menu.menuItemAlcoholPercentage")}: {alcoholPercentage}%</p>}
                <ConfirmationDialog
                    open={confirmationOpen}
                    onClose={handleDeleteCancelled}
                    onConfirm={handleDeleteConfirmed}
                    confirmationText={`Are you sure you want to delete ${name}?`}
                />
            </CardContent>
        </Card>
    );
};

export default MenuItem;
