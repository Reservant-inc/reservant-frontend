import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import RestaurantCartView from "./RestaurantCartView";
import { CartItemType } from "../../../../../services/types";

interface RestaurantCartProps {
  cart: CartItemType[];
  incrementQuantity: (itemId: number) => void;
  decrementQuantity: (itemId: number) => void;
}

const RestaurantCart: React.FC<RestaurantCartProps> = ({
  cart,
  incrementQuantity,
  decrementQuantity,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("Dostawa");

  const handleButtonClick = (option: React.SetStateAction<string>) => {
    setSelectedOption(option);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "Na miejscu":
      case "Dostawa":
      case "Odbiór":
        return (
          <RestaurantCartView
            cart={cart}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
          />
        );
      default:
        return <Typography variant="h6">Moja rezerwacja</Typography>;
    }
  };

  const buttonStyle = (option: string) => ({
    borderColor: "#a94c79",
    color: selectedOption === option ? "#fefefe" : "#a94c79",
    backgroundColor: selectedOption === option ? "#a94c79" : "#fefefe",
    "&:hover": {
      backgroundColor: selectedOption === option ? "#a94c79" : "#fefefe",
    },
  });

  return (
    <Box className="mr-20 flex min-h-[500px] w-full flex-col items-center justify-start rounded-xl bg-grey-1 p-6">
      <Box className="mb-4 flex space-x-2">
        <Button
          variant="outlined"
          sx={buttonStyle("Na miejscu")}
          onClick={() => handleButtonClick("Na miejscu")}
        >
          Na miejscu
        </Button>
        <Button
          variant="outlined"
          sx={buttonStyle("Dostawa")}
          onClick={() => handleButtonClick("Dostawa")}
        >
          Dostawa
        </Button>
        <Button
          variant="outlined"
          sx={buttonStyle("Odbiór")}
          onClick={() => handleButtonClick("Odbiór")}
        >
          Odbiór
        </Button>
      </Box>
      {renderContent()}
    </Box>
  );
};

export default RestaurantCart;
