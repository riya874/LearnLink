import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import client from "../../lib/axios";
import { selectUser } from "../../redux/features/auth/authSlice";
import { useSelector } from "react-redux";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const TutorAvailability = ({ tutorId }) => {
    const [availability, setAvailability] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const token = localStorage.getItem("authToken");
    const user = useSelector(selectUser);

    useEffect(() => {
        fetchAvailability();
        fetchSessions();
    }, []);

    const fetchAvailability = async () => {
        try {
            const res = await client.get(`/tutor/${user._id}`);
            setAvailability(res.data.tutor.availability || []);
        } catch (error) {
            console.error("Error fetching availability:", error);
        }
    };

    const fetchSessions = async () => {
        try {
            const res = await client.get(`/session/tutor/${tutorId}`);
            setSessions(res.data.sessions || []);
            console.log(res.data.sessions)
        } catch (error) {
            console.error("Error fetching sessions:", error);
        }
    };

    const handleSelectSlot = ({ start }) => {
        setSelectedDate(start);
    };

    const handleSaveAvailability = async () => {
        try {
            const updatedAvailability = [...availability, { day: format(selectedDate, "yyyy-MM-dd"), timeSlots }];
            await client.post(`/tutor/profile`, { availability: updatedAvailability }, { headers: { Authorization: `Bearer ${token}` } });
            setAvailability(updatedAvailability);
        } catch (error) {
            console.error("Error updating availability:", error);
        }
    };

    const events = [
        ...availability.map((slot) => ({
            start: new Date(slot.day),
            end: new Date(slot.day),
            title: "Available",
            color: "green",
        })),
        ...sessions.map((session) => ({
            start: new Date(session.date),
            end: new Date(session.date),
            //title: `Booked by ${session.parentId?.username || "Unknown"}`, // Show parent's name
            title: `Booked `, // Show parent's name
            color: "red",
            parentProfilePhoto: session.parentId?.profilePhoto, // Store profile photo
        })),
    ];

    return (
        <div>
            <h2 className="text-xl font-semibold">Manage Availability</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                onSelectSlot={handleSelectSlot}
                style={{ height: 500 }}
                eventPropGetter={(event) => ({
                    style: { backgroundColor: event.color },
                })}
                components={{
                    event: ({ event }) => (
                        <div className="flex items-center">
                            {event.color === "red" && event.parentProfilePhoto && (
                                <img
                                    src={event.parentProfilePhoto}
                                    alt="Parent"
                                    className="w-6 h-6 rounded-full mr-2"
                                />
                            )}
                            <span>{event.title}</span>
                        </div>
                    ),
                }}
            />
            {selectedDate && (
                <div className="mt-4">
                    <h3 className="text-lg">Selected Date: {format(selectedDate, "yyyy-MM-dd")}</h3>
                    <input
                        type="text"
                        placeholder="Enter available time slots (comma separated)"
                        onChange={(e) => setTimeSlots(e.target.value.split(","))}
                        className="border p-2 w-full mt-2"
                    />
                    <button onClick={handleSaveAvailability} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
                        Save Availability
                    </button>
                </div>
            )}
        </div>
    );
};

export default TutorAvailability;
