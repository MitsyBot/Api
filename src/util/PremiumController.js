const CronJob = require('cron').CronJob;
const { prisma } = require('../database/prisma');
const { makeRequest, generateRandomId } = require('../util/WebSocket');

// const { MessageEmbed } = require('discord.js');


module.exports = class PremiumController {

	constructor() {
		this.backgrounds = [];
		this.initialized = false;
	}

	async init() {
		// Remove premium from users when expired
		const job = new CronJob('0 0 * * *', async () => {
			const users = await prisma.UserDonations.findMany({
				where: {
					expired: false,
				},
				include: {
					key: true,
				},
			});

			for (const user of users) {
				if (Date.now() > user.expire_at) {
					await prisma.DonationKeys.deleteMany({
						where: {
							user: user.id,
						},
					});

					await prisma.UserDonations.delete({
						where: {
							id: user.id,
						},
					});

					const guild = await makeRequest('mitsy',
						{
							id: generateRandomId(),
							type: 'getresolvedguildname',
							data: body,
						});

					let message;

					if (user.key) message = `Olá, ${user.name}!\n\n Só passando pra te avisar que o seu premium acabou!\n\nPor este motivo a sua key premium que você usou no servidor \`\`${guild.data.name}\`\` foi removida.\nCaso você queira renovar o premium acesse https://mitsy.xyz/premium.`;
					else message = `Olá, ${user.name}!\n\n Só passando pra te avisar que o seu premium acabou!\nCaso você queira renovar o premium acesse https://mitsy.xyz/premium.`;

					const body = {
						userid: user.id,
						message,
					};

					await makeRequest('mitsy',
						{
							id: generateRandomId(),
							type: 'message',
							data: body,
						});
				}
			}
		}, null, true, 'America/Sao_Paulo');
		job.start();
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new PremiumController();
		}

		return this.instance;
	}
};