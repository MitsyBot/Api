const database = require('../database/mongo');
const fetch = require('node-fetch')

module.exports = class UserController {
    static async GetUserBanners(req, res) {
        const user = await database.fetchUser(req.user.id);

        if(user) {
        res.status(200).json(user.backgroundList)
        } else {
            res.status(200).json({ message: 'Usuario não encontrado' })
        }
    }
    static async getUserKeys(req, res) {
        const user = await database.fetchUser(req.user.id);
        res.send({ keys: user.premium.keys })
    }

    static async getListWithActiveBanner(req, res) {
        const user = await database.fetchUser(req.user.id);
        const backgrounds = await database.getAllBackgrounds()

    const userBanners = user.backgroundList
    const equipedBanner = user.background
    console.log(userBannners)
    console.log(equipedBanner)
    const banners = backgrounds.filter((banner) => {
      if (userBanners.includes(banner.id)) { return banner };
      return null
    })
    console.log(banners)
    const toReq = banners.map((banner) => {
      if(banner.id === equipedBanner) {
      banner.enabled = true
      } else {
        banner.enabled = false
      }
      return banner
    })
    console.log(toReq)
    res.send({ backgrounds: toReq })
    }

    static async setUserBanner(req, res) {
        const user = await database.fetchUser(req.user.id);

        user.background = req.body.banner
        user.save()
    
        res.send({ sucess: true,  message: "Background definido com sucesso" })
    }
  }