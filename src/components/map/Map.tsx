import React, { useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import CustomMarker from "./CustomMarker";
import L from "leaflet";

interface MapProps {
  activeRestaurant: any;
  restaurants: any[];
  setActiveRestaurant: Function;
}

const Map: React.FC<MapProps> = ({
  restaurants,
  activeRestaurant,
  setActiveRestaurant,
}) => {
  const MapViewUpdater = () => {
    const map = useMap();

    map.zoomControl.setPosition("bottomright");
    map.setMinZoom(13);
    map.setMaxZoom(17);

    useEffect(() => {
      if (activeRestaurant) {
        const { latitude, longitude } = activeRestaurant.location;
        map.setView([latitude, longitude], 13);
      }
    }, [activeRestaurant, map]);

    return null;
  };

  return (
    <MapContainer
      center={
        activeRestaurant != null
          ? [
              activeRestaurant.location.latitude,
              activeRestaurant.location.longitude,
            ]
          : [52.229895, 21.011736]
      }
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      {restaurants.map((restaurant, index) => (
        <CustomMarker
          position={[
            restaurant.location.latitude,
            restaurant.location.longitude,
          ]}
          key={index}
          restaurant={restaurant}
          activeRestaurant={activeRestaurant}
          setActiveRestaurant={setActiveRestaurant}
        />
      ))}
      <MapViewUpdater />
    </MapContainer>
  );
};

export default Map;
