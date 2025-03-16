import React, { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { MapPinIcon } from "@heroicons/react/24/solid";
import apiInstance from "../auth/useAuth";
import useUserStore from "@/store/store";

const EventCard = ({ event, handleRegister, user }) => {
  const isRegistered = event.registered_people.some(
    (person) => String(person.user) === String(user?.user_id)
  );

  return (
    <Card className="rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
      <CardMedia
        component="img"
        image={event.image || "/fallback-image.jpg"}
        alt={event.title}
        className="object-cover h-36"
      />
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <Typography variant="h6" className="font-semibold min-h-[48px]">
          {event.title}
        </Typography>

        <div className="flex flex-col gap-1 text-gray-500 text-sm my-2">
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 text-gray-500" /> {new Date(event.event_start).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 text-gray-500" /> {event.location?.name || "Unknown"}
          </div>
        </div>

        <Typography variant="body2" color="textSecondary" className="mt-2">
          {event?.registered_people?.length} joined
        </Typography>

        {isRegistered ? (
          <Typography className="text-green-500 font-bold mt-auto">Registered</Typography>
        ) : (
          event.is_available ? (
            <Button variant="contained" color="primary" className="mt-auto w-full" onClick={() => handleRegister(event.event_id)}>
              Join Now
            </Button>
          ) : (
            <div className="text-center"> Not Available </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

const Event = () => {
  const [events, setEvents] = useState([]);
  const { user } = useUserStore();
  const [is_available, setIsAvailable] = useState(null);
  const [categoryId, setCategoryId] = useState(0);
  const [locationId, setLocationId] = useState(0);
  const [locationData, setLocationData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    fetchLocationandCategoryData();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [is_available, categoryId, locationId]);

  const fetchLocationandCategoryData = async () => {
    try {
      const locationRes = await apiInstance.get(`/event/location/`);
      const categoryRes = await apiInstance.get(`/interests/list/`);
      setLocationData(locationRes.data);
      setCategoryData(categoryRes.data);
    } catch (error) {
      console.error("Error fetching location/category data", error);
    }
  };

  const fetchEvents = async () => {
    try {
      let url = `/events/`;
      let queryParams = {};

      // Add debug log to check the values of filters
      console.log('Filters:', { is_available, categoryId, locationId });

      if (is_available !== null && is_available !== undefined) {
        queryParams.is_available = is_available;
      }

      if (categoryId && categoryId != 0) {
        queryParams.category = categoryId;
      }

      if (locationId && locationId != 0) {
        queryParams.location = locationId;
      }

      const queryString = new URLSearchParams(queryParams).toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }

      console.log("API Request URL:", url); // Debug API URL

      const res = await apiInstance.get(url);
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

    try {
      const res = await apiInstance.post(`/event/register/`, registerData);
      if (res.status === 201) {
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
      <div className="sticky top-0 bg-white z-10 p-4 shadow-md">
        <div className="flex gap-4 mb-6">
          {/* Location Filter */}
          <FormControl fullWidth>
            <InputLabel>Location</InputLabel>
            <Select
              value={locationId || ""}
              onChange={(e) => setLocationId(e.target.value)}
              label="Location"
            >
              <MenuItem value="0">None</MenuItem>
              {locationData.map((location) => (
                <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Category Filter */}
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId || ""}
              onChange={(e) => setCategoryId(e.target.value)}
              label="Category"
            >
              <MenuItem value="0">None</MenuItem>
              {categoryData.map((category) => (
                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Availability Filter */}
          <FormControl fullWidth>
            <InputLabel>Availability</InputLabel>
            <Select
              value={is_available || ""}
              onChange={(e) => setIsAvailable(e.target.value)}
              label="Availability"
            >
              <MenuItem value="none">All</MenuItem>
              <MenuItem value={true}>Available</MenuItem>
              <MenuItem value={false}>Not Available</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Events List */}
      <Typography variant="h5" className="mb-10 font-bold">Discover Events</Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
        {events.map((event) => (
          <EventCard key={event.event_id} event={event} handleRegister={() => handleRegister(event?.event_id)} user={user[0]} />
        ))}
      </div>
    </div>
  );
};

export default Event;
