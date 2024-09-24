module.exports.config = {
  name: 'help',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: [],
  description: "Beginner's guide",
  usage: "Help [page] or [command]",
  credits: 'Develeoper',
};

module.exports.run = async function ({
  api,
  event,
  enableCommands,
  args,
  Utils,
  prefix
}) {
  const input = args.join(' ');
  try {
    const eventCommands = enableCommands[1].handleEvent;
    const commands = enableCommands[0].commands;
    if (!input) {
      const pages = 20;
      let page = 1;
      let start = (page - 1) * pages;
      let end = start + pages;
      let helpMessage = `\n『 𝙴𝚌𝚑𝚘𝙱𝚘𝚝  』\n『 𝙲𝚛𝚎𝚊𝚝𝚘𝚛 : 𝙺𝚒𝚏𝚏 𝙷𝚢𝚊𝚌𝚒𝚗𝚝𝚑 𝙿𝚘𝚗 』\n『 𝚅𝚎𝚛𝚜𝚒𝚘𝚗 : 1.0.0 』\n『 𝙿𝚛𝚎𝚏𝚒𝚡 : ${prefix} 』\n『 𝚃𝚘𝚝𝚊𝚕 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜 : ${commands.length} 』
﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏\n\n𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧\n\n`;
      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `${i + 1}. ${commands[i]}\n`;
      }
      helpMessage += '\n𝗘𝗩𝗘𝗡𝗧 𝗟𝗜𝗦𝗧\n\n';
      eventCommands.forEach((eventCommand, index) => {
      helpMessage += `${index + 1}. ${eventCommand}\t\n`;
      });
      helpMessage += `\n𝐂𝐦𝐝 𝐏𝐚𝐠𝐞: 『${page}/${Math.ceil(commands.length / pages)}』\nTo view information about a specific command, type ${prefix}help command name and type ${prefix}help 2 to see the other commands.\n`;
      api.sendMessage(helpMessage,  event.threadID, event.messageID);
    } else if (!isNaN(input)) {
      const page = parseInt(input);
      const pages = 20;
      let start = (page - 2) * pages;
      let end = start + pages;
      let helpMessage = `𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧:\n\n`;
      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `\t${i + 1}. ${commands[i]} \n`;
      }
      helpMessage += '\n𝗘𝗩𝗘𝗡𝗧 𝗟𝗜𝗦𝗧:\n\n';
      eventCommands.forEach((eventCommand, index) => {
        helpMessage += `\t${index + 1}. ${eventCommand}\n`;
      });
      helpMessage += `\nPage ${page} of ${Math.ceil(commands.length / pages)}`;
      api.sendMessage(helpMessage,  event.threadID, event.messageID);
    } else {
      const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(input?.toLowerCase()))?.[1];
      if (command) {
        const {
          name,
          version,
          role,
          aliases = [],
          description,
          usage,
          credits,
          cooldown,
          hasPrefix
        } = command;
const roleMessage = role !== undefined ? (role === 0 ? '0 (All users)' : (role === 1 ? '1 (Admin)' : (role === 2 ? '2 (Thread Admin)' : (role === 3 ? '3 (Super Admin)' : '')))) : 'Unknown';
const aliasesMessage = aliases.length ? `Do not have` : '';
const descriptionMessage = description ? `Description: ${description}` : 'Description: No description';
const usageMessage = usage ? usage : 'No guide available.';
const creditsMessage = credits ? `Author: ${credits}` : 'Author: Unknown';
const versionMessage = version ? `Version: ${version}` : 'Version: Unknown';
const cooldownMessage = cooldown ? `${cooldown}` : 'Unknown';

const message = `╭── NAME ────❖\n│ ${name}\n├── INFO\n│ ${descriptionMessage}\n│ Other names: ${aliasesMessage}\n│ ${versionMessage}\n│ Role: ${roleMessage}\n│ Time per command: ${cooldownMessage}s\n│ ${creditsMessage}\n├── Usage\n│ ${usageMessage}\n├── Notes\n│ The content inside <XXXXX> can be changed\n│ The content inside [a|b|c] is a or b or c\n╰──────❖`;
        api.sendMessage(message,  event.threadID, event.messageID);
      } else {
        api.sendMessage('Command not found.', event.threadID, event.messageID);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
