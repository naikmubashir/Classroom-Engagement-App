import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

function App() {
  const [studentName, setStudentName] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);
  const [pollData, setPollData] = useState({});
  const [aiRecommendations, setAIRecommendations] = useState('');
  const [loading, setLoading] = useState(false);

  // Poll submission
  const submitPoll = (option) => {
    const data = { option };
    socket.emit("submit-poll", data);
  };

  useEffect(() => {
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
    return () => {
      socket.off("update-poll");
    };
  }, []);

  const fetchAIRecommendations = async () => {
    try {
      setLoading(true);
      const result = await axios.post(
        'http://localhost:8000/api/openai',
        {
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: `Based on this feedback: "${feedbackText}", recommend study resources or strategies.` }
          ]
        }
      );
      setAIRecommendations(result.data.choices[0].message.content);
    } catch (error) {
      console.error("Error with AI recommendation", error);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    try {
      await axios.post("http://localhost:8000/api/feedback/submit", {
        studentName,
        feedbackText,
        rating,
      });
      fetchAIRecommendations();
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex">
      <div className="w-1/2 pr-4"> {/* Left Side */}
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          Classroom Engagement App
        </h1>

        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-6">
          {/* Feedback Form */}
          <h2 className="text-2xl font-semibold mb-4">Submit Feedback</h2>
          <input
            type="text"
            placeholder="Course Name"
            className="w-full mb-4 p-2 border rounded"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <textarea
            placeholder="Feedback"
            className="w-full mb-4 p-2 border rounded"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
          <input
            type="number"
            max="5"
            min="1"
            className="w-full mb-4 p-2 border rounded"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          <button
            onClick={submitFeedback}
            className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"
          >
            Submit Feedback
          </button>
        </div>

        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-6">
          {/* Poll Section */}
          <h2 className="text-2xl font-semibold mb-4">Classroom Poll</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => submitPoll("Extremely Challenging")}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
            >
              Extremely Challenging
            </button>
            <button
              onClick={() => submitPoll("Challenging")}
              className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
            >
              Challenging
            </button>
            <button
              onClick={() => submitPoll("Moderate")}
              className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
            >
              Moderate
            </button>
            <button
              onClick={() => submitPoll("Easy")}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
              Easy
            </button>
            <button
              onClick={() => submitPoll("Very Easy")}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Very Easy
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-2">Live Poll Results</h2>
          <p>Extremely Challenging: {pollData["Extremely Challenging"] || 0}</p>
          <p>Challenging: {pollData["Challenging"] || 0}</p>
          <p>Moderate: {pollData["Moderate"] || 0}</p>
          <p>Easy: {pollData["Easy"] || 0}</p>
          <p>Very Easy: {pollData["Very Easy"] || 0}</p>
        </div>
      </div>

      <div className="w-1/2 pl-4"> {/* Right Side */}
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">AI Recommendations</h2>

          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-3 text-gray-500">Generating recommendations...</p>
            </div>
          ) : (
            <pre className="bg-gray-100 p-4 rounded-lg max-w-full overflow-auto break-words">
              {aiRecommendations}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
























/*

import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import OpenAI from "openai";
import "./App.css";
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



//   const [financialAid, setFinancialAid] = useState([]);

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
    ***************************
    const openai = new OpenAI({
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
    });
    ********************************
    const fetchAIRecommendations = async () => {
    try {
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

      {//Feedback Form }
      <input
        type="text"
        placeholder="Course Name"
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

      {/* Poll Section }
      <h1>Classroom Poll</h1>
      <button onClick={() => submitPoll("Extremely Challenging")}>Extremely Challenging</button>
      <button onClick={() => submitPoll("Challenging")}>Challenging</button>
      <button onClick={() => submitPoll("Moderate")}>Moderate</button>
      <button onClick={() => submitPoll("Easy")}>Easy</button>
      <button onClick={() => submitPoll("Very Easy")}>Very Easy</button>

      <h2>Live Poll Results</h2>
      <p>Extremely Challenging: {pollData["Extremely Challenging"] || 0}</p>
      <p>Challenging: {pollData["Challenging"] || 0}</p>
      <p>Moderate: {pollData["Moderate"] || 0}</p>
      <p>Easy: {pollData["Easy"] || 0}</p>
      <p>Very Easy: {pollData["Very Easy"] || 0}</p>

    <div>
    {/* <h2>Financial Aid Opportunities</h2>
    {financialAid.map((aid, index) => (
      <div key={index}>
        <h3>{aid.title}</h3>
        <p>{aid.description}</p>
      </div>
    ))} *}
  </div>

<div>
  <h2>AI Recommendations</h2>
  
  <pre>{aiRecommendations}</pre>
</div>

    </div>
  );
}

export default App;
*/