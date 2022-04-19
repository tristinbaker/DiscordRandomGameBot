const Scraper = require('./scraper.js');

class Game {
	constructor() {

		this.urls = { 
			'6908' => "STEAM PROFILE LINK GOES HERE", 
			'6722' => "STEAM PROFILE LINK GOES HERE",
			'0451' => "STEAM PROFILE LINK GOES HERE",
			'9620' => "STEAM PROFILE LINK GOES HERE",
			'6285' => "STEAM PROFILE LINK GOES HERE",
			'7572' => "STEAM PROFILE LINK GOES HERE",
			'9981' => "STEAM PROFILE LINK GOES HERE",
			'1023' => "STEAM PROFILE LINK GOES HERE"
		}
	}

	async getRandomGame(user) {
		if (!(user in this.urls)) {
			return null;
		}
		let scraper = new Scraper();
		scraper.url = this.urls[user];
		let games = await scraper.getGameList();
		let game = games[Math.floor(Math.random()*games.length)];
		return game;
	}
}

module.exports = Game