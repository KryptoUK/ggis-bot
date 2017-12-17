// =====================================================================================
//                                  ! ping command
// =====================================================================================
// Returns "Pong!" message with a millisecond response time
// Useful for testing response of bot

const moment = require('moment');
const settings = require('../../settings');

exports.run = (bot, message) => {
  const ping = Math.round(bot.ping);
  message.reply(`Pong! \`${ping} ms\``);
  console.log(`[${moment().format(settings.timeFormat)}] Ping! Pong! ${ping} ms`);
};

exports.conf = {
  enabled: true,
  visible: true,
  guildOnly: false,
  textChannelOnly: false,
  aliases: [],
  permLevel: 0,
};

exports.help = {
  name: 'ping',
  description: 'Pong! Returns the bot\'s response time',
  usage: 'ping',
};
