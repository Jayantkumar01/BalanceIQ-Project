import { useState } from "react";
import api from "../services/api";

function CheckInForm({ refreshDashboard }) {

    const [form, setForm] = useState({
        moodRating: "",
        focusRating: "",
        tasksCompleted: "",
        meetingHours: "",
        remarks: ""
    });

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const submitCheckIn = async (e) => {

        e.preventDefault();

        try {

            const response =
                await api.post(
                    "/activity/checkin",
                    form
                );

            alert(response.data.message);

            refreshDashboard();

        } catch (error) {

            alert(
                error.response?.data?.error ||
                "Failed to submit check-in"
            );
        }
    };

    return (
        <form onSubmit={submitCheckIn}>

            <h2>Daily Check-In</h2>

            <input
                type="number"
                name="moodRating"
                placeholder="Mood Rating (1-10)"
                onChange={handleChange}
            />

            <br /><br />

            <input
                type="number"
                name="focusRating"
                placeholder="Focus Rating (1-10)"
                onChange={handleChange}
            />

            <br /><br />

            <input
                type="number"
                name="tasksCompleted"
                placeholder="Tasks Completed"
                onChange={handleChange}
            />

            <br /><br />

            <input
                type="number"
                name="meetingHours"
                placeholder="Meeting Hours"
                onChange={handleChange}
            />

            <br /><br />

            <textarea
                name="remarks"
                placeholder="Remarks"
                onChange={handleChange}
            />

            <br /><br />

            <button type="submit">
                Submit Check-In
            </button>

        </form>
    );
}

export default CheckInForm;