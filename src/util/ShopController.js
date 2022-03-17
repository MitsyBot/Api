const CronJob = require('cron').CronJob;
const { prisma } = require('../database/prisma');
const moment = require('moment');
// const { MessageEmbed } = require('discord.js');

module.exports = class ShopController {

	constructor() {
		this.backgrounds = [];
		this.initialized = false;
	}

	getBackgrounds() {
		const back = this.backgrounds;

		return back;
	}

	async init() {
		const dbBackgrounds = await prisma.Background.findMany();

		moment.locale('pt-br');
		const data = moment().format('L');
		console.log(data);
		const previous = await prisma.DailyShops.findUnique({ where: { data } });
		console.log(previous);

		if (previous) {
			this.backgrounds = previous.items;
		}
		else {
			this.backgrounds = random(dbBackgrounds, 8);

			await prisma.DailyShops.create({
				data: {
					day: data,
					items: this.backgrounds,
				},
			});


		}


		const job = new CronJob('0 */24 * * *', async () => {

			this.backgrounds = random(dbBackgrounds, 8);
			await prisma.DailyShops.create({
				data: {
					day: data,
					items: this.backgrounds,
				},
			});

		}, null, true, 'America/Sao_Paulo');

		job.start();
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new ShopController();
		}

		return this.instance;
	}
};

function random(arr, count) {
	const len = arr.length;
	const lookup = {};
	const tmp = [];

	if (count > len) count = len;

	for (let i = 0; i < count; i++) {
		let index;
		do {
			index = ~~(Math.random() * len);
		} while (index in lookup);
		lookup[index] = null;
		tmp.push(arr[index]);
	}

	return tmp;
}