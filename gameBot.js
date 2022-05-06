const { MessageEmbed, Client, Intents } = require('discord.js');
const Game = require('./game.js');
const HLTB = require('./hltb.js');
const ITAD = require('./itad.js');
const GIB = require('./gamesIBeat.js');
const Utils = require('./utils.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const game = new Game();
const hltb = new HLTB();
const itad = new ITAD();
const gib = new GIB();
const utils = new Utils();

client.login(BOT_TOKEN_HERE);

client.once('ready', () => {
  console.log('Bot ready!');
});

client.on("messageCreate", (message) => {
  if (message.content.startsWith(";;game")) {
    let user = message.member.user.discriminator;
    let user_name = message.member.nickname === null ? message.author.username : message.member.nickname;
    let otherUser = message.content.slice(";;game".length).trim();
    if (otherUser) {
      otherUser = otherUser.slice(2).slice(0, -1);
      message.guild.members.fetch(otherUser)
        .then((otherUser) => {
          otherUser_name = otherUser.nickname === null ? otherUser.user.username : otherUser.nickname;
          message.channel.send(`Retrieving Game for ${otherUser_name}...`)
            .then((msg) => {
              game.getRandomGame(otherUser.user.discriminator).then((user_game) => {
                msg.edit(`${otherUser_name}, you should play ${user_game}.`);
              });
            });
        });
    } else {
      message.channel.send("Retrieving Game...")
        .then((msg) => {
          game.getRandomGame(user).then((user_game) => {
            msg.edit(`${user_name}, you should play ${user_game}.`);
          });
        });
    }

  } else if (message.content.startsWith(';;hltb')) {
    const game = message.content.slice(";;hltb".length).trim();
    message.channel.send("Retrieving Game Info...")
      .then((msg) => {
        hltb.search(game).then((gameEmbed) => {
          msg.delete();
          message.channel.send({ embeds: [gameEmbed] });
        });
      });
  } else if (message.content.startsWith(';;itad')) {
    const game = message.content.slice(";;itad".length).trim();
    message.channel.send("Retrieving deals...")
      .then((msg) => {
        itad.search(game).then((gameEmbed) => {
          msg.delete();
          message.channel.send({ embeds: [gameEmbed] });
        });
      });
  } else if (message.content.startsWith(';;gib')) {
    let year;
    const request = message.content.slice(";;gib".length).trim().split(' ');
    const isNum = utils.isNum(request[0]); // Likely year if true
    if (isNum) {
      year = request[0];
    }
    let user = message.member.user.id;
    let user_name = message.member.nickname === null ? message.author.username : message.member.nickname;
    if (year) { // Year passed in
      message.channel.send(`Retrieving game list for ${user_name}...`)
        .then((msg) => {
          gib.getUserList(user, user_name, request)
            .then((gameEmbed) => {
              msg.delete();
              message.channel.send({ embeds: [gameEmbed] });
            });
        });
    } else if (request[0].toLowerCase() == 'lb') { // leaderboard option selected
      year = request[1];
      message.channel.send(`Retrieving leaderboard...`)
        .then((msg) => {
          if (year) {
            gib.printLeaderboard(message, year)
              .then((gameEmbed) => {
                msg.delete();
                message.channel.send({ embeds: [gameEmbed] });
              });
          } else {
            gib.printLeaderboard(message)
              .then((gameEmbed) => {
                msg.delete();
                message.channel.send({ embeds: [gameEmbed] });
              });
          }
        });
    } else if (request[0].toLowerCase() == 'add') {
      let new_game = request.slice(1, request.length).join(' ');
      message.channel.send(`Adding game...`)
        .then((msg) => {
          gib.addToList(user, new_game)
            .then(() => {
              msg.edit(`${new_game} Added!`);
            });
        });
    } else if (request[0].toLowerCase() == 'help') {
      gib.getHelpMessage()
        .then((gameEmbed) => {
          message.channel.send({ embeds: [gameEmbed] });
        });
    } else {
      message.channel.send(`Retrieving game list for ${user_name}...`)
        .then((msg) => {
          gib.getUserList(user, user_name)
            .then((gameEmbed) => {
              msg.delete();
              message.channel.send({ embeds: [gameEmbed] });
            });
        });
    }
  }
});