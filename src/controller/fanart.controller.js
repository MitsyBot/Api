const DbSet = require('../database/DbSet');
const { makeRequest, generateRandomId } = require('../util/WebSocket');

module.exports = class FanartController {
	static async getArts(_req, res) {
		const fanarts = await DbSet.getInstance().fanarts.arts.findMany();
		if (!fanarts) res.status(200).json({ message: 'nenhuma fanart registrada' });
		console.log(fanarts);
		const all = await Promise.all(fanarts.map(async (arts) => {

			const request = await makeRequest('mitsy',
				{
					id: generateRandomId(),
					type: 'getUser',
					data: {
						user: arts.artist,
					},
				});

			const body = {
				username: request.data.username,
				avatar: request.data.avatar,
				id: request.data.id,
			};

			return { artist: body, title: arts.title, description: arts.description, link: `${process.env.CDN_URL}/fanart/${arts.artist}/${arts.file}` };
		}));
		console.log(all);

		res.status(200).json(all);
	}
};