const express = require('express');
const OpenAI = require('openai'); // Import OpenAI SDK
const dotenv = require('dotenv');
const router = express.Router();

// Load environment variables
dotenv.config();
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";
// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
    baseURL:endpoint,
    apiKey: process.env.OPENAI_API_KEY
});

// POST request to handle OpenAI completions
router.post('/', async (req, res) => {
    const { messages } = req.body;

    try {
        // Make a request to OpenAI using the SDK
        const completion = await openai.chat.completions.create({
            model: modelName,
            messages: messages, // Send messages from the request body
            temperature: 1.0,
            top_p: 1.0,
            max_tokens: 1000,
        });
        // console.log("serrrrrverr"+completion[keys])
        // console.log("meeessssssssaaaagee"+messages)

        // Send back the response from OpenAI to the client
        res.json(completion);
    } catch (error) {
        console.error('Error in OpenAI request:', error);
        res.status(500).json({ error: 'Failed to fetch data from OpenAI' });
    }
});

module.exports = router;





// const express = require("express");
// import OpenAI from "openai";
// const axios = require("axios");
// const router = express.Router();

// // POST request to handle OpenAI completions
// router.post("/", async (req, res) => {
//   const { messages } = req.body;

//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-4", // Specify the model you want to use
//         messages: messages, // Send the messages from the request body
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//       }
//     );

//     // Send back the response from OpenAI to the client
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error in OpenAI request:", error);
//     res.status(500).json({ error: "Failed to fetch data from OpenAI" });
//   }
// });

// module.exports = router;
