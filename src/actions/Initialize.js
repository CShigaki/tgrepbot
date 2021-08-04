import Chat from '../models/Chat';

export const handleInitialize = async (bot, msg) => {
  if (!isConversationEligibleForInitialization(msg)) {
    bot.sendMessage(msg.chat.id, 'I can only be initialized inside groups.')

    return;
  }

  if (!isUserEligibleForInitialization(bot, msg)) {
    bot.sendMessage(msg.chat.id, 'I can only be initialized by an admin.');

    return;
  }

  var persistedChat = await Chat.findById(msg.chat.id);
  if (persistedChat) {
    bot.sendMessage(msg.chat.id, 'Someone already initialized me here. There\'s no need to do it again.')

    return;
  }

  const members = [{
    userId: msg.from.id,
    reputation: 0,
    ouro: 0,
    prata: 0,
    bronze: 0,
  }];

  persistedChat = {
    id: msg.chat.id,
    members,
  }

  Chat.save(Chat(persistedChat));
  bot.sendMessage(msg.chat.id, "Initialized. You may now use any of my commands.");
}

export const isChatInitialized = async (msg) => {
  const foundChat = await Chat.findById(msg.chat.id);
  return foundChat ? true : false;
}

const isUserEligibleForInitialization = async (bot, msg) => {
  const userWhoRequestedInitialization = await bot.getChatMember(msg.chat.id, msg.from.id);

  return userWhoRequestedInitialization.status !== 'creator' ||
    userWhoRequestedInitialization.status !== 'administrator';
}

const isConversationEligibleForInitialization = (msg) => {
  return msg.chat.type !== 'private';
}
