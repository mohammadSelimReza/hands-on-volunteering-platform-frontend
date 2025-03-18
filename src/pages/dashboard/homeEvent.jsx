import { useEffect, useState } from "react";
import { Card, CardContent, Button, Link } from "@mui/material";
import { EyeIcon } from "@heroicons/react/24/outline";
import apiInstance from "../auth/useAuth";
import useUserStore from "../../store/store";
import Toast from "../../configs/Toast";

export default function EventSidebar() {
  const [events, setEvents] = useState([]);
  const { user } = useUserStore(); // Get logged-in user info
  const fetchEvents = async () => {
    try {
      const res = await apiInstance.get("/events/");
      setEvents(res.data);
    } catch (error) {
      Toast().fire({
        title: `${error}`,
        icon: "error"
      })
    }
  };
  useEffect(() => {
    
    fetchEvents();
  }, []);

  const now = new Date();
  const ongoingEvents = events.filter(
    (event) => new Date(event.event_start) <= now && new Date(event.event_end) >= now
  );
  const upcomingEvents = events.filter((event) => new Date(event.event_start) > now);
  const previousEvents = events.filter((event) => new Date(event.event_end) < now);

  const handleRegister = async (id) => {
    const registerData = {
      user_id: user[0]?.user_id,
      event_id: id
    };

    try {
      const res = await apiInstance.post(`/event/register/`, registerData);
      if (res.status === 201) {
        Toast().fire({
          title: `${res.data.message}`,
          icon: "error"
        })
          setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.event_id === id
              ? { ...event, registered_people: [...event.registered_people, { user: user[0]?.user_id }] }
              : event
          )
        );
      }
    } catch (error) {
      Toast().fire({
        title: `${error}`,
        icon:"error"
      })
    }
  };

  const renderEvents = (title, eventList) => (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <Link href="/dashboard/events">View All</Link>
      </div>

      {eventList.slice(0, 2).map((event) => {
        const isRegistered = event.registered_people.some(
          (person) => String(person.user) === String(user[0]?.user_id) // Ensure both are strings
        );

        return (
          <Card key={event.event_id} className="mb-4 bg-white rounded-lg shadow-md">
            <CardContent>
              <div className="flex gap-x-4 mb-4 items-center">
                <img src={event.image} alt={event.title} className="rounded-lg w-16 h-16" />
                <h3 className="font-semibold text-lg mt-2">{event.title}</h3>
              </div>

              {isRegistered ? (
                <span className="text-green-500 font-bold">Registered</span>
              ) : (
                event.is_available && (
                  <Button
                    onClick={() => handleRegister(event.event_id)}
                    variant="contained"
                    color="primary"
                    className="mt-2 w-full"
                  >
                    Join Now
                  </Button>
                )
              )}
            </CardContent>
          </Card>
        );
      })}

      {eventList.length > 2 && (
        <button className="text-blue-500 hover:underline flex items-center mt-2">
          <EyeIcon className="w-5 h-5 mr-1" /> View All
        </button>
      )}
    </div>
  );

  return (
    <div className="w-80 ml-6 hidden md:block">
      {renderEvents("Ongoing Events", ongoingEvents)}
      {renderEvents("Upcoming Events", upcomingEvents)}
      {renderEvents("Previous Events", previousEvents)}
    </div>
  );
}
