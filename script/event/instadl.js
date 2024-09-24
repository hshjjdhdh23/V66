const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "instadl",
  version: "1.0.0",
  credits: "Cliff",
  description: "Download Instagram URL" 
};

const downloadDirectory = path.resolve(__dirname, 'cache');

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const regex = /https:\/\/www\.instagram\.com\/reel\/[a-zA-Z0-9_-]+\/\?igsh=[a-zA-Z0-9_=-]+$/;
    if (event.body !== null) {
      const url = event.body;
      if (regex.test(url)) {
        const response = await axios.get(`https://cprojectapisjonellv2.adaptable.app/api/fbdl?url=${encodeURIComponent(url)}`);
        if (response.data && response.data.url && response.data.url.data.length > 0) {
          const videoUrl = response.data.url.data[0].url;
          const videoResponse = await axios.get(videoUrl, { responseType: "stream" });
          const filePath = path.join(downloadDirectory, `${Date.now()}.mp4`);
          const fileStream = fs.createWriteStream(filePath);
          videoResponse.data.pipe(fileStream);
          fileStream.on('finish', () => {
            const fileSize = fs.statSync(filePath).size / (1024 * 1024); // in MB
            if (fileSize > 25) {
              api.sendMessage("The file is too large, cannot be sent", event.threadID, () => fs.unlinkSync(filePath), event.messageID);
            } else {
              const messageBody = `𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 Instagram\n`;
              api.sendMessage({
                body: messageBody,
                attachment: fs.createReadStream(filePath)
              }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
            }
          });
        }
      }
    }
  } catch (err) {
  }
};
