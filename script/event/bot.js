module.exports.config = {
  name: "bot",
  version: "1.0.0"
};

module.exports.handleEvent = async ({ event, api }) => {
  if (event.type === 'message' && event.body) {
    const message = event.body.toLowerCase();
    if (message.includes('thank you')) {
      api.sendMessage('You’re welcome! If you need anything else, just let me know.', event.threadID);
    } else if (message.includes('hello')) {
      api.sendMessage('Hi! How can I help you today?', event.threadID);
    }
  }
};
