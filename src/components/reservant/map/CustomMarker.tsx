import React from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MarkerBlack from '../../../assets/images/location-black.svg'
import MarkerPrimary from '../../../assets/images/location-primary.svg'
import { Marker, Tooltip, useMap } from 'react-leaflet'
import { RestaurantDetailsType } from '../../../services/types'

interface CustomMarkerProps {
  position: L.LatLngExpression
  restaurant: RestaurantDetailsType
  setUserMovedMap?: Function
  isActive: boolean
  selectRestaurant: Function
}

const CustomMarker: React.FC<CustomMarkerProps> = ({
  position,
  restaurant,
  setUserMovedMap,
  isActive,
  selectRestaurant
}) => {
  let isCurrentRestaurant
  if (isActive) isCurrentRestaurant = restaurant.name

  let marker = isCurrentRestaurant ? MarkerPrimary : MarkerBlack

  const customIcon = L.icon({
    iconUrl: marker,
    iconSize: [40, 40],
    iconAnchor: [25, 50]
  })

  return (
    <Marker
      position={position}
      icon={customIcon}
      eventHandlers={{
        click: e => {
          selectRestaurant(restaurant)
          if (setUserMovedMap != undefined) {
            setUserMovedMap(false)
          }
        }
      }}
    >
      <Tooltip
        direction="bottom"
        offset={[-5, -10]}
        opacity={1}
        permanent
        className={
          'flex h-[26px] items-center justify-center border-none bg-trans font-mont-bd text-[15px] shadow-sm'
        }
      >
        {restaurant.name}
      </Tooltip>
    </Marker>
  )
}

export default CustomMarker
