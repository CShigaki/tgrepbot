import { hasAdminPermission } from '../../utils/PermissionChecker';

export default async (bot, repliedToMessage) => {
  const isAdmin = await hasAdminPermission(bot, repliedToMessage.chat.id, repliedToMessage.from.id);
  if (isAdmin) {
    bot.sendMessage(repliedToMessage.chat.id, "I can't ban another admin.");
    return;
  }

  bot.kickChatMember(repliedToMessage.chat.id, repliedToMessage.from.id);
  bot.unbanChatMember(repliedToMessage.chat.id, repliedToMessage.from.id);
  bot.sendMessage(repliedToMessage.chat.id, `User ${repliedToMessage.from.first_name} kicked.`);
}
