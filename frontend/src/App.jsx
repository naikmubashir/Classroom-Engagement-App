import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import OpenAI from "openai";
const socket = io("http://localhost:8000");

function App() {
  const [studentName, setStudentName] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);
  const [pollData, setPollData] = useState({});

  

  // Poll submission
  const submitPoll = (option) => {
    const data = { option };
    socket.emit("submit-poll", data); // Send poll data to the server
  };

  useEffect(() => {
    // Fetch initial poll data
    const fetchPolls = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/polls");
        const data = await response.json();
        const pollResults = data.reduce((acc, poll) => {
          acc[poll.option] = poll.votes;
          return acc;
        }, {});
        setPollData(pollResults);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    // Socket event listeners
    socket.on("update-poll", (data) => {
      const pollResults = data.reduce((acc, poll) => {
        acc[poll.option] = poll.votes;
        return acc;
      }, {});
      setPollData(pollResults);
    });

    fetchPolls();

    // Cleanup on component unmount
    return () => {
      socket.off("update-poll");
    };
  }, []);



  const [financialAid, setFinancialAid] = useState([]);

// const fetchFinancialAid = async () => {
//   try {
//     const response = await axios.get("http://localhost:8000/api/financial-aid"); // Your API endpoint
//     setFinancialAid(response.data);
//   } catch (error) {
//     console.error("Error fetching financial aid data", error);
//   }
// };

// useEffect(() => {
//   fetchFinancialAid();
// }, []);

const [aiRecommendations, setAIRecommendations] = useState('');

  const fetchAIRecommendations = async () => {
    try {
    //   const response = await axios.post(
    //     "https://api.openai.com/v1/engines/davinci-codex/completions",
    //     {
    //       prompt: `Based on this feedback: "${feedbackText}", recommend study resources or strategies.`,
    //       max_tokens: 150,
    //     },
    //     {
    //       headers: {
    //         'Authorization': `Bearer api-key`
    //       }
    //     }
    //   );
    /*const openai = new OpenAI({
        apiKey: '' // Replace with your actual API key
    });
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content: `Based on this feedback: "${feedbackText}", recommend study resources or strategies.`,
            },
        ],
    });*/
    const result = await axios.post(
        'http://localhost:8000/api/openai', // Call your backend
        {
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: `Based on this feedback: "${feedbackText}", recommend study resources or strategies.` }
            ]
        }
    );
    console.log(result);
      setAIRecommendations(result.data.choices[0].message.content); // Display AI recommendation
    } catch (error) {

      console.error("Error with AI recommendation", error);
    }
  };
  
  // Call fetchAIRecommendations after feedback is submitted or updated
  const submitFeedback = async () => {
    try {
      await axios.post("http://localhost:8000/api/feedback/submit", {
        studentName,
        feedbackText,
        rating,
      });
      fetchAIRecommendations(); // Fetch recommendations after feedback
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback", error);
    }
  };

  

  return (
    <div>
      <h1>Classroom Engagement App</h1>

      {/* Feedback Form */}
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

      {/* Poll Section */}
      <h1>Classroom Poll</h1>
      <button onClick={() => submitPoll("Option 1")}>Vote for Option 1</button>
      <button onClick={() => submitPoll("Option 2")}>Vote for Option 2</button>

      <h2>Live Poll Results</h2>
      <p>Option 1: {pollData["Option 1"] || 0}</p>
      <p>Option 2: {pollData["Option 2"] || 0}</p>

    {/* <div>
    <h2>Financial Aid Opportunities</h2>
    {financialAid.map((aid, index) => (
      <div key={index}>
        <h3>{aid.title}</h3>
        <p>{aid.description}</p>
      </div>
    ))}
  </div> */}

<div>
  <h2>AI Recommendations</h2>
  
  <pre>{aiRecommendations}</pre>
</div>

    </div>
  );
}

export default App;
