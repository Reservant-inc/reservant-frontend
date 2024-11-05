import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import FocusedRestaurantEventDetails from "./FocusedRestaurantEventDetails";
import SearchIcon from "@mui/icons-material/Search";

interface Event {
  eventId: number;
  name: string;
  description: string;
  time: string;
  maxPeople: number;
  mustJoinUntil: string;
  creator: {
    userId: string;
    firstName: string;
    lastName: string;
    photo: string | null;
  };
  photo: string | null;
  numberInterested: number;
}

interface FocusedRestaurantEventsListProps {
  events: Event[];
}

const FocusedRestaurantEventsList: React.FC<FocusedRestaurantEventsListProps> = ({
  events,
}) => {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    if (query.length >= 3) {
      setFilteredEvents(
        events.filter((event) => event.name.toLowerCase().includes(query))
      );
    } else {
      setFilteredEvents(events); // Resetuje filtry, gdy mniej niż 3 znaki
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search Input */}
      <div className="flex w-full items-center rounded-full border-[1px] border-grey-1 bg-grey-0 px-1 font-mont-md dark:border-grey-6 dark:bg-grey-5">
        <input
          type="text"
          placeholder="Search events"
          className="w-full placeholder:text-grey-2"
          onChange={handleSearchChange}
        />
        <SearchIcon className="h-[25px] w-[25px] text-grey-2 hover:cursor-pointer" />
      </div>

      {/* Events List */}
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          <FocusedRestaurantEventDetails key={event.eventId} event={event} />
        ))
      ) : (
        <div className="text-center">
          <p>No events found for this restaurant.</p>
        </div>
      )}
    </div>
  );
};

export default FocusedRestaurantEventsList;
