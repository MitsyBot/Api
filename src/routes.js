const { Router } = require('express')
const Oauth = require('./middlewares/OAuth')

const ShardController = require('./controller/shard.controller')
const CommandsController = require('./controller/commands.controller')
const ActivityController = require('./controller/activity.controller')
const AssetsController = require('./controller/assets.controller')
const UserController = require('./controller/user.controller')
const IndexConfig = require('./controller/configure/index')
const GuildChannels = require('./controller/guild/channels.controller')
const GuildRoles = require('./controller/guild/roles.controller')
const Suggestion = require('./controller/suggestion.controller')
const User = require('./controller/user/daily.controller')
const Fanarts = require('./controller/fanart.controller')
const Ticket = require('./controller/ticket.controller')
const isAuth = require('./middlewares/isAuth')
const Shop = require('./controller/shop.controller')
const auth = require('./controller/auth.controller')
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
router.post('/suggestion', Suggestion.suggest);

// Discord auth
router.get('/user/@me', Oauth.authenticate(false, true), auth.me)
router.get('/user/login', auth.login)

// Usuarios para o website e dashboard
router.get('/user/:id/banners', UserController.GetUserBanners);
router.get('/user/:user/daily', User.getDailyInfos);
router.post('/user/get/daily', User.postDaily)

// Daily shop
router.get('/shop/backgrounds', Shop.getRandomBackgrounds)
router.post('/shop/background/buy', Shop.buyBackground)
// Ticket
router.post('/ticket/create', Ticket.open)

// Fanarts
router.get('/fanarts/getAll', Fanarts.getArts)

// Servidor para dashboard
router.get('/configure/guild', IndexConfig.GetIndexGuildConfig);
router.get('/configure/guild/channels', GuildChannels.getChannels);
router.get('/configure/guild/roles', GuildRoles.getRoles);

module.exports = router
