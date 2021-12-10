const database = require('../database/mongo');

module.exports = class FanartController {
    static async getArts(req, res) {
        const fanarts = await database.getAllArts();
        const all = await Promise.all(fanarts.map((fanarts) => {

            return { id: fanarts.id, authorid: fanarts.authorid, name: fanarts.name, link: `${process.env.CDN_URL}/fanart/${fanarts.authorid}/${fanarts.id}.png` }; 
          }))

          res.status(200).json(all)
    }
}