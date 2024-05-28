import React, { useState } from "react";
import RestaurantMenuView from "./RestaurantMenuView";
import RestaurantReviewsView from "./RestaurantReviewsView";
import RestaurantEventsView from "./RestaurantEventsView";
import {
  Box,
  Chip,
  ImageList,
  ImageListItem,
  Rating,
  Modal,
  Typography,
} from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MopedIcon from "@mui/icons-material/Moped";
import defaultImage from "../../../assets/images/defaulImage.jpeg";
import { MenuItem } from "../../../services/interfaces";

const TABS = {
  MENU: "menu",
  EVENTS: "events",
  REVIEWS: "reviews",
};

interface RestaurantDetailsProps {
  addToCart: (item: MenuItem) => void;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ addToCart }) => {
  const [itemData, setItemData] = useState([
    {
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      title: "dummyData",
    },
    {
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      title: "dummyData",
    },
    {
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      title: "dummyData",
    },
    {
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      title: "dummyData",
    },
    {
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      title: "dummyData",
    },
  ]);

  const [tags, setTags] = useState([
    { name: "Burgery" },
    { name: "Na wynos" },
    { name: "Alkohol" },
  ]);

  const [activeTab, setActiveTab] = useState(TABS.MENU);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const renderActiveTab = () => {
    switch (activeTab) {
      case TABS.MENU:
        return <RestaurantMenuView addToCart={addToCart} />;
      case TABS.EVENTS:
        return <RestaurantEventsView />;
      case TABS.REVIEWS:
        return <RestaurantReviewsView />;
      default:
        return <RestaurantMenuView addToCart={addToCart} />;
    }
  };

  return (
    <div className="mx-60 mt-20 flex flex-col space-y-5 rounded-xl bg-grey-1 p-6">
      <div className="flex items-center space-x-10">
        <div>
          <h2 className="text-3xl font-extrabold text-primary-2">
            Restaurant name
          </h2>
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
            <div className="my-3 space-x-1">
              {tags.map((tag) => (
                <Chip
                  key={tag.name}
                  label={tag.name}
                  sx={{
                    borderColor: "#a94c79",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex grow justify-center">
          <Box
            className="rounded-xl bg-grey-2"
            component="img"
            sx={{
              height: 233,
              width: 350,
            }}
            alt="Picture of a dish"
            src={defaultImage}
          />
        </div>
      </div>
      <div className="relative h-80 overflow-hidden bg-grey-2">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          alt="map example"
          src="https://streetsmn.s3.us-east-2.amazonaws.com/wp-content/uploads/2013/10/Screen-shot-2013-10-27-at-10.51.49-PM.png"
        />
      </div>

      <div className="flex w-full justify-center">
        <ImageList sx={{ width: 750, height: 210 }} cols={4} rowHeight={164}>
          {itemData.slice(0, 3).map((item) => (
            <ImageListItem
              key={item.img}
              sx={{ width: "100%", height: "100%" }}
            >
              <img
                className="bg-grey-2"
                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                alt={item.title}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </ImageListItem>
          ))}
          {itemData.length > 3 && (
            <ImageListItem
              key="show-more"
              onClick={handleOpenModal}
              sx={{
                cursor: "pointer",
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              <img
                className="bg-grey-2"
                srcSet={`${itemData[3].img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                src={`${itemData[3].img}?w=164&h=164&fit=crop&auto=format`}
                alt={itemData[3].title}
                loading="lazy"
                style={{
                  filter: "grayscale(100%)",
                  opacity: 0.8,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <Typography variant="h3">+</Typography>
                <Typography variant="h6">Wyświetl Galerię</Typography>
              </div>
            </ImageListItem>
          )}
        </ImageList>
      </div>
      <div className="flex space-x-10 px-6">
        <h3
          className={`cursor-pointer ${
            activeTab === TABS.MENU
              ? "text-2xl text-primary-2 underline"
              : "text-2xl text-grey-2"
          }`}
          onClick={() => setActiveTab(TABS.MENU)}
        >
          Menu
        </h3>
        <h3
          className={`cursor-pointer ${
            activeTab === TABS.EVENTS
              ? "text-2xl text-primary-2 underline"
              : "text-2xl text-grey-2"
          }`}
          onClick={() => setActiveTab(TABS.EVENTS)}
        >
          Wydarzenia
        </h3>
        <h3
          className={`cursor-pointer ${
            activeTab === TABS.REVIEWS
              ? "text-2xl text-primary-2 underline"
              : "text-2xl text-grey-2"
          }`}
          onClick={() => setActiveTab(TABS.REVIEWS)}
        >
          Oceny
        </h3>
      </div>
      {renderActiveTab()}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
            Galeria
          </Typography>
          <ImageList sx={{ width: "100%", height: "auto" }} cols={1}>
            {itemData.map((item) => (
              <ImageListItem key={item.img}>
                <img
                  srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </Modal>
    </div>
  );
};

export default RestaurantDetails;
