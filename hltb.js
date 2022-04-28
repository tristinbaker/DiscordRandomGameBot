const hltb = require('howlongtobeat');
const { MessageEmbed } = require('discord.js');

class HowLongToBeat { 
	constructor() {
		this.service = new hltb.HowLongToBeatService();
	}

	async search(game) {
		let result = await this.service.search(game);
		let output = this.formatOutput(result[0]);
		return output;
	}

	async formatOutput(game_info) {
        const gameEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(game_info['name'])
        .setURL(`https://howlongtobeat.com/game?id=${game_info['id']}`)
        .setDescription(game_info['description'])
        .setThumbnail(`https://howlongtobeat.com${game_info['imageUrl']}`)
        .addFields(
          { name: 'Main Story', value: game_info['gameplayMain'].toString(), inline: true },
          { name: 'Main Story + Extras', value: game_info['gameplayMainExtra'].toString(), inline: true },
          { name: 'Completionist', value: game_info['gameplayCompletionist'].toString(), inline: true},
          )
        .setTimestamp();
		return gameEmbed;
	}
}

module.exports = HowLongToBeat