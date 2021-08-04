export const hasAdminPermission = async (bot, chatId, userId) => {
  const requester = await bot.getChatMember(chatId, userId);

  return requester.status === 'creator' ||
    requester.status === 'administrator';
}