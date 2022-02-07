const database = require('../database/mongo');
const { makeRequest, generateRandomId } = require('../util/WebSocket')

module.exports = class PremiumController {
    static async createPremium(req, res) {

        const tier = () => {
            if(req.price = 19.99) return 1
            if(req.price = 39.99) return 2
            if(req.price = 89.99) return 3
            if(req.price = 119.99) return 4
        }
        const body = {
            userid: req.body.userid,
            price: req.body.price,
            tier: tier(),
            ref: req.body.ref
        }

      database.createNewPremium(req.body.userid, tier())

      const request = await makeRequest('mitsy', 
      {
        id: generateRandomId(),
        type: 'premiumbuy',
        data: body,
      })

      res.send(request)
    }

    static async activateKey(req, res) {
      const { keyid, guildid } = req.body

      const isUnique = await database.checkIfGuildHaveKey(guildid)
      if(isUnique) return res.send({ err: true })

      const mes = database.updateKeyStatus(req, keyid, guildid)
      res.send({ message: mes })
    }
    static async deactivateKey(req, res) {
      const { keyid } = req.body
      const mes = database.deactivateKey(req, keyid)
      res.send({ message: mes })
    }
}