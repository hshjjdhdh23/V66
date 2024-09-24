module.exports.config = {
  name: "prefix",
  version: "1.0.1",
  role: 0,
  credits: "cliff",
  description: "Display the prefix of your bot",
  hasPrefix: false,
  usages: "prefix",
  cooldown: 5,
  aliases: ["prefix", "Prefix", "PREFIX", "prefi"],
};

module.exports.run = async function ({ api, event, prefix, admin }) {
  const userid = await api.getCurrentUserID();
  const bodyText = `Yo, my prefix is [ 𓆩 ${prefix} 𓆪 ]`;
  api.shareContact(bodyText, userid, event.threadID);
};
