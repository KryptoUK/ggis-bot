// =====================================================================================
//                                 ! bananabat command
// =====================================================================================
// Bananananananananananananananananananananananananananananananananananananananana bat

const moment = require('moment');
const chalk = require('chalk');
const settings = require('../../settings');

exports.run = (bot, message, args) => {
    try {
        message.channel.send(`🍌🦇 http://i.imgur.com/ym5ek1y.gifv 🍌🦇`);
        console.log(`[${moment().format(settings.timeFormat)}] User ${message.author.username} used 🍌🦇`);
    } catch (err) {
        console.log(chalk.bgRed(`[${moment().format(settings.timeFormat)}] ${err}`));
    }
};

exports.conf = {
    enabled: true,
    visible: true,
    guildOnly: true,
    textChannelOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: 'bananabat',
    description: `Bananananananananana bat`,
    usage: 'bananabat'
};