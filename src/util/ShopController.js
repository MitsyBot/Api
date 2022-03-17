const CronJob = require('cron').CronJob;
const { prisma } = require('../database/prisma');
const moment = require('moment');
// const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

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
		const previous = await prisma.DailyShops.findUnique({ where: { day: data } });

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

			await fetch(process.env.BACKGROUNDS_WEBHOOK, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: 'DailyShop',
					content: '<:Mitsy_omg:873019423886282812>, Uma nova loja diaria foi gerada por que aparentemente nenhuma existia!',
				}),
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

			await fetch(process.env.BACKGROUNDS_WEBHOOK, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: 'DailyShop',
					content: '<:Mitsy_omg:873019423886282812>, A loja diaria foi reiniciada!',
				}),
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