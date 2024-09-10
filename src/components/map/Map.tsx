import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import CustomMarker from "./CustomMarker";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Map as LeafletMap, LatLngBounds } from "leaflet";
import { ActiveRestaurantType } from "../../services/types";

interface MapProps {
  activeRestaurant: ActiveRestaurantType; 
  restaurants: ActiveRestaurantType[];
  setActiveRestaurant: Function;
  setBounds: Function;
  setUserMovedMap: Function;
  userMovedMap: Boolean;
}

const Map: React.FC<MapProps> = ({
  restaurants,
  activeRestaurant,
  setActiveRestaurant,
  setBounds,
  setUserMovedMap,
  userMovedMap,
}) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const previousBoundsRef = useRef<LatLngBounds | null>(null);

  const MapViewUpdater = () => {
    const map = useMap();
    mapRef.current = map;

    map.zoomControl.remove();
    map.setMinZoom(10);
    map.setMaxZoom(18);

    useEffect(() => {
      if (activeRestaurant && !userMovedMap) {
        const { latitude, longitude } = activeRestaurant.location;
        map.flyTo([latitude, longitude - 0.0015], 18);
      }
    }, [activeRestaurant, map, userMovedMap]);

    useEffect(() => {
      const onMoveEnd = () => {
        if (mapRef.current) {
          const bounds = mapRef.current.getBounds();
          if (
            !previousBoundsRef.current ||
            !previousBoundsRef.current.equals(bounds)
          ) {
            sendBounds();
            setUserMovedMap(true);
            previousBoundsRef.current = bounds;
          }
        }
      };

      map.on("moveend", onMoveEnd);

      return () => {
        map.off("moveend", onMoveEnd);
      };
    }, [map]);

    return null;
  };

  const sendBounds = () => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      const southWest = bounds.getSouthWest();
      const northEast = bounds.getNorthEast();

      setBounds({
        lat1: southWest.lat - 0.05,
        lat2: northEast.lat + 0.05,
        lon1: southWest.lng - 0.05,
        lon2: northEast.lng + 0.05,
      });
    }
  };

  return (
    <div className="relative h-full w-full">
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
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          showCoverageOnHover={false}
          spiderfyDistanceMultiplier={4}
        >
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
              setUserMovedMap={setUserMovedMap}
            />
          ))}
        </MarkerClusterGroup>
        <MapViewUpdater />
      </MapContainer>
    </div>
  );
};

export default Map;
