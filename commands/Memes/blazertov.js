// =====================================================================================
//                               ! blazertov command
// =====================================================================================

exports.run = (bot, message, args) => {
    message.channel.send(`Witness the beginning! <:blazertov:306263138980855808>\nhttps://www.twitch.tv/videos/137947484 `);
}

exports.conf = {
    enabled: true,
    visible: true,
    guildOnly: true,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: 'blazertov',
    description: 'Witness the rich history of "Blazertov"',
    usage: '!blazertov'
};