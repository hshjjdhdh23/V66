const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "capcutDl",
  version: "1.0.0",
  credits: "Cliff",
  description: "Download Capcut URL"
};

const downloadDirectory = path.resolve(__dirname, 'cache');

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const regex = /https:\/\/www\.capcut\.com\/t\/[A-Za-z0-9]+/;
    if (event.body !== null) {
      const url = event.body;
      if (regex.test(url)) {
        const response = await axios.get(`https://cprojectapisjonellv2.adaptable.app/api/capcut?url=${encodeURIComponent(url)}`);
        if (response.data && response.data.result && response.data.result.video_ori) {
          const videoUrl = response.data.result.video_ori;
          const title = response.data.result.title;
          const description = response.data.result.description;
          const videoResponse = await axios.get(videoUrl, { responseType: "stream" });
          const filePath = path.join(downloadDirectory, `${Date.now()}.mp4`);
          const fileStream = fs.createWriteStream(filePath);
          videoResponse.data.pipe(fileStream);
          fileStream.on('finish', () => {
            const fileSize = fs.statSync(filePath).size / (1024 * 1024); // in MB
            if (fileSize > 25) {
              api.sendMessage("The file is too large, cannot be sent", event.threadID, () => fs.unlinkSync(filePath), event.messageID);
            } else {
              const messageBody = `𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 CapCut\n\nTitle: ${title}\nDescription: ${description}\n`;
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
    console.error(err);
  }
};
