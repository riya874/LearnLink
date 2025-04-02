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
import { isBefore } from "date-fns";
import { toast } from "react-hot-toast"; // Importing toast from react-toastify

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const TutorAvailability = ({ tutorId }) => {
    const [availability, setAvailability] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const token = localStorage.getItem("authToken");
    const user = useSelector(selectUser);
    console.log(sessions)
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
            console.log("Fetched Sessions:", res.data.sessions); // Log fetched sessions
        } catch (error) {
            console.error("Error fetching sessions:", error);
        }
    };

    const handleSelectSlot = ({ start, end }) => {
        const today = new Date();
        if (isBefore(start, today)) {
            toast.error("You cannot set availability for past dates!");
            return;
        }
        setSelectedDate({ start, end });
    };

    const handleSaveAvailability = async () => {
        if (!selectedDate) {
            toast.error("Please select a date to set availability.");
            return;
        }

        const today = new Date();
        if (isBefore(selectedDate.start, today)) {
            toast.error("You cannot set availability for past dates!");
            return;
        }

        try {
            // Prepare the time slots to send to backend (using the start and end time)
            const updatedAvailability = [
                ...availability,
                {
                    day: format(selectedDate.start, "yyyy-MM-dd"),
                    timeSlots: [`${format(selectedDate.start, 'HH:mm')}-${format(selectedDate.end, 'HH:mm')}`],
                    start: selectedDate.start,
                    end: selectedDate.end,
                },
            ];

            // Send the updated availability to the backend
            await client.post(`/tutor/profile`, { availability: updatedAvailability }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Availability saved successfully!");

            // Fetch availability again to get updated data
            fetchAvailability();

            // Go back to the month view after saving
            setSelectedDate(null); // Clear the selected date to reset the calendar view
        } catch (error) {
            console.error("Error updating availability:", error);
            toast.error("Error saving availability!");
        }
    };

    // Function to parse time slots like '10:00-13:00' into start and end Date objects
    const parseTimeSlot = (day, timeSlot) => {
        const [startTime, endTime] = timeSlot.split("-");
        const startDate = new Date(`${day}T${startTime}:00`);
        const endDate = new Date(`${day}T${endTime}:00`);
        return { start: startDate, end: endDate };
    };

    // Generate events based on the availability and sessions
    const events = [
        // Availability slots that are not in the past
        ...availability.map((slot) =>
            slot.timeSlots.map((timeSlot) => {
                const { start, end } = parseTimeSlot(slot.day, timeSlot);

                // Check if the availability time slot is in the past
                const currentDate = new Date();
                if (isBefore(end, currentDate)) {
                    // If the end time of the availability is in the past, don't show it as available
                    return null;
                }

                return {
                    start,
                    end,
                    title: "Available",
                    color: "green", // Available slots are green
                };
            })
        ).flat().filter(Boolean), // Flatten and filter out null values for past slots

        // Filter out canceled sessions and only include active ones
        ...sessions
            .filter((session) => session.status !== 'Cancelled')  // Only include non-canceled sessions
            .map((session) => {
                const sessionStartDate = new Date(session.date); // Convert session date to a Date object

                // Split the time string (e.g., "15:00-20:00") into start and end times
                const [startTime, endTime] = session.time.split('-');
                const [startHour, startMinute] = startTime.split(':');
                const [endHour, endMinute] = endTime.split(':');

                // Set the session start time
                sessionStartDate.setHours(startHour, startMinute, 0); // Set the start time for the session

                // Create a new Date object for the end time of the session
                const sessionEndDate = new Date(sessionStartDate);
                sessionEndDate.setHours(endHour, endMinute, 0); // Set the end time for the session

                return {
                    start: sessionStartDate, // Corrected start time
                    end: sessionEndDate, // Corrected end time
                    title: `Booked`,
                    color: "red", // Booked slots are red
                    parentProfilePhoto: session.parentDetails?.user?.profilePhoto, // Store profile photo
                };
            }),
    ];




    // Get today's date for the minDate condition
    const today = new Date();

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
                minDate={today} // Disables past dates
            />

            {selectedDate && (
                <div className="mt-4">
                    <h3 className="text-lg">Selected Date: {format(selectedDate.start, "yyyy-MM-dd")}</h3>
                    <h4 className="text-md">Selected Time: {`${format(selectedDate.start, 'HH:mm')} - ${format(selectedDate.end, 'HH:mm')}`}</h4>
                    <button onClick={handleSaveAvailability} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
                        Save Availability
                    </button>
                </div>
            )}
        </div>
    );
};

export default TutorAvailability;
