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

    if(user.backgroundList.includes(banner.id)) {
    if(user.comets < Number(banner.cost)) return res.send({ sucess: false, message: 'Você não tem cometinhas para comprar este background'})
    
    user.comet -= Number(banner.cost)
    user.backgroundList.push(banner.id)
    user.save()

    res.send({ sucess: true, message: 'Background comprado com sucesso' })
    } else {
      res.send({ sucess: false, message: 'Você ja tem este banner' })
    }
  }
}