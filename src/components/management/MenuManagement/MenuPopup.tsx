import React, { useState } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';


export interface MenuItemInterface {
    header: string;
    initialValue?: string; 
}

interface MenuPopupProps {
    items: MenuItemInterface[];
    mainHeader?: string;
    onClose: () => void;
    onSave: (values: { [key: string]: string }) => void; // Dodajemy prop onSave
}

const MenuPopup: React.FC<MenuPopupProps> = ({ items, mainHeader, onClose, onSave }) => {
    const [inputValues, setInputValues] = useState<{ [key in MenuItemInterface['header']]: string }>(
        items.reduce((acc, item) => {
            acc[item.header] = item.initialValue || "";
            return acc;
        }, {} as { [key in MenuItemInterface['header']]: string })
    );

    const [isModified, setIsModified] = useState(false);

    const handleChange = (header: string, value: string) => {
        setInputValues((prevInputValues) => ({
            ...prevInputValues,
            [header]: value,
        }));
        setIsModified(true);
    };

    const handleSave = () => {
        onSave(inputValues); // Wywołujemy funkcję onSave i przekazujemy aktualne wartości inputów
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-96 relative">
            <button 
                className="absolute top-0 right-0 mt-2 mr-2"
                onClick={handleSave}
                disabled={!isModified}
            >
                <SaveIcon />
            </button>
            <button 
                className="absolute top-0 right-8 mt-2 mr-2"
                onClick={onClose}
            >
                <CancelIcon />
            </button>
            
            {mainHeader && <h1 className="text-xl font-bold mb-6">{mainHeader}</h1>}
            {items.map((item) => (
                <div key={item.header} className="mb-6 ">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{item.header}:</label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none dark:focus:border-secondary-2"
                            value={inputValues[item.header]}
                            onChange={(e) => handleChange(item.header, e.target.value)}
                        />
                </div>
            ))}
        </div>
    </div>
    
    );
};

export default MenuPopup;
