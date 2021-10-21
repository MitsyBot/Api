const urls = require('../util/assetsUrl');

module.exports = class AssetsController {
  static async getImageUrl(req, res) {
    const { type } = req.params;

    if (!type) return res.sendStatus(400);

    const url = AssetsController.getAssetBasedOnTheType(type);

    if (url === 'NO-LINKS') return res.sendStatus(404);

    return res.json({ url });
  }

   static getAssetBasedOnTheType(type) {
    const allLinks = urls[type];

    if (!allLinks) return 'NO-LINKS';
    const randomLink = allLinks[Math.floor(Math.random() * allLinks.length)];

    return randomLink;
  }
}
