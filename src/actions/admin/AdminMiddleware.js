import ban from './Ban';
import kick from './Kick';
import { hasAdminPermission } from '../../utils/PermissionChecker';

const replyNeededCommands = [
  '!ban',
  '!kick',
];

const allCommands = [
  ...replyNeededCommands
];

export const handleAdminCommand = async (bot, msg) => {
  if (msg.chat.type == 'private') {
    bot.sendMessage(msg.chat.id, "Admin commands can only be used inside groups.");
    return;
  }

  const isAdmin = await hasAdminPermission(bot, msg.chat.id, msg.from.id);
  if (!isAdmin) {
    bot.sendMessage(msg.chat.id, "You're not an admin.");
    return;
  }

  if (-1 === allCommands.indexOf(msg.text)) {
    bot.sendMessage(msg.chat.id, "Unrecognized admin command.");
    return;
  }

  if (-1 !== replyNeededCommands.indexOf(msg.text) && !msg.reply_to_message) {
    bot.sendMessage(msg.chat.id, `The command ${msg.text} only works when replying to a message.`);
    return;
  }

  switch (msg.text.toLowerCase()) {
    case '!ban':
      ban(bot, msg.reply_to_message);
      return;
    case '!kick':
      kick(bot, msg.reply_to_message);
      return;
  };
}
