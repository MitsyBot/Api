const database = require('../database/mongo');

module.exports = class FanartController {
	static async getArts(req, res) {
		const fanarts = await database.getAllArts();
		const all = await Promise.all(fanarts.map((arts) => {

			return { id: arts.id, authorid: arts.authorid, name: arts.name, link: `${process.env.CDN_URL}/fanart/${arts.authorid}/${arts.id}.png` };
		}));

		res.status(200).json(all);
	}
};