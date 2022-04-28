const { MessageEmbed, Client, Intents } = require('discord.js');
const Game = require('./game.js');
const HLTB = require('./hltb.js');
const ITAD = require('./itad.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const game = new Game();
const hltb = new HLTB();
const itad = new ITAD();

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
  }
});
