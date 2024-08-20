export interface CustomMarkerProps {
    position: L.LatLngExpression;
    restaurant: { name: string };
    activeRestaurant: any;
    setActiveRestaurant: Function;
    setUserMovedMap?: Function;
  }

  export interface MapProps {
    activeRestaurant: any;
    restaurants: any[];
    setActiveRestaurant: Function;
    setBounds: Function;
    setUserMovedMap: Function;
    userMovedMap: Boolean;
  }