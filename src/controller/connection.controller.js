const { makeRequest, generateRandomId } = require('../util/WebSocket')

module.exports = class FanartController {
    static async connCallback(req, res) {
        const body = {
            userID: req.user.id,
            code: req.query.code,
            connection: req.params.connName
        }

    console.log(req.query.code)

    const request = await makeRequest('mitsy', 
      {
        id: generateRandomId(),
        type: 'authorizecon',
        data: body,
      })
          res.status(200).json(request)
    }
}