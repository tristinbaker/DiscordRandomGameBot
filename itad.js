const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const ITAD_URL = 'https://api.isthereanydeal.com';
const KEY = API_KEY_GOES_HERE;

class IsThatADeal {
  constructor() {
  }

  async search(game) {
    let prices;
    let gameId = await this.get_gameId(game);
    try {
      prices = await axios.get(`${ITAD_URL}/v01/game/prices/`, {
        params: {
          key: KEY,
          plains: gameId,
          region: 'us',
          country: 'US',
          shops: 'steam,gamersgate,gamesplanet,greenmangaming,gog,dotemu,amazonus,nuuvem,game2,allyouplay,battlenet,dlgamer,direct2drive,dreamgame,epic,bundlestars,fireflower,gamejolt,gamebillet,impulse,gamesplanetde,gamesplanetfr,gamesplanetus,gamesrepublic,humblestore,humblewidgets,indiegalastore,itchio,joybuggy,macgamestore,microsoft,newegg,noctre,origin,squenix,uplay,voidu,wingamestore'
        }
      });
    } catch (e) {
      return this.rescueNoGameFound();
    }
    const gameDeals = prices.data?.data?.[gameId].list;

    const bestDeal = await this.getMax(gameDeals, 'price_cut');

    console.log(bestDeal);

    const formattedOutput = await this.formatOutput(bestDeal, game);

    return formattedOutput;
  }

  async get_gameId(game) {
    const response = await axios.get(`${ITAD_URL}/v02/game/plain/`, {
      params: {
        key: KEY,
        title: game
      }
    });
    const gameId = response.data?.data?.plain;
    console.log(gameId);
    return gameId;
  }

  async getMax(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
      if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
        max = arr[i];
    }
    return max;
  }

  async formatOutput(deal, game) {
    console.debug(`deal: ${deal.price_old}`);
    let gameEmbed;
    if (parseInt(deal['price_cut']) == 0) {
      gameEmbed = new MessageEmbed()
        .setColor('#a6251c')
        .setTitle(game)
        .setURL(deal['url'])
        .addFields(
          { name: 'No discounted price found', value: deal['price_old'].toString(), inline: true }
        )
        .setTimestamp();
    } else {
      gameEmbed = new MessageEmbed()
        .setColor('#236905')
        .setTitle(game)
        .setURL(deal['url'])
        .addFields(
          { name: 'Original Price', value: deal['price_old'].toString(), inline: true },
          { name: 'Discounted Price', value: deal['price_new'].toString(), inline: true },
          { name: 'Percentage Off', value: deal['price_cut'].toString(), inline: true },
        )
        .setTimestamp();
    }
    return gameEmbed;
  }

  async rescueNoGameFound() {
    let gameEmbed;
    gameEmbed = new MessageEmbed()
      .setColor('#a6251c')
      .setTitle('No Game Found')
      .addFields(
        { name: 'You gotta be real specific with the game name', value: 'No seriously', inline: true }
      )
      .setTimestamp();
    return gameEmbed;
  }
}

module.exports = IsThatADeal