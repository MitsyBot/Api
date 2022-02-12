const ShopController = require('../util/ShopController');
const database = require('../database/mongo');
const axios = require('axios');

module.exports = class SimpleShop {
  static async getRandomBackgrounds(_req, res) {
    const backgrounds = ShopController.getInstance().getBackgrounds();

    return res.status(200).json(backgrounds);
  }
  static async buyBackground(req, res) {
    const { banner } = req.body
    const user = await database.fetchUser(req.user.id);
    const backgrounds = await user.backgroundList
    if(backgrounds.includes(banner.id)) return res.send({ sucess: false, message: 'Você ja tem este banner' })
    if(user.comets < Number(banner.cost)) return res.send({ sucess: false, message: 'Você não tem cometinhas para comprar este background'})
    
    user.comets -= banner.cost;
    user.backgroundList.push(banner.id)
    user.save()

    res.send({ sucess: true, message: 'Background comprado com sucesso' })
  }
  static async allBackgrounds(req, res) {
    const backgrounds = await database.getAllBackgrounds()

    res.send(backgrounds)
  }
}