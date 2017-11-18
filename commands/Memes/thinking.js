// =====================================================================================
//                              ! thinking command
// =====================================================================================
// Sends a random thinking gif

const fs = require('fs');

exports.run = (bot, message, args) => {
    let memes = JSON.parse(fs.readFileSync('./config/memes.json', 'utf8'));
    message.channel.send(`${memes.thinking.files[Math.floor(Math.random() * memes.thinking.files.length)]}`);
}

exports.conf = {
    enabled: true,
    visible: true,
    guildOnly: false,
    textChannelOnly: false,
    aliases: ['🤔'],
    permLevel: 0
};

exports.help = {
    name: 'thinking',
    description: `Sends a random 🤔 gif`,
    usage: 'thinking'
};