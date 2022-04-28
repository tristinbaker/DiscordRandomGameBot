const Scraper = require('./scraper.js');

class Game {
  constructor() {

    this.urls = {
      '6908': "https://steamcommunity.com/id/Suqei/games/?tab=all", 
      '6722': "https://steamcommunity.com/id/BigUglyMoron/games/?tab=all",
      '0451': "https://steamcommunity.com/profiles/76561198023087953/games/?tab=all",
      '9620': "https://steamcommunity.com/profiles/76561198199630925/games/?tab=all",
      '6285': "https://steamcommunity.com/profiles/76561198059761677/games/?tab=all",
      '7572': "https://steamcommunity.com/profiles/76561198285926012/games/?tab=all",
      '9981': "https://steamcommunity.com/profiles/76561198065955589/games/?tab=all",
      '1023': "https://steamcommunity.com/profiles/76561198138094446/games/?tab=all"
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