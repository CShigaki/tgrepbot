import Chat from '../models/Chat';

export default async (bot, msg) => {
  const foundChat = await Chat.findById(msg.chat.id);
  const indexOfRequester = await Chat.findMemberIndex(msg.chat.id, parseInt(msg.from.id));

  var message = `I've got the following info about you:\n\n`
  message += `Reputation: ${foundChat.members[indexOfRequester].reputation}\n`;
  message += `Gold: --not implemented yet--\n`;
  message += `Silver: --not implemented yet--\n`;
  message += `Copper: --not implemented yet--\n`;

  bot.sendMessage(msg.chat.id, message);
};
