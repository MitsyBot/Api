const mitsyActivity = require('../util/mitsyActivity')
const ApiError = require('../util/ApiError')

module.exports = class ActivityController {

    static random(req, res) {
        let { shard } = req.body;
        if (!shard) shard = 0;

        console.log(mitsyActivity.getInstance())
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