const { Router } = require('express')

const ShardController = require('./controller/shard.controller')
const CommandsController = require('./controller/commands.controller')
const ActivityController = require('./controller/activity.controller')
const AssetsController = require('./controller/assets.controller')

const isAuth = require('./middlewares/isAuth')

const router = Router()

router.get('/status/shards', ShardController.getShardStatus);
router.put('/shards', isAuth, ShardController.updateShardStatus);

router.get('/commands', CommandsController.getCommands);
router.post('/commands', isAuth, CommandsController.createCommands);
router.patch('/commands/:name', isAuth, CommandsController.editMaintenance);

router.get('/activity', ActivityController.random);
router.get('/activity/all', ActivityController.all);
router.post('/activity', ActivityController.add);
router.put('/activity', ActivityController.reset);
router.delete('/activity', ActivityController.clear);

router.get('/assets/:type', AssetsController.getImageUrl);

module.exports = router
