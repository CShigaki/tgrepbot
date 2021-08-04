export default (bot, chatId) => {
  var message = 'Before using any of my commands an admin must initialize me with the command /initialize\n\n';
  message += 'Currently I have two functions implemented:\n';
  message += 'Admin commands\n';
  message += '!kick\n';
  message += '!ban\n\n';
  message += 'Reputation system\n';
  message += 'Reputation can be given and taken from other members by replying to media files they send with + or -\n';
  message += 'The reputation ranking of the group can be shown with the command /repranking';

  bot.sendMessage(chatId, message);
}