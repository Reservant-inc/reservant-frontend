import React from "react";
import { Box } from "@mui/material";
import { MenuItem } from "../../../../services/interfaces";
import { getImage } from "../../../../services/APIconn";
import DefaultPic from "../../../../assets/images/no-image.png"


interface FocusedRestaurantMenuItemProps {
  item: MenuItem;
}

const dummyImage = "https://images.unsplash.com/photo-1551782450-a2132b4ba21d";

const FocusedRestaurantMenuItem: React.FC<FocusedRestaurantMenuItemProps> = ({
  item,
}) => {
  return (
    <div className="mx-auto my-4 flex max-w-3xl justify-between rounded bg-white px-6 py-4">
      <div>
        <p className="flex items-center font-bold">{item.name}</p>
        <p>{item.price} zł</p>
        {item.description?.replace(/\s/g, "").length > 0 ? (
          <p>{item.description}</p>
        ) : (
          <p className="italic">Brak opisu.</p>
        )}
      </div>
      <div className="flex items-center">
        <Box
          className="mr-4 rounded"
          component="img"
          sx={{
            height: 90,
            width: 100,
          }}
          src={getImage(item.photo as string, DefaultPic)}
          alt="default image"
        />
      </div>
    </div>
  );
};

export default FocusedRestaurantMenuItem;
