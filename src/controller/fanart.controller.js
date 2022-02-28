const DbSet = require('../database/DbSet');

module.exports = class FanartController {
	static async getArts(req, res) {
		const fanarts = await DbSet.getInstance().fanarts.arts.findMany();
		if (!fanarts) res.status(200).json({ message: 'nenhuma fanart registrada' });

		const all = await Promise.all(fanarts.map((arts) => {

			return { id: arts.id, authorid: arts.authorid, name: arts.name, link: `${process.env.CDN_URL}/fanart/${arts.authorid}/${arts.id}.png` };
		}));

		res.status(200).json(all);
	}
};