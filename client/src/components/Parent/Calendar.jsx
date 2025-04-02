import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import client from "../../lib/axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/auth/authSlice";
import toast from "react-hot-toast";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const ParentBooking = () => {
    const [tutors, setTutors] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const token = localStorage.getItem("authToken");
    const [parentInfo, setParentInfo] = useState({});
    const user = useSelector(selectUser);

    useEffect(() => {
        if (user?._id) {
            client
                .get(`/parent/${user._id}`)
                .then((response) => {
                    setParentInfo(response.data.parent);
                })
                .catch((error) => console.error("Error fetching parent details:", error));
        }
    }, [user?._id]);

    useEffect(() => {
        fetchAvailableTutors();
    }, []); // Fetch available tutors when the component mounts

    useEffect(() => {
        if (parentInfo?._id) {
            fetchSessions(parentInfo._id);
        }
    }, [parentInfo?._id]);

    const fetchAvailableTutors = async () => {
        try {
            const currentDate = format(new Date(), "yyyy-MM-dd");
            const currentTime = new Date();

            const res = await client.get(`/tutor/available?date=${currentDate}`);
            setTutors(res.data.tutors || []);

            // Now fetch booked sessions for each tutor
            for (const tutor of res.data.tutors) {
                const bookedSessionsRes = await client.get(
                    `/session/all?date=${currentDate}&tutorId=${tutor._id}`
                );
                const bookedSessions = bookedSessionsRes.data.sessions || [];

                // Filter out unavailable slots
                tutor.availability = tutor.availability.map((availability) => {
                    availability.timeSlots = availability.timeSlots.filter((timeSlot) => {
                        const [startTime, endTime] = timeSlot.split("-");
                        const startDate = new Date(`${availability.day} ${startTime}`);
                        const endDate = new Date(`${availability.day} ${endTime}`);

                        // Check if the current time has passed the time slot
                        if (currentTime > endDate) return false;

                        // Check if the session is already booked
                        const isBooked = bookedSessions.some(
                            (session) => session.time === timeSlot
                        );

                        return !isBooked;
                    });

                    return availability;
                });
            }

            setTutors([...res.data.tutors]); // Trigger re-render with updated availability
        } catch (error) {
            console.error("Error fetching tutors:", error);
            toast.error("Failed to fetch available tutors.");
        }
    };

    const fetchSessions = async (parentId) => {
        if (!parentId) return;
        try {
            const res = await client.get(`/session/parent/${parentId}`);
            setSessions(res.data.sessions || []);
        } catch (error) {
            console.error("Error fetching sessions for parent:", error);
            toast.error("Failed to fetch your sessions.");
        }
    };

    const handleSelectSlot = ({ start }) => {
        setSelectedDate(start);
    };

    const handleBookSession = async () => {
        if (!selectedTutor || !selectedTime || !selectedDate) {
            return toast.error("Please select a tutor, time slot, and date");
        }

        const childName = parentInfo?.children?.name;
        const subject = selectedTutor?.subjects?.[0];

        if (!childName || !subject) {
            return toast.error("Please make sure the child name and subject are available");
        }

        try {
            await client.post(
                "/session/book",
                {
                    tutorId: selectedTutor._id,
                    parentId: parentInfo._id,
                    childName: childName,
                    subject: subject,
                    date: format(selectedDate, "yyyy-MM-dd"),
                    time: selectedTime,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Re-fetch the sessions after booking
            fetchSessions(parentInfo._id);
            toast.success("Session booked successfully!");
        } catch (error) {
            console.error("Error booking session:", error);
            const errorMessage = error.response?.data?.message || "Failed to book session";
            toast.error(errorMessage);
        }
    };

    // Convert tutors' availability into events, while checking if they are booked
    const events = tutors.flatMap((tutor) => {
        return tutor.availability.flatMap((availability) => {
            return availability.timeSlots.map((timeSlot) => {
                const [startTime, endTime] = timeSlot.split("-");
                const startDate = new Date(`${availability.day} ${startTime}`);
                const endDate = new Date(`${availability.day} ${endTime}`);

                return {
                    start: startDate,
                    end: endDate,
                    title: `${tutor.userId.username} - Available`, // Include tutor's name and availability status
                    color: "green", // Green for available slots
                    description: `Time Slot: ${startTime} - ${endTime}`,
                    tutorId: tutor,
                    timeSlot: timeSlot,
                    profilePhoto: tutor.userId.profilePhoto, // Add profile photo to the event
                };
            }).filter(Boolean); // Remove null values caused by unavailable slots
        }).flat(); // Flatten the array since we're using flatMap
    });

    const handleEventClick = (event) => {
        setSelectedTutor(event.tutorId);
        setSelectedTime(event.timeSlot);
        setSelectedDate(event.start);
    };

    // Custom Event Component for Rendering Profile Photo and Tutor Info
    const Event = ({ event }) => {
        return (
            <div className="flex items-center">
                <img
                    src={event.profilePhoto}
                    alt={event.tutorId.userId.username}
                    className="w-10 h-10 rounded-full mr-2"
                />
                <div>
                    <p>{event.tutorId.userId.username}</p>
                    <p>{event.title}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="mt-20">
            <h2 className="text-xl font-semibold">Book a Tutor</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleEventClick}
                style={{ height: 500 }}
                eventPropGetter={(event) => ({
                    style: { backgroundColor: event.color || "green" },
                })}
                components={{
                    event: Event, // Using custom event component to display profile photo and name
                }}
            />

            {selectedDate && selectedTutor && selectedTime && (
                <div className="mt-4">
                    <h3 className="text-lg">Selected Tutor:</h3>
                    <div className="flex items-center">
                        <img
                            src={selectedTutor.userId.profilePhoto}
                            alt="Tutor"
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <span className="font-semibold">{selectedTutor.userId.username}</span>
                    </div>
                    <p>Selected Date: {format(selectedDate, "yyyy-MM-dd")}</p>
                    <p>Time Slot: {selectedTime}</p>
                    <button
                        onClick={handleBookSession}
                        className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Book Session
                    </button>
                </div>
            )}

            <h2 className="text-xl font-semibold mt-6">Your Sessions</h2>
            <ul>
                {sessions.map((session) => (
                    <li key={session._id} className="p-2 border mt-2">
                        <span>
                            {session.subject} with {session.tutorId.userId.username} on{" "}
                            {format(new Date(session.date), "MMMM dd, yyyy")} at {session.time}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ParentBooking;
