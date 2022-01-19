const ShopController = require('../util/ShopController');

module.exports = class SimpleShop {
  static async getRandomBackgrounds(_req, res) {
    const backgrounds = ShopController.getInstance().getBackgrounds();

    return res.status(200).json(backgrounds);
  }
}