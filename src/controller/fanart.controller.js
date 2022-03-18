const DbSet = require('../database/DbSet');
const { makeRequest, generateRandomId } = require('../util/WebSocket');

module.exports = class FanartController {
	static async getArts(_req, res) {
		const fanarts = await DbSet.getInstance().fanarts.arts.findMany();
		if (!fanarts) res.status(200).json({ message: 'nenhuma fanart registrada' });
		const all = await Promise.all(fanarts.map(async (arts) => {

			const request = await makeRequest('mitsy',
				{
					id: generateRandomId(),
					type: 'getUser',
					data: {
						user: arts.artist,
					},
				});
			const artist = {
				username: request.data.username,
				avatar: request.data.avatar,
				id: request.data.id,
			};
			return { artist, title: arts.title, description: arts.description, link: `${process.env.CDN_URL}/fanarts/${arts.artist}/${arts.file}` };
		}));

		res.status(200).json(all);
	}

	static async sendArt(req, res) {
		const user = req.user;
		const { file, art } = req.body;

		const body = {
			file,
			art,
			user,
		};

		await makeRequest('helper',
			{
				id: generateRandomId(),
				type: 'fanart',
				data: body,
			});

		res.send({ sucess: true, message: 'A fanart foi enviada para aprovação' });
	}

	static async aproveArt(req, res) {
		const { artist, art, file } = req.body;
		await DbSet.getInstance().fanarts.arts.create({
			data: {
				artist,
				description: art.description,
				file,
				title: art.title,
			},
		});
		res.send({ sucess: true, message: 'A fanart foi aprovada' });
	}
};