const CronJob = require('cron').CronJob;

module.exports = class ShopController {

	constructor(prisma) {
		this.backgrounds = [];
		this.database = prisma.backgrounds.bgs;
	}

	getBackgrounds() {
		const back = this.backgrounds;

		return back;
	}

	async init() {
		const dbBackgrounds = await this.database.findMany();

		this.backgrounds = random(dbBackgrounds, 3);

		const job = new CronJob('0 */24 * * *', async () => {

			this.backgrounds = random(dbBackgrounds, 3);

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