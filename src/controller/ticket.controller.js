const { makeRequest, generateRandomId } = require('../util/WebSocket')

module.exports = class TicketController {

    static async open(req, res) {
      const body = req.body
      if(!body.user.id) return res.status(400).json({ err: true })

      const request = await makeRequest('helper', 
        {
          id: 1,
          id: generateRandomId(),
          type: 'ticket',
          data: body,
        })
        console.log(request)
        return res.status(200).json(request);
      }
    
}
