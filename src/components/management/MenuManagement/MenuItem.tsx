import React from "react";
import { Card, CardContent } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface MenuItemProps {
    name: string;
    price: number;
    alcoholPercentage: number;
    onDelete: () => void;
    onEdit: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ name, price, alcoholPercentage, onDelete, onEdit }) => {
    return (
        <Card className="w-64 dark:bg-grey-4 dark:text-grey-1 m-1">
            <CardContent>
                <div className="flex justify-between">
                    <h2 className="text-lg font-medium">{name}</h2>
                    <div>
                        <button
                            id="MenuItemEditButton"
                            className="mr-1 rounded-lg bg-primary-2 p-1 w-8 h-8 dark:bg-secondary-2 dark:hover:bg-secondary dark:text-black"
                            onClick={onEdit}
                        >
                            <EditIcon />
                        </button>
                        <button
                            id="MenuItemDeleteButton"
                            className="mr-1 rounded-lg bg-primary-2 p-1 w-8 h-8 dark:bg-secondary-2 dark:hover:bg-secondary dark:text-black"
                            onClick={onDelete}
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                </div>
                <p className="text-sm">{price} PLN</p>
                <p className="text-xs">Alcohol Percentage: {alcoholPercentage}</p>
            </CardContent>
        </Card>
    );
};

export default MenuItem;
