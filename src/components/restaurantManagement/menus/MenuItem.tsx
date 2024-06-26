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
    alternateName: string;
    price: number;
    alcoholPercentage: number;
    menuType: string;
    photo?: string; // Optional prop
    onDelete: () => void;
    onEdit: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ name, alternateName, price, alcoholPercentage, menuType, photo, onDelete, onEdit }) => {
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
                <img src={getImage(imagePath)} alt="MenuItemImage" className="w-full h-36 mb-2 rounded-lg" />
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <h2 className="font-bold">{name}</h2>
                        {alternateName !== name && (
                            <h3 className="font-medium">{alternateName}</h3>
                        )}
                    </div>
                    <div className="flex space-x-1">
                        <button
                            className="text-primary"
                            onClick={onEdit}
                        >
                            <EditIcon />
                        </button>
                        <button
                            className="text-primary"
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
