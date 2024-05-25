import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";

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

const MenuPopup: React.FC<MenuPopupProps> = ({
  items,
  mainHeader,
  onClose,
  onSave,
}) => {
  const [inputValues, setInputValues] = useState<{
    [key in MenuItemInterface["header"]]: string;
  }>(
    items.reduce(
      (acc, item) => {
        acc[item.header] = item.initialValue || "";
        return acc;
      },
      {} as { [key in MenuItemInterface["header"]]: string },
    ),
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
    <div className="bg-gray-500 fixed inset-0 flex items-center justify-center bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6">
        {mainHeader && <h1 className="mb-6 text-xl font-bold">{mainHeader}</h1>}
        <div className="flex space-x-2">
          <button onClick={onClose} id="MenuPopupCancelButton">
            <CancelIcon />
          </button>
          <button
            onClick={handleSave}
            disabled={!isModified}
            id="MenuPopupSaveButton"
          >
            <SaveIcon />
          </button>
        </div>
        {items.map((item) => (
          <div key={item.header} className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{item.header}</h2>
            </div>
            <input
              type="text"
              className="border-gray-400 mb-4 w-full rounded-md border p-2"
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
