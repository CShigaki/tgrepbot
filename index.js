import 'babel-polyfill';

import connectToDb from './src/utils/DbConnector';

import { handleInitialize, isChatInitialized } from './src/actions/Initialize';
import handleHelp from './src/actions/Help';
import handleMe from './src/actions/Me';
import { handleAdminCommand } from './src/actions/admin/AdminMiddleware';
import { isEligibleForReputation, giveReputation, removeReputation, repRanking } from './src/actions/Reputation';
import { hasAdminPermission } from './src/utils/PermissionChecker';

connectToDb();

const TelegramBot = require('node-telegram-bot-api');
const token = 'Token Bitch';

const bot = new TelegramBot(token, { polling: true });
var botId = '';

const setupBotInfo = async () => {
  const botInfo = await bot.getMe();
  botId = botInfo.id;
}

setupBotInfo();

bot.onText(/\/initialize/i, (msg) => {
  handleInitialize(bot, msg);
});

bot.onText(/\/help/i, (msg) => {
  handleHelp(bot, msg.chat.id);
});

bot.onText(/\/me/i, (msg) => {
  handleMe(bot, msg);
});

bot.onText(/\/repranking/i, async (msg) => {
  const isInitialized = await isChatInitialized(msg);
  if (warnIfCommandIsNotInitialized(msg, isInitialized)) {
    repRanking(bot, msg);
  }
});

bot.on('message', async (msg) => {
  if (msg.chat.type === 'private') {
    bot.sendMessage(msg.chat.id, "I can only be used inside groups.");
  }

  const isInitialized = await isChatInitialized(msg);

  if (!msg.text) {
    return;
  }

  if ('+' === msg.text.charAt(0) && msg.text.length === 1 && warnIfCommandIsNotInitialized(msg, isInitialized)) {
    if (isEligibleForReputation(msg)) {
      giveReputation(bot, msg);
      return;
    }
  }

  if ('-' === msg.text.charAt(0) && msg.text.length === 1 && warnIfCommandIsNotInitialized(msg, isInitialized)) {
    if (isEligibleForReputation(msg)) {
      removeReputation(bot, msg);
      return;
    }
  }

  if ('!' === msg.text.charAt(0) && warnIfCommandIsNotInitialized(msg, isInitialized)) {
    const isAdmin = await hasAdminPermission(bot, msg.chat.id, botId);
    if (!isAdmin) {
      bot.sendMessage(msg.chat.id, "To use admin commands you need to give me admin permissions.");
      return;
    }

    handleAdminCommand(bot, msg);
  }
});

const warnIfCommandIsNotInitialized = (msg, isInitialized) => {
  if (!isInitialized) {
    bot.sendMessage(msg.chat.id, 'An admin must initialize me before any commands can be used.');
    return false;
  }

  return true;
}