import React from 'react'
import { VisitType } from '../../../../services/types'
import { ReservationListType } from '../../../../services/enums'
import { getImage } from '../../../../services/APIconn'
import DefaultImage from '../../../../assets/images/defaulImage.jpeg'

interface ReservationProps {
  reservation: VisitType
  listType: ReservationListType
  refreshEvents: Function
}

const Reservation: React.FC<ReservationProps> = ({
  reservation,
  listType,
  refreshEvents
}) => {
  return (
    <div className="w-fill h-fit p-2 flex justify-between">
      <div>
        <img
          src={getImage(reservation.restaurant.logo, DefaultImage)}
          alt="restaurant logo"
        />
        <div></div>
      </div>
      <div></div>
    </div>
  )
}

export default Reservation
