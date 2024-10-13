// frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [studentName, setStudentName] = useState('');
    const [feedbackText, setFeedbackText] = useState('');
    const [rating, setRating] = useState(5);

    const submitFeedback = async () => {
        try {
            await axios.post('http://localhost:5000/api/feedback/submit', {
                studentName,
                feedbackText,
                rating,
            });
            alert('Feedback submitted successfully!');
        } catch (error) {
            console.error('Error submitting feedback', error);
        }
    };

    return (
        <div>
            <h1>Classroom Engagement App</h1>
            <input
                type="text"
                placeholder="Student Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
            />
            <textarea
                placeholder="Feedback"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
            />
            <input
                type="number"
                max="5"
                min="1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
            />
            <button onClick={submitFeedback}>Submit Feedback</button>
        </div>
    );
}

export default App;
