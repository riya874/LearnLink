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
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/auth/authSlice";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const ParentBooking = ({ parentId }) => {
    const [tutors, setTutors] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [rescheduleSessionId, setRescheduleSessionId] = useState(null);
    const token = localStorage.getItem("authToken");
    const [parentInfo, setParentInfo] = useState({})
    const user = useSelector(selectUser)
    useEffect(() => {
        if (user?._id) {
            client.get(`/parent/${user._id}`)
                .then(response => {
                    setParentInfo(response.data.parent);
                })
                .catch(error => console.error("Error fetching parent details:", error));
        }
    }, [user?._id]);  // Fetch parent info when user ID is available

    useEffect(() => {
        if (selectedDate) fetchAvailableTutors();
        fetchSessions();
    }, [selectedDate]);

    useEffect(() => {
        if (parentInfo?._id) {
            fetchSessions(parentInfo._id);
        }
    }, [parentInfo?._id]);  // Fetch sessions only after parentInfo._id is set

    const fetchAvailableTutors = async () => {
        try {
            const formattedDate = format(selectedDate, "yyyy-MM-dd");
            const res = await client.get(`/tutor/available?date=${formattedDate}`);
            console.log("Available Tutors:", res.data.tutors);
            setTutors(res.data.tutors || []);
        } catch (error) {
            console.error("Error fetching tutors:", error);
        }
    };



    const fetchSessions = async (parentId) => {
        try {
            const res = await client.get(`/session/parent/${parentId}`);
            setSessions(res.data.sessions || []);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        }
    };

    const handleSelectSlot = ({ start }) => {
        setSelectedDate(start);
    };

    const handleBookSession = async () => {
        if (!selectedTutor || !selectedTime) return alert("Select a tutor and time slot");

        try {
            await client.post("/session/book", {
                tutorId: selectedTutor,
                parentId: parentInfo._id,
                childName: "Anushka Upadhyay",
                subject: "English",
                date: format(selectedDate, "yyyy-MM-dd"),
                time: selectedTime
            }, { headers: { Authorization: `Bearer ${token}` } });

            fetchSessions();
            alert("Session booked successfully!");
        } catch (error) {
            console.error("Error booking session:", error);
            alert("Failed to book session");
        }
    };

    const handleCancelSession = async (sessionId) => {
        try {
            await client.put(`/session/cancel/${sessionId}`, {}, { headers: { Authorization: `Bearer ${token}` } });

            fetchSessions();
            alert("Session cancelled successfully!");
        } catch (error) {
            console.error("Error cancelling session:", error);
            alert("Failed to cancel session");
        }
    };

    const handleRescheduleSession = async () => {
        if (!rescheduleSessionId || !selectedDate || !selectedTime) {
            return alert("Select new date and time to reschedule");
        }

        try {
            await client.put(`/session/reschedule/${rescheduleSessionId}`, {
                newDate: format(selectedDate, "yyyy-MM-dd"),
                newTime: selectedTime
            }, { headers: { Authorization: `Bearer ${token}` } });

            fetchSessions();
            alert("Session rescheduled successfully!");
            setRescheduleSessionId(null);
        } catch (error) {
            console.error("Error rescheduling session:", error);
            alert("Failed to reschedule session");
        }
    };

    const events = [
        ...sessions.map((session) => ({
            start: new Date(session.date),
            end: new Date(session.date),
            title: `Session with ${session.tutorId.userId.username}`,
            color: session.status === "Cancelled" ? "gray" : "red"
        }))
    ];

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
                style={{ height: 500 }}
                eventPropGetter={(event) => ({ style: { backgroundColor: event.color } })}
            />

            {selectedDate && (
                <div className="mt-4">
                    <h3 className="text-lg">Available Tutors for {format(selectedDate, "yyyy-MM-dd")}</h3>
                    <ul>
                        {tutors.length === 0 ? (
                            <p>No tutors available on this day</p>
                        ) : (
                            tutors.map((tutor) => (
                                <li key={tutor._id} onClick={() => setSelectedTutor(tutor._id)}>
                                    <img src={tutor.userId.profilePhoto} alt="Tutor" className="w-10 h-10 rounded-full inline-block mr-2" />
                                    {tutor.userId.username}
                                </li>
                            ))
                        )}
                    </ul>
                    <input type="text" placeholder="Enter time slot (e.g., 10:00 AM)" onChange={(e) => setSelectedTime(e.target.value)} className="border p-2 w-full mt-2" />
                    <button onClick={handleBookSession} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">Book Session</button>
                </div>
            )}

            <h2 className="text-xl font-semibold mt-6">Your Sessions</h2>
            <ul>
                {sessions.map((session) => (
                    <li key={session._id} className="p-2 border mt-2 flex justify-between">
                        <span>{session.subject} with {session.tutorId.username} on {session.date} at {session.time}</span>
                        <div>
                            <button onClick={() => handleCancelSession(session._id)} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
                            <button onClick={() => setRescheduleSessionId(session._id)} className="bg-blue-500 text-white px-4 py-2 rounded">Reschedule</button>
                        </div>
                    </li>
                ))}
            </ul>

            {rescheduleSessionId && (
                <button onClick={handleRescheduleSession} className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">Confirm Reschedule</button>
            )}
        </div>
    );
};

export default ParentBooking;
