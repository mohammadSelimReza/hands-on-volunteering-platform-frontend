import React, { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import { MapPinIcon, CalendarIcon } from "@heroicons/react/24/solid";
import apiInstance from "../auth/useAuth";


const EventCard = ({ event }) => {
  return (
<Card className="rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
  <CardMedia
    component="img"
    height="140"
    image={event.image || "/fallback-image.jpg"} // Fallback image
    alt={event.title}
    className="object-cover"
  />
  <CardContent className="p-4 flex flex-col justify-between h-full">
    {/* Title with fixed height */}
    <Typography variant="h6" className="font-semibold min-h-[48px]">
      {event.title}
    </Typography>

    {/* Align Date & Location properly */}
    <div className="flex flex-col gap-1 text-gray-500 text-sm my-2">
      <div className="flex items-center">
        <MapPinIcon className="h-5 w-5 text-gray-500" />  {new Date(event.event_start).toLocaleDateString()}
      </div>
      <div className="flex items-center">
      <MapPinIcon className="h-5 w-5 text-gray-500" />  {event.location?.name || "Unknown"}
      </div>
    </div>

    {/* Event Statistics */}
    <Typography variant="body2" color="textSecondary" className="mt-2">
        {event?.registered_people?.length} joined
    </Typography>

    {/* Button should always align at the bottom */}
    <Button variant="outlined" color="primary" className="mt-auto w-full">
      Join
    </Button>
  </CardContent>
</Card>


  );
};

const Event = () => {
    const [events,setEvents] = useState([]);
    const fetchEvents = async() => {
        try {
            const res = await apiInstance.get(`/event/create/`)
            console.log(res?.data);
            setEvents(res?.data) 
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        fetchEvents();
    },[])
    console.log(events);
  return (
    <div className="container mx-auto p-6 bg-white rounded-xl">
      <Typography variant="h5" className="mb-10 font-bold">
        Discover Events
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Event;
