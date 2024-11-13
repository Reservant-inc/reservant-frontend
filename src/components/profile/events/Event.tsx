import React from 'react'
import { getImage } from '../../../services/APIconn'
import { EventDataType } from '../../../services/types'
import { EventListType } from '../../../services/enums'

interface EventProps {
  event: EventDataType
  listType: EventListType
}

const Event: React.FC<EventProps> = ({ listType, event }) => {
  return (
    <>
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

      <div className="flex gap-2">
        {listType === EventListType.History && (
          <button
            className="bg-primary hover:bg-primary-2 text-white py-1 px-3 rounded transition hover:scale-105"
            onClick={() => console.log('details')}
          >
            Szczegóły
          </button>
        )}
        {listType === EventListType.Interested && (
          <button
            className="bg-primary hover:bg-primary-2 text-white py-1 px-3 rounded transition hover:scale-105 mt-4"
            onClick={() => console.log('uninterested')}
          >
            Usuń zainteresowanie
          </button>
        )}
        {listType === EventListType.Participates && (
          <button
            className="bg-primary hover:bg-primary-2 text-white py-1 px-3 rounded transition hover:scale-105 mt-4"
            onClick={() => console.log('leave')}
          >
            Opuść
          </button>
        )}
        {listType === EventListType.Created && (
          <>
            <button
              className="bg-primary hover:bg-primary-2 text-white py-1 px-3 rounded transition hover:scale-105"
              onClick={() => console.log('edit')}
            >
              Edytuj
            </button>
            <button
              className="bg-primary hover:bg-primary-2 text-white py-1 px-3 rounded transition hover:scale-105"
              onClick={() => console.log('manage participants')}
            >
              Zarządzaj uczestnikami
            </button>
            <button
              className="bg-primary hover:bg-primary-2 text-white py-1 px-3 rounded transition hover:scale-105"
              onClick={() => console.log('delete')}
            >
              Usuń
            </button>
          </>
        )}
      </div>
    </>
  )
}

export default Event
