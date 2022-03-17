const DbSet = require('../../database/DbSet');
const DAILY_INTERVAL = 24 * 60 * 60 * 1000;
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class DailyController {

	static async getDailyInfos(req, res) {
		const user = await DbSet.getInstance().user.ensureUserInfos(req.user.id);
		res.status(200).json({
			canDaily: Boolean(Date.now() - user.cooldowns.last_daily > DAILY_INTERVAL),
			isPremium: false,
		});
	}

	static async postDaily(req, res) {
		const user = await DbSet.getInstance().user.ensureUserInfos(req.user.id);

		if (Date.now() - user.cooldowns.last_daily < DAILY_INTERVAL) {
			return res.status(200).json({
				canDaily: false,
			});
		}

		let premiumBoost = 1;
		let tax = 0.2;

		const premium = await DbSet.getInstance().premium.ensureUserPremium(req.user.id);

		if (premium) {
			premiumBoost = 0.5 + premium.tier;
			tax = 1;
		}

		let amount = (Math.floor(Math.random() * 2000) + 2000) * premiumBoost;
		const taxValue = Math.floor(amount * tax);

		if (!premium) {
			amount = amount - taxValue;
		}

		amount = Math.floor(amount);

		await DbSet.getInstance().user.addComets(req.user.id, Number(amount));
		await DbSet.getInstance().user.daily.create({
			data: {
				received_by: req.user.id,
				ip: req.clientIp,
				received_at: Date.now(),
				email: req.user.email,
				user_agent: req.get('User-Agent'),
			},
		});

		await DbSet.getInstance().user.cooldowns.update({
			where: {
				id: req.user.id,
			},
			data: {
				last_daily: Date.now(),
			},
		});

		const transaction = await DbSet.getInstance().transactions.create({
			data: {
				reason: 'DAILY',
				given_by: 'DAILY',
				received_by: req.user.id,
				quantity: amount,
				given_at: Date.now(),
			},
		});

		const embed = new MessageEmbed()
			.setTitle(`<:Mitsy_Rica:872870327049396274> **${amount} for DAILY**`)
			.addFields(
				{ name: '**💵 Quem recebeu**', value: `<@${req.user.id}>\n \`\`${req.user.username}#${req.user.discriminator}\`\`` },
			)
			.setFooter({ text: `Transação ${transaction.id}`, iconURL: 'https://cdn.discordapp.com/emojis/873019423827587132.webp' })
			.setColor('#F895FB')
			.setTimestamp();

		const request = {
			'username': 'StarTracker',
			'embeds': [embed],
		};
		await axios.post(process.env.STARTRACKER_WEBHOOK, request);

		res.status(200).json({
			received: amount,
			notPremiumReceive: amount + taxValue,
			isPremium: Boolean(premium),
		});
	}

};