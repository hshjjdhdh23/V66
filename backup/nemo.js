const axios = require('axios');

async function getAnswerFromAI(user, userID) {
    const services = [
        { url: `https://joshweb.click/ai/nemotron?q=${encodeURIComponent(user)}&uid=${userID}` },
    ];

    for (const service of services) {
        const data = await fetchFromAI(service.url);
        if (data) return data;
    }

    throw new Error("No valid response from any AI service");
}

async function fetchFromAI(url) {
    try {
        const response = await axios.get(url);
        const data = response.data;
        if (data.status && data.result) {
            console.log("AI Response:", data.result);
            return data.result;
        } else {
            throw new Error("No valid response from AI");
        }
    } catch (error) {
        console.error("Network Error:", error.message);
        return null;
    }
}

async function getAIResponse(input, userId, messageID) {
    const q = input.trim() || "";
    try {
        const response = await getAnswerFromAI(q, userId);
        return { response, messageID };
    } catch (error) {
        console.error("Error in getAIResponse:", error.message);
        throw error;
    }
}

let lastResponseMessageID = null;

module.exports.config = {
  name: 'nemo',
  version: '1.1.1',
  hasPermssion: 0,
  role: 0,
  credits: "cliff", 
  author: '',
  description: 'AI powered by NVIDIA',
  usePrefix: false,
  hasPrefix: true,
  commandCategory: 'AI',
  usage: '[prompt]',
  cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
    let user = args.join(' ');
    const userID = event.senderID;

    try {
        if (!user) {
            return api.sendMessage('Please provide a question first!', event.threadID, event.messageID);
        }

        const response = await axios.get(`https://joshweb.click/ai/nemotron?q=${encodeURIComponent(user)}&uid=${userID}`);

        const responseData = response.data.result;
        const baby = 
`(ＮＥＭＯＴＲＯＮ-𝘊𝘖𝘕𝘝𝘌𝘙𝘚𝘈𝘛𝘐𝘖𝘕𝘈𝘓）\n▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱\n${responseData}\n\nReply this message if you want to continue the conversation`;
        api.sendMessage(baby, event.threadID, event.messageID);
    } catch (err) {
        console.error(err);
        return api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
    }
};

module.exports.handleEvent = async function ({ event, api }) {
    const messageContent = event.body.trim().toLowerCase();

    if ((event.messageReply && event.messageReply.senderID === api.getCurrentUserID()) || (messageContent.startsWith("nemo") && event.senderID !== api.getCurrentUserID())) {
        const input = messageContent.replace(/^nemo\s*/, "").trim();
        try {
            const { response, messageID } = await getAIResponse(input, event.senderID, event.messageID);
            lastResponseMessageID = messageID;
            api.sendMessage(`(ＮＥＭＯＴＲＯＮ-𝘊𝘖𝘕𝘝𝘌𝘙𝘚𝘈𝘛𝘐𝘖𝘕𝘈𝘓）\n▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱\n${response}\n\nReply this message if you want to continue the conversation`, event.threadID, messageID);
        } catch (error) {
            console.error(error.message);
            api.sendMessage("An error occurred while processing your request.", event.threadID);
        }
    }
};