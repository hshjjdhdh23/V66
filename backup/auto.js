module.exports.config = {
  name: "autoacceptfriend",
  version: "1.0.0",
  role: 2,
  hasPrefix: false,
  credits: "Cliff",
  description: "Automatically accept friend requests",
  commandCategory: "system",
  usages: "[on/off]",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const { writeFileSync, existsSync, readFileSync } = require("fs-extra");
  const pathData = __dirname + "../cache/autoAcceptFriend.json";
  let data = {};
  const cron = require("node-cron");

  if (existsSync(pathData)) {
    data = JSON.parse(readFileSync(pathData));
  }

  switch (args[0]) {
    case "on": {
      data[senderID] = true;
      writeFileSync(pathData, JSON.stringify(data, null, 4));
      cron.schedule('*/5 * * * *', async () => {
        if (!data[senderID]) return;
        const listRequests = await api.getFriendRequests();
        for (const request of listRequests) {
          await api.handleFriendRequest(request.userID, true);
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
      });
      return api.sendMessage("Enabled auto accept friend request.", threadID, messageID);
    }
    case "off": {
      delete data[senderID];
      writeFileSync(pathData, JSON.stringify(data, null, 4));
      return api.sendMessage("Disabled auto accept friend request.", threadID, messageID);
    }
    default: {
      return api.sendMessage("Invalid argument. Use 'on' or 'off'.", threadID, messageID);
    }
  }
};
