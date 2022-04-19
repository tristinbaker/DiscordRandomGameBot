const Puppeteer = require('puppeteer');

class Scraper {
	constructor() { }

	async getGameList() {
		try {
			let browser = await Puppeteer.launch();
			let page = await browser.newPage();
			await page.goto(this.url);
			page.waitForSelector('.gameListRowItemName');
			var games = await page.evaluate(() => {
		    let data = [];
		    let gameList = document.getElementsByClassName('gameListRowItemName');
		    for (var game of gameList)
		        data.push(game.textContent);
		    return data;
			});
			await browser.close();
		} catch (error) {
			console.error(error);
		} finally {
			return games;
		}
	}

	set url(url) {
		this._url = url
	}

	get url() {
		return this._url
	}

}

module.exports = Scraper