module.exports = class Activities {

	static getDefaultActivities() {
		return [
			{
				name: '❤️ | Continue sendo incrivel',
				type: 'PLAYING',
			},
			{
				name: '❓ | Precisando de ajuda? acesse o meu faq ou abra um ticket https://mitsy.xyz/faq',
				type: 'WATCHING',
			},
			{
				name: '🥺 | Me ajude a ficar online https://mitsy.xyz/premium',
				type: 'PLAYING',
			},
			{
				name: '🚀 | Agora eu uso SlashCommands use /help para saber mais',
				type: 'PLAYING',
			},
			{
				name: '🐦 | Me siga no twitter https://twitter.com/mitsybot',
				type: 'PLAYING',
			},
			{
				name: '🖥 | Acesse o meu website https://mitsy.xyz',
				type: 'PLAYING',
			},
			{
				name: '🥤 | Beba bastante agua',
				type: 'PLAYING',
			},
			{
				name: '😘 | Eu voltei!',
				type: 'PLAYING',
			},
			{
				name: '☄️ | Apenas um cometinhas passando na terra!',
				type: 'PLAYING',
			},
		];
	}
	constructor() {
		this.activities = Activities.getDefaultActivities();
	}

	getAllActivities() {
		return this.activities;
	}

	getRandomActivity(shardId) {
		const randomActivity = this.activities[Math.floor(Math.random() * this.activities.length)];
		return { name: `${randomActivity.name} | Shard ${shardId}`, type: randomActivity.type };
	}

	addActivity(name, type) {
		this.activities.push({ name, type });
	}

	clearActivities() {
		this.activities = [];
	}

	resetActivities() {
		this.activities = Activities.getDefaultActivities();
		return this.activities;
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new Activities();
		}

		return this.instance;
	}
};
