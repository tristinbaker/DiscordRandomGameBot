const { Client, Intents } = require('discord.js');
const Game = require('./game.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const game = new Game();

client.login("DISCORD BOT TOKEN");

client.once('ready', () => {
	console.log('Bot ready!');
});

client.on("messageCreate", (message) => {
	if(message.content == ";;game"){
			let user = message.member.user.discriminator;
  		let user_name = message.member.nickname === null ? message.author.username : message.member.nickname;
			message.channel.send("Retrieving Game...")
			.then((msg) => {
				game.getRandomGame(user).then((user_game) => {
					msg.edit(`${user_name}, you should play ${user_game}.`);
				});
			});
		}
});