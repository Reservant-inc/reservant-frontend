import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { fetchGET } from '../../../../services/APIconn';
import Event from './Event';
import { EventDataType, PaginationType } from '../../../../services/types';
import { EventListType } from '../../../../services/enums';
import { Field, Formik } from 'formik';
import { TextField } from '@mui/material';

interface EventListProps {
  listType: EventListType;
}

const EventList: React.FC<EventListProps> = ({ listType }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<EventDataType[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventDataType[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('newest');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const location = useLocation();

  const apiRoutes: Record<EventListType, string> = {
    [EventListType.Created]: '/user/events?category=CreatedBy',
    [EventListType.Interested]: '/user/events?category=InterestedIn',
    [EventListType.Participates]: '/user/events?category=ParticipateIn',
    [EventListType.History]: '/events?friendsOnly=false',
  };

  const noEventsMessage: Record<EventListType, string> = {
    [EventListType.Created]: 'Brak utworzonych wydarzeń.',
    [EventListType.Interested]: 'Nie jesteś zainteresowany żadnym wydarzeniem.',
    [EventListType.Participates]: 'Nie jesteś uczestnikiem żadnego wydarzenia.',
    [EventListType.History]: 'Brak wydarzeń do wyświetlenia.',
  };

  const apiRoute = apiRoutes[listType];

  useEffect(() => {
    fetchEvents();
  }, [location]);

  useEffect(() => {
    sortAndFilterEvents();
  }, [sortOrder, startDate, endDate, events]);

  const fetchEvents = async () => {
    try {
      const response: PaginationType = await fetchGET(apiRoute);
      const data: EventDataType[] = response.items as EventDataType[];
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setFilteredEvents(
      query.length >= 3
        ? events.filter((event) => event.name.toLowerCase().includes(query))
        : events
    );
  };

  const sortAndFilterEvents = () => {
    let sortedEvents = [...events].sort((a, b) => {
      const dateA = new Date(a.time).getTime();
      const dateB = new Date(b.time).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    if (startDate || endDate) {
      sortedEvents = sortedEvents.filter((event) => {
        const eventDate = new Date(event.time).toISOString().split('T')[0];
        if (startDate && eventDate < startDate) return false;
        if (endDate && eventDate > endDate) return false;
        return true;
      });
    }

    setFilteredEvents(sortedEvents);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center gap-2">
          <select
            value={sortOrder}
            onChange={handleSortChange}
            className="border-[1px] border-primary px-3 py-1 text-primary rounded-md hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          >
            <option value="newest">Od najnowszych</option>
            <option value="oldest">Od najstarszych</option>
          </select>
          <Formik
            initialValues={{ startDate: '', endDate: '' }}
            onSubmit={() => {}}
          >
            {({ setFieldValue }) => (
              <div className="flex items-center gap-2">
                <Field
                  as={TextField}
                  name="startDate"
                  type="date"
                  label="Od"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setStartDate(e.target.value);
                    setFieldValue('startDate', e.target.value);
                  }}
                  className="border-[1px] border-grey-1 px-3 py-1 text-grey-2 rounded-md dark:border-grey-6 dark:text-grey-4"
                />
                <Field
                  as={TextField}
                  name="endDate"
                  type="date"
                  label="Do"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEndDate(e.target.value);
                    setFieldValue('endDate', e.target.value);
                  }}
                  className="border-[1px] border-grey-1 px-3 py-1 text-grey-2 rounded-md dark:border-grey-6 dark:text-white"
                />
              </div>
            )}
          </Formik>
        </div>

        <div className="flex w-full items-center mt-4 rounded-full border-[1px] border-grey-1 px-1 font-mont-md dark:border-grey-6">
          <input
            type="text"
            placeholder="Search events"
            className="w-full placeholder:text-grey-2"
            onChange={handleSearchChange}
          />
          <SearchIcon className="h-[25px] w-[25px] text-grey-2 hover:cursor-pointer" />
        </div>

        <div className="flex flex-col h-full pr-2 overflow-y-auto scroll divide-y-[1px] divide-grey-1">
          {filteredEvents.length === 0 ? (
            <p className="italic text-center">{noEventsMessage[listType]}</p>
          ) : (
            filteredEvents.map((event) => (
              <Event
                event={event}
                listType={listType}
                refreshEvents={fetchEvents}
                key={event.eventId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventList;
