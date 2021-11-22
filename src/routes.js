const { Router } = require('express')

const ShardController = require('./controller/shard.controller')
const CommandsController = require('./controller/commands.controller')
const ActivityController = require('./controller/activity.controller')
const AssetsController = require('./controller/assets.controller')
const UserController = require('./controller/user.controller')
const IndexConfig = require('./controller/configure/index')
const BaseGuildInfo = require('./controller/guild.controller')
const isAuth = require('./middlewares/isAuth')

const router = Router()

router.get('/status/shards', ShardController.getShardStatus);
router.put('/shards', isAuth, ShardController.updateShardStatus);

router.get('/commands', CommandsController.getCommands);
router.post('/commands', isAuth, CommandsController.createCommands);
router.patch('/commands/:name', isAuth, CommandsController.editMaintenance);
router.get('/activity', ActivityController.random);
router.get('/activity/all', ActivityController.all);
router.post('/activity', isAuth, ActivityController.add);
router.put('/activity', isAuth, ActivityController.reset);
router.delete('/activity', isAuth, ActivityController.clear);
router.get('/assets/:type', AssetsController.getImageUrl);

// Usuarios para o website e dashboard
router.get('/user', UserController.GetUser)
router.get('/user/:id/banners', UserController.GetUserBanners)
router.get('/user/guilds', UserController.GetUserGuild)

// Servidor para dashboard
router.get('/configure/guild/index', IndexConfig.GetIndexGuildConfig)
router.get('/configure/guild', BaseGuildInfo.GetGuild)
module.exports = router
