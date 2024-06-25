import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import CustomMarker from "./CustomMarker";
import { Button } from "@mui/material";
import { Map as LeafletMap } from "leaflet"; // Import the Map type from Leaflet

interface MapProps {
  activeRestaurant: any;
  restaurants: any[];
  setActiveRestaurant: Function;
  setBounds: Function;
}

const Map: React.FC<MapProps> = ({
  restaurants,
  activeRestaurant,
  setActiveRestaurant,
  setBounds
}) => {
  const mapRef = useRef<LeafletMap | null>(null); // Type the ref

  const MapViewUpdater = () => {
    const map = useMap();
    mapRef.current = map;

    map.zoomControl.setPosition("bottomright");
    map.setMinZoom(10);
    map.setMaxZoom(17);

    useEffect(() => {
      if (activeRestaurant) {
        const { latitude, longitude } = activeRestaurant.location;
        map.flyTo([latitude, longitude - 0.02], 14);
      }
    }, [activeRestaurant, map]);

    return null;
  };

  const sendBounds = () => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      const southWest = bounds.getSouthWest();
      const northEast = bounds.getNorthEast();
  
      setBounds({
        lat1: southWest.lat+1,
        lat2: northEast.lat-1,
        lon1: southWest.lng+1,
        lon2: northEast.lng-1,
      });
    }
  };

  return (
    <div className="relative h-full w-full">
      <div className="z-[1] absolute w-60 h-10 top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Button
          className="h-full w-full rounded-full bg-white font-mont-md p-2 text-black text-[12px] shadow-md"
          onClick={sendBounds}
        >
          Wyszukaj w tym obszarze
        </Button>
      </div>
      <MapContainer
        center={
          activeRestaurant != null
            ? [
                activeRestaurant.location.latitude,
                activeRestaurant.location.longitude,
              ]
            : [52.229895, 21.011736]
        }
        zoom={14}
        scrollWheelZoom={true}
        className="z-0"
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
    </div>
  );
};

export default Map;
