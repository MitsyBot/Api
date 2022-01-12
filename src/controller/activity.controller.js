const mitsyActivity = require('../util/mitsyActivity')
const ApiError = require('../util/ApiError')
const ws = require('ws')
module.exports = class ActivityController {

    static random(req, res) {
        let { shard } = req.body;
        if (!shard) shard = 0;

        ws.send({
          id: 1,
          type: 'guild',
          data: { guildId: '775328200044838922' },
        });


        const resolveSuccess = (receivedData) => {
          clearTimeout(timeout);
          this.ws?.removeListener('message', handler);
          return res(receivedData);
        };
  
        const handler = (msg) => {
          const parsedData = JSON.parse(msg.toString());
  
          if (!parsedData?.id) return;
          if (parsedData.id !== toSend.id) return;
          if (!parsedData?.res) return resolveError();
  
          return resolveSuccess({ data: Buffer.from(parsedData.res) });
        };
  
        ws.on('message', handler);

        return res.send(mitsyActivity.getInstance().getRandomActivity(shard));
      }
    
      static all(_req, res) {
        return res.status(200).json(mitsyActivity.getInstance().getAllActivities());
      }
    
       static clear(_req, res) {
        mitsyActivity.getInstance().clearActivities();
        return res.status(200).json({ ok: true });
      }
    
       static reset(_req, res) {
        return res.status(200).json(mitsyActivity.getInstance().resetActivities());
      }
    
       static add(req, res) {
        const ACTIVITY_TYPES = ['WATCHING', 'PLAYING', 'LISTENING', 'STREAMING'];
        const { type, name } = req.body;
    
        if (!type || !name) {
          throw new APIError('O conteúdo do request é inválido!', 400);
        }
    
        if (!ACTIVITY_TYPES.includes(type)) {
          throw new APIError(`Este tipo é invalido! tipos: ${ACTIVITY_TYPES}`, 400);
        }
    
        mitsyActivity.getInstance().addActivity(name, type);
        return res.status(201).send({ type, name });
      }
}
