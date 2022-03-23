const CronJob = require('cron').CronJob;
const { prisma } = require('../database/prisma');
const moment = require('moment');
// const { MessageEmbed } = require('discord.js');
const axios = require('axios');


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
		const date = moment().format('L');
		console.log(date);
		const previous = await prisma.DailyShops.findUnique({ where: { day: date } });

		if (previous) {
			this.backgrounds = previous.items;
		}
		else {
			this.backgrounds = random(dbBackgrounds, 8);
			moment.locale('pt-br');
			await prisma.DailyShops.create({
				data: {
					day: date,
					items: this.backgrounds,
				},
			});

			const request = {
				'content' : '<:Mitsy_omg:873019423886282812>, A loja diária foi reiniciada!',
				'username': 'DailyShop',
			};
			await axios.post(process.env.BACKGROUNDS_WEBHOOK, request);


		}


		const job = new CronJob('0 */24 * * *', async () => {
			moment.locale('pt-br');
			const timeNow = moment().format('L');
			this.backgrounds = random(dbBackgrounds, 8);
			await prisma.DailyShops.create({
				data: {
					day: timeNow,
					items: this.backgrounds,
				},
			});


			const request = {
				'content' : '<:Mitsy_omg:873019423886282812>, A loja diária foi reiniciada!',
				'username': 'DailyShop',
			};
			await axios.post(process.env.BACKGROUNDS_WEBHOOK, request);


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