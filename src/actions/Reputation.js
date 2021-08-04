import Chat from '../models/Chat';

export const giveReputation = async (bot, msg) => {
  if (!msg.reply_to_message) {
    return bot.sendMessage(msg.chat.id, "You need to reply to a media file to give reputation.");
  }

  if (msg.reply_to_message.from.id === msg.from.id) {
    return bot.sendMessage(msg.chat.id, "You can't give reputation to yourself cunt.");
  }

  const foundChat = await Chat.findById(msg.chat.id);
  const indexOfRequester = await Chat.findMemberIndex(msg.chat.id, parseInt(msg.from.id));
  const indexOfTarget = await Chat.findMemberIndex(msg.chat.id, parseInt(msg.reply_to_message.from.id));

  if (null === indexOfRequester) {
    foundChat.members.push({
      userId: msg.from.id,
      reputation: 0,
      ouro: 0,
      prata: 0,
      bronze: 0,
    });
  }

  if (null === indexOfTarget) {
    foundChat.members.push({
      userId: msg.reply_to_message.from.id,
      reputation: 1,
      ouro: 0,
      prata: 0,
      bronze: 0,
    });
  } else {
    foundChat.members[indexOfTarget].reputation++;
  }
  Chat.save(Chat(foundChat));

  console.log(foundChat);

  const foundRequester = foundChat.members.filter((member) => {
    return member.userId === msg.from.id;
  })[0];
  const foundTarget = foundChat.members.filter((member) => {
    return member.userId === msg.reply_to_message.from.id;
  })[0];

  bot.sendMessage(msg.chat.id, `${msg.from.first_name} (${foundRequester.reputation}) increased ${msg.reply_to_message.from.first_name} reputation to (${foundTarget.reputation})`);
}

export const removeReputation = async (bot, msg) => {
  if (!msg.reply_to_message) {
    return bot.sendMessage(msg.chat.id, "You need to reply to a media file to give reputation.");
  }

  if (msg.reply_to_message.from.id === msg.from.id) {
    return bot.sendMessage(msg.chat.id, "You can't give reputation to yourself cunt.");
  }

  const foundChat = await Chat.findById(msg.chat.id);
  const indexOfRequester = await Chat.findMemberIndex(msg.chat.id, parseInt(msg.from.id));
  const indexOfTarget = await Chat.findMemberIndex(msg.chat.id, parseInt(msg.reply_to_message.from.id));

  if (null === indexOfRequester) {
    foundChat.members.push({
      userId: msg.from.id,
      reputation: 0,
      ouro: 0,
      prata: 0,
      bronze: 0,
    });
  }

  if (null === indexOfTarget) {
    foundChat.members.push({
      userId: msg.reply_to_message.from.id,
      reputation: -1,
      ouro: 0,
      prata: 0,
      bronze: 0,
    });
  } else {
    foundChat.members[indexOfTarget].reputation--;
  }
  Chat.save(Chat(foundChat));

  const foundRequester = foundChat.members.filter((member) => {
    return member.userId === msg.from.id;
  })[0];
  const foundTarget = foundChat.members.filter((member) => {
    return member.userId === msg.reply_to_message.from.id;
  })[0];

  bot.sendMessage(msg.chat.id, `${msg.from.first_name} (${foundRequester.reputation}) decreased ${msg.reply_to_message.from.first_name} reputation to (${foundTarget.reputation})`);
}

export const repRanking = async (bot, msg) => {
  bot.sendMessage(msg.chat.id, "Sorry this is still a work in progress.");
  // const foundChat = await Chat.getReputationRanking(msg.chat.id);
}

export const isEligibleForReputation = (msg) => {
  return msg.reply_to_message ? true : false;
}

