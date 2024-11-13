import React from 'react'
import { getImage } from '../../../services/APIconn'
import { EventDataType } from '../../../services/types'

interface EventProps {
  event: EventDataType
}

const Event: React.FC<EventProps> = ({ event }) => {
  return (
    <div className="flex flex-col gap-2">
      {event.photo && (
        <img
          src={getImage(event.photo, '')}
          alt={`${event.name} event`}
          className="w-full h-auto object-cover"
          style={{ maxHeight: '200px' }}
        />
      )}
      <h2 className="font-bold text-xl">{event.name}</h2>
      <p className="text-sm">{event.description}</p>
      <p className="text-sm">
        <strong>Data wydarzenia:</strong>{' '}
        {new Date(event.time).toLocaleString()}
      </p>
      <p className="text-sm">
        <strong>Restauracja:</strong> {event.restaurant.name},{' '}
        {event.restaurant.city}
      </p>
      <p className="text-sm">
        <strong>Liczba zainteresowanych:</strong> {event.numberInterested}
      </p>
    </div>
  )
}

export default Event
