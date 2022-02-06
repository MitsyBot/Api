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
            tier,
            ref: req.body.ref
        }


    console.log(tier)
      database.createNewPremium(req.body.userid, tier)

      const request = await makeRequest('mitsy', 
      {
        id: generateRandomId(),
        type: 'premiumbuy',
        data: body,
      })

      res.send(request)
    }
}