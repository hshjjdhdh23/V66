const axios = require('axios');

module.exports.config = {
  name: "ai",
  version: "1.0.0",
  role: 0,
  credits: "cliff",
  description: "Ask a question to the GP4O AI model",
  hasPrefix: true,  // Set to true if you want to use a prefix
  usage: "[question]",
  cooldowns: 10,
  aliases: ["askgp4o"],
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const out = msg => api.sendMessage(msg, threadID, messageID);

  // Ensure that a question is provided
  if (!args.length) return out("Please provide a question to ask the AI.");

  // Join all arguments to form the question
  const question = args.join(" ");

  // Define the URL for the request
  const url = `https://mywebsite-rest-api.vercel.app/api/redirect?model=cohere/command-r-03-2024&prompt=${encodeURIComponent(question)}`;

  try {
    // Send the GET request to the GP4O API
    const response = await axios.get(url);

    // Extract the AI's response text
    const aiResponse = response.data.response || "No response from AI.";

    // Send the response back to the chat
    return out(aiResponse);
  } catch (error) {
    return out(`Error: ${error.message}`);
  }
};
