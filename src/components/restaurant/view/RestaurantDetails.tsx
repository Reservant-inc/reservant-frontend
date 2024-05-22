import React, { useState } from "react";
import RestaurantMenuView from "./RestaurantMenuView";
import { Box, ImageList, ImageListItem, Rating } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MopedIcon from "@mui/icons-material/Moped";

const RestaurantDetails = () => {
  // Dummy item data do wytestowania galerii, normalnie tu będą pobierane zdjęcia lokalu
  const [itemData, setItemData] = useState([
    {
      img: "https://source.unsplash.com/grilled-fish-cooked-vegetables-and-fork-on-plate-bpPTlXWTOvg",
      title: "dummyData",
    },
    {
      img: "https://source.unsplash.com/grilled-fish-cooked-vegetables-and-fork-on-plate-bpPTlXWTOvg",
      title: "dummyData",
    },
    {
      img: "https://source.unsplash.com/grilled-fish-cooked-vegetables-and-fork-on-plate-bpPTlXWTOvg",
      title: "dummyData",
    },
    {
      img: "https://source.unsplash.com/grilled-fish-cooked-vegetables-and-fork-on-plate-bpPTlXWTOvg",
      title: "dummyData",
    },
    {
      img: "https://source.unsplash.com/grilled-fish-cooked-vegetables-and-fork-on-plate-bpPTlXWTOvg",
      title: "dummyData",
    },
  ]);

  return (
    <div className="mx-60 mt-20 flex flex-col space-y-5 rounded-xl bg-grey-1 p-2">
      <div className="flex items-center space-x-10">
        <div>
          <h2 className="text-3xl font-extrabold">Restaurant name</h2>
          <div>
            <div className="my-3 flex items-center justify-center space-x-2">
              <div>
                <Rating
                  name="read-only"
                  value={4.5}
                  precision={0.5}
                  readOnly
                  emptyIcon={
                    <StarBorderIcon
                      fontSize="inherit"
                      className="text-grey-2 dark:text-grey-1"
                    />
                  }
                />
              </div>
              <div>(200+ opinii)</div>
            </div>
            <div className="my-3">
              <MopedIcon /> Koszt dostawy 5,99 zł
            </div>
            <div className="my-3">Restauracja</div>
            <div className="my-3">Adres</div>
          </div>
        </div>
        <div className="flex grow justify-center">
          <Box
            className="rounded-xl"
            component="img"
            sx={{
              height: 233,
              width: 350,
            }}
            alt="Picture of a dish"
            src="https://source.unsplash.com/grilled-fish-cooked-vegetables-and-fork-on-plate-bpPTlXWTOvg"
          />
        </div>
      </div>
      <div>Map</div>
      <div className="flex w-full justify-center">
        <ImageList sx={{ width: 600, height: 450 }} cols={4} rowHeight={164}>
          {itemData.map((item) => (
            <ImageListItem key={item.img}>
              <img
                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                alt={item.title}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
      <RestaurantMenuView />
    </div>
  );
};

export default RestaurantDetails;
