const { makeRequest, generateRandomId } = require('../util/WebSocket')

module.exports = class FanartController {
    static async connCallback(req, res) {
        const body = {
            userID: req.user.id,
            code: req.query.code,
            connection: req.params.connName
        }

    const request = await makeRequest('mitsy', 
      {
        id: generateRandomId(),
        type: 'authorizecon',
        data: body,
      })
          res.status(200).json(request.data)
    }

    static async getAllConnections(req, res) {
        const body = {
            userID: req.user.id,
        }

    const request = await makeRequest('mitsy', 
      {
        id: generateRandomId(),
        type: 'getallcons',
        data: body,
      })

      res.status(200).json(request.data.userConnections)
    }
}