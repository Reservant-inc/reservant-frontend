import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerBlack from "../../assets/images/location-black.svg";
import MarkerPrimary from "../../assets/images/location-primary.svg";
import { Marker, useMap } from "react-leaflet";

interface CustomMarkerProps {
  position: L.LatLngExpression;
  restaurant: {name: string}
  activeRestaurant: any
  setActiveRestaurant: Function
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ position, restaurant, activeRestaurant, setActiveRestaurant }) => {

  let marker: any = MarkerBlack;
  if(activeRestaurant != null)  
    marker = restaurant.name === activeRestaurant.name ? MarkerPrimary : MarkerBlack

  const customIcon = L.icon({
    iconUrl: marker,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
  });

  return (
    <Marker position={position} icon={customIcon}
    eventHandlers={{
        click: (e) => {
          setActiveRestaurant(restaurant)
        },
      }}
    />
  );
};

export default CustomMarker;