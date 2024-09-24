const fs = require("fs-extra");
const path = require("path");
const configPath = path.join(__dirname, '../data/config.json');

const adminOfConfig = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : createConfig();

function createConfig() {
  const config = [{
    masterKey: {
      admin: ["100053549552408"],
      botName: [],
      adminName: [],
      devMode: false,
      database: false,
      restartTime: 999999999
    },
    adminOnly: {
      enable: false,
      ignoreCommand: []
    },
    hideNotiMessage: {
      wrongCommand: false,
      adminOnly: false,
      threadBanned: false,
      userBanned: false
    },
    logEvents: {
      disableAll: false,
      message: true,
      message_reaction: true,
      message_unsend: true,
      message_reply: true,
      event: true,
      read_receipt: false,
      typ: false,
      presence: false
    },
    fcaOption: {
      forceLogin: true,
      listenEvents: true,
      logLevel: "silent",
      updatePresence: true,
      selfListen: false,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      online: true,
      autoMarkDelivery: false,
      autoMarkRead: true
    }
  }];

  fs.ensureFileSync(configPath);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  return config;
}

module.exports.config = {
  name: "adminonly",
  aliases: ["adonly", "onlyad", "onlyadmin"],
  version: "1.5",
  credits: "Cliff",
  cooldown: 5,
  role: 2,
  hasPrefix: false,
  description: "Turn on/off only admin can use bot",
  commandCategory: "owner",
  usages: "{pn} [on | off]: turn on/off the mode only admin can use bot" +
          "\n{pn} noti [on | off]: turn on/off the notification when a non-admin user tries to use the bot"
};

module.exports["run"] = function ({ args, api, event, admin }) {
  if (!admin.includes(event.senderID))
   return api.sendMessage("This Command is only for AUTOBOT owner.", event.threadID, event.messageID); 
  let isSetNoti = false;
  let value;
  let indexGetVal = 0;

  if (args[0] === "noti") {
    isSetNoti = true;
    indexGetVal = 1;
  }

  if (args[indexGetVal] === "on") {
    value = true;
  } else if (args[indexGetVal] === "off") {
    value = false;
  } else {
    return api.sendMessage("Syntax error. Usage: " + module.exports.config.usages, event.threadID, event.messageID);
  }

  if (isSetNoti) {
    adminOfConfig[0].hideNotiMessage.adminOnly = value;
    api.sendMessage(value ? "Turned on the notification when a non-admin user tries to use the bot" : "Turned off the notification when a non-admin user tries to use the bot", event.threadID, event.messageID);
  } else {
    adminOfConfig[0].adminOnly.enable = value;
    api.sendMessage(value ? "Turned on the mode where only admins can use the bot" : "Turned off the mode where only admins can use the bot", event.threadID, event.messageID);
  }

  fs.writeFileSync(configPath, JSON.stringify(adminOfConfig, null, 2));
};