const PORT = process.env.PORT || 8000;
const express = require('express');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();

app.use(express.json()); // Middleware to parse JSON in the request body

app.get('/haiku', async (req, res) => {
    const authHeaders = req.headers;

    // Check if the provided secretKey is valid
    if (authHeaders.secretKey !== "super-secret-key") {
        return res.status(403).json({ message: "You are not authorized to make this request." });
    }

    // Initialize OpenAI API with the provided API key
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    try {
        // Request a haiku completion from OpenAI
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "Write a haiku" }],
            model: "gpt-3.5-turbo" // Use the GPT-3.5-turbo model for faster responses
        });

        // Log the generated haiku to the console
        console.log(completion.choices[0].message.content);

        // Respond with the generated haiku
        res.json({ haiku: completion.choices[0].message.content });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while generating a haiku." });
    }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

