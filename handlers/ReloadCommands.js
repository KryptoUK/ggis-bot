const chalk = require('chalk');
const Discord = require('discord.js');
const fs = require('fs');

/* eslint-disable */

module.exports = (bot, command) => new Promise((resolve, reject) => {
  try {
    /**
     * Reload a single command
     */
    if (command) {
      if (!bot.commands.has(command) && !bot.aliases.has(command)) reject(new Error(`Command \`${command}\` not found.`));
      const cat = bot.commands.get(command).conf.category;
      delete require.cache[require.resolve(`../commands/${cat}/${command}`)];
      const cmd = require(`../commands/${cat}/${command}`);
      bot.commands.delete(command);
      bot.aliases.forEach((commandName, alias) => {
        if (commandName === command) bot.aliases.delete(alias);
      });
      bot.commands.set(command, cmd);
      bot.commands.get(command).conf.category = cat;
      cmd.conf.aliases.forEach((alias) => {
        bot.aliases.set(alias, cmd.help.name);
      });

      // Re-sort command list by keys
      var keys = [];
      var sorted = new Discord.Collection();
      bot.commands.forEach((value, key, map) => {
        keys.push(key);
      });
      keys.sort().map((key) => {
        sorted.set(key, bot.commands.get(key));
      });
      bot.commands = sorted;
      console.log(chalk.bgCyan.black(`Loading command ${cmd.help.name} ... ✓`));
      resolve();
    }
    /**
     * Reload ALL commands
     */
    else {
      bot.commands.forEach((command) => {
        fs.readFile(`./commands/${command.conf.category}/${command.help.name}.js`, (err, data) => {
          if (err && err.code === 'ENOENT') console.log(`Couldn't find file for ${command.help.name} in /${command.conf.category}/`);
          else if (err) throw err;
          else {
            if (typeof require.resolve(`../commands/${command.conf.category}/${command.help.name}`) !== 'undefined') {
              delete require.cache[require.resolve(`../commands/${command.conf.category}/${command.help.name}`)]
            }
          }
        });
      });
      bot.aliases.clear();
      bot.commands.clear();
      fs.readdir('./commands/', (err, folders) => {
        folders.forEach((folder) => {
          fs.readdir(`./commands/${folder}`, (err, files) => {
            if (err) throw err;
            console.log(chalk.bgBlue(`Loading a total of ${files.length} commands from /${folder}/`));
            files.forEach((f) => {
              const contents = require(`../commands/${folder}/${f}`);
              bot.commands.set(contents.help.name, contents);
              bot.commands.get(contents.help.name).conf.category = `${folder}`;
              contents.conf.aliases.forEach((alias) => {
                bot.aliases.set(alias, contents.help.name);
              });
              console.log(chalk.bgCyan.black(`Loading command ${contents.help.name} ... ✓`));
            });
          });
        });
      });
      resolve();
    }
  } catch (err) {
    reject(err);
  }
});
