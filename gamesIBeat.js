const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { ConsoleMessage } = require('puppeteer');

class GamesIBeat {
  constructor() {
    var self = this;
    fs.readFile('gamesList.json', 'utf8', function (err, data) {
      if (err) throw err;
      self.setGamesList(data);
    });
  }

  async addToList(user, game, year = null) {
    let data;
    if (!year) {
      year = new Date().getFullYear();
    }
    if (!this.gamesList.some(x => x[user])) {
      let newData = {};
      newData[user][year] = [game];
      this.gamesList.push(newData);
    } else {
      data = await this.getGamesById(user, year);
      data.push(game);
      await this.appendGamesList(data, user, year);
    }
    return true;
  }

  async appendGamesList(gamesList, user, year) {
    for(let i = 0; i < this.gamesList.length; i++) {
      if(this.gamesList[i] && this.gamesList[i].hasOwnProperty(user)) {
        this.gamesList[i][user][year] = gamesList;
      };
    }
    fs.writeFile('gamesList.json', JSON.stringify(this.gamesList), (err) => {
      if (err) throw err;
      console.log('gamesList.json written');
    })
  }

  async getUserList(user, user_name, year = null) {
    let message;
    let data;
    let count;
    if (!year) {
      year = new Date().getFullYear();
    }
    if (!this.gamesList.some(x => x[user])) {
      message = this.rescueMessage(year);
    } else {
      data = await this.getGamesById(user, year);
      if (!data) {
        message = this.rescueMessage(year);
      } else {
        count = data.length;
        message = this.formatUserListOutput(data, `${user_name} ${year} Games (${count} Total)`,);
      }
    }
    return message;
  }

  async getGamesById(user, year) {
    for(let i = 0; i < this.gamesList.length; i++) {
      if(this.gamesList[i] && this.gamesList[i].hasOwnProperty(user)) {
        return this.gamesList[i][user][year];
      };
    }
  }

  async setGamesList(data) {
    this.gamesList = JSON.parse(data);
  }

  async printLeaderboard(message, year = null,) {
    if (!year) {
      year = new Date().getFullYear();
    }
    await this.getLeaderboard(message, year)
      .then((output) => {
        this.leaderboard.sort(function(a,b) {
          return b[1] - a[1];
        });
        for(let i in this.leaderboard) {
          this.leaderboardText += `${parseInt(i) + 1}) ${this.leaderboard[i][0]} - ${this.leaderboard[i][1]} Games\n`;
        } 
      });
    let gameEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`${year} Leaderboard`)
      .setDescription(this.leaderboardText)
      .setTimestamp();
    return gameEmbed;
  }

  async getLeaderboard(message, year) {
    this.leaderboard = [];
    this.leaderboardText = "";
    for(let i in this.gamesList) {
      let val = this.gamesList[i]; 
      for(let j in val) {
        let sub_val = val[j];
        try {
          let count = sub_val[year].length;
          message.guild.members.fetch(j)
            .then((user) => {
              let user_name = user.nickname === null ? user.user.username : user.nickname
              this.leaderboard.push([user_name, count]);
            });
        } catch {
          continue;
        }
      }
    }
  }

  async formatUserListOutput(data, title) {
    let description = "";
    for(let i = 0; i < data.length; i++) {
      description += `${i + 1}) ${data[i]}\n`
    }
    let gameEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(title)
      .setDescription(description)
      .setTimestamp();
    return gameEmbed;
  }

  async rescueMessage(year) {
    const gameEmbed = new MessageEmbed()
      .setColor('#a6251c')
      .setTitle(`No Games Found for ${year}!`)
      .setTimestamp();
    return gameEmbed;
  }

  async getHelpMessage() {
    let gameEmbed = new MessageEmbed()
      .setColor('#25c26b')
      .setTitle(`GamesIBeat Command Help`)
      .addFields (
        { name: 'Retrieve Current Year Games', value: ';;gib (optionally add year here; default: current year)', inline: false },
        { name: 'Add Game to List', value: ';;gib add {game_name}', inline: false },
        { name: 'Leaderboard', value: ';;gib lb (optionally add year here; default: current year)', inline: false }
      )
      .setTimestamp();
    return gameEmbed;
  }

}

module.exports = GamesIBeat