const ShopController = require('../util/ShopController');
const database = require('../database/mongo');
module.exports = class SimpleShop {
  static async getRandomBackgrounds(_req, res) {
    const backgrounds = ShopController.getInstance().getBackgrounds();

    return res.status(200).json(backgrounds);
  }
  static async buyBackground(req, res) {
    const { banner, userid } = req.body
    const user = await database.fetchUser(userid);

    const dailyShop = await (await fetch('https://mitsy.xyz/shop/backgrounds', {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })).json()

    if(user.comets < banner.cost) return res.send({ sucess: false, message: 'Você não tem cometinhas para comprar este background'})

    const background = dailyShop.find(shop => shop.id === banner.id);

    if(background){
    user.comet -= banner.cost
    user.backgroundList.push(banner.id)
    user.save()

    res.send({ sucess: true, message: 'Background comprado com sucesso' })
    } else {

      res.send({ sucess: false, message: 'Este background não esta disponivel na loja diaria'})

    }
  }
}