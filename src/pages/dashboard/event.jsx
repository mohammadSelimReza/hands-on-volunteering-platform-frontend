import React, { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import { MapPinIcon } from "@heroicons/react/24/solid";
import apiInstance from "../auth/useAuth";
import useUserStore from "@/store/store";

const EventCard = ({ event, handleRegister, user }) => {
  const isRegistered = event.registered_people.some(
    (person) => String(person.user) === String(user?.user_id) // Ensure matching types
  );

  return (
    <Card className="rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
      <CardMedia
        component="img"
        image={event.image || "/fallback-image.jpg"} // Fallback image
        alt={event.title}
        className="object-cover h-36"
      />
      <CardContent className="p-4 flex flex-col justify-between h-full">
        {/* Title */}
        <Typography variant="h6" className="font-semibold min-h-[48px]">
          {event.title}
        </Typography>

        {/* Date & Location */}
        <div className="flex flex-col gap-1 text-gray-500 text-sm my-2">
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 text-gray-500" /> {new Date(event.event_start).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 text-gray-500" /> {event.location?.name || "Unknown"}
          </div>
        </div>

        {/* Joined Count */}
        <Typography variant="body2" color="textSecondary" className="mt-2">
          {event?.registered_people?.length} joined
        </Typography>

        {/* Registration Button */}
        {isRegistered ? (
          <Typography className="text-green-500 font-bold mt-auto">Registered</Typography>
        ) : (
          event.is_available 
          ?
          (
            <Button
              variant="contained"
              color="primary"
              className="mt-auto w-full"
              onClick={() => handleRegister(event.event_id)}
            >
              Join Now
            </Button>
          )
          :
          (
            <div className="text-center"> Not Available </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

const Event = () => {
  const [events, setEvents] = useState([]);
  const { user } = useUserStore(); // Get logged-in user info

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await apiInstance.get(`/event/create/`);
      setEvents(res?.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleRegister = async (eventId) => {
    if (!user) return;

    const registerData = {
      user_id: user[0]?.user_id,
      event_id: eventId,
    };
    console.log(JSON.stringify(registerData))
    try {
      const res = await apiInstance.post(`/event/register/`, registerData);
      if (res.status === 201) {
        console.log(res.data.message);

        // 🔥 Update state to reflect registration immediately
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.event_id === eventId
              ? { ...event, registered_people: [...event.registered_people, { user: user[0]?.user_id }] }
              : event
          )
        );
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-xl">
      <Typography variant="h5" className="mb-10 font-bold">Discover Events</Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
        {events.map((event) => (
          <EventCard key={event.event_id} event={event} handleRegister={()=>handleRegister(event?.event_id)} user={user[0]} />
        ))}
      </div>
    </div>
  );
};

export default Event;
