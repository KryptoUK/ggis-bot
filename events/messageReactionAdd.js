// Whenever an emoji reaction is added to a message

var lfg = require('ggis/LFGHandler');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');

module.exports = (messageReaction, user) => {

    if (user.bot) return; // Ignore the bot's reactions
    var settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));
    var bot = messageReaction.message.client;

    /**
     * LFG
     *  - ThumbsUp --> adds member to party, if possible
     *  - NoEntrySign --> cancels party, if possible
     */

    if (messageReaction.emoji.toString() === '👍') {
        if (bot.lfgStack.has(messageReaction.message.id)) {
            if (user.id !== bot.lfgStack.get(messageReaction.message.id).party_leader_id) {
                lfg.addToParty(bot, messageReaction.message.id, user.id);
            }
        }
    }
    else if (messageReaction.emoji.toString() === '🚫') {
        if (bot.lfgStack.has(messageReaction.message.id)) {
            if (user.id === bot.lfgStack.get(messageReaction.message.id).party_leader_id) {
                lfg.cancel(bot, messageReaction.message.id, false);
            }
        }
    }
};

module.exports.reloadHandler = function () {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`ggis/LFGHandler`)];
            lfg = require(`ggis/LFGHandler`);
            resolve();
        }
        catch (err) {
            reject(err);
        }
    });
};