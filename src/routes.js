const { Router } = require('express');
const Oauth = require('./middlewares/OAuth');

const ShardController = require('./controller/shard.controller');
const CommandsController = require('./controller/commands.controller');
const ActivityController = require('./controller/activity.controller');
const AssetsController = require('./controller/assets.controller');
const UserController = require('./controller/user.controller');
const GuildController = require('./controller/guild.controller');
const Suggestion = require('./controller/suggestion.controller');
const User = require('./controller/user/daily.controller');
const Fanarts = require('./controller/fanart.controller');
const Ticket = require('./controller/ticket.controller');
const isAuth = require('./middlewares/isAuth');
const Connections = require('./controller/connection.controller');

const Shop = require('./controller/shop.controller');
const auth = require('./controller/auth.controller');
const premium = require('./controller/premium.controller');
const router = Router();

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
router.post('/suggestion', Oauth.authenticate(false, false), Suggestion.suggest);
router.get('/backgrounds/', Shop.allBackgrounds);
// Discord auth
router.get('/user/@me', Oauth.authenticate(false, true), auth.me);
router.get('/user/login', auth.login);
router.post('/user/login/new', Oauth.authenticate(false, false), auth.loginMessage);

// Usuarios para o website e dashboard
router.get('/user/profile', Oauth.authenticate(false, false), UserController.GetUserInfos);
router.post('/user/background/', Oauth.authenticate(false, false), UserController.setUserBanner);
router.post('/user/color/', Oauth.authenticate(false, false), UserController.setUserColor);
router.post('/user/aboutme/', Oauth.authenticate(false, false), UserController.setUserAboutme);
router.post('/user/others/', Oauth.authenticate(false, false), UserController.setUserConfigs);
router.post('/user/badges/', Oauth.authenticate(false, false), UserController.setUserBadges);
router.get('/user/keys', Oauth.authenticate(false, false), UserController.getUserKeys);
router.post('/user/keys/enable', Oauth.authenticate(false, false), premium.activateKey),
router.post('/user/keys/disable', Oauth.authenticate(false, false), premium.deactivateKey),
router.get('/user/daily', Oauth.authenticate(false, false), User.getDailyInfos);
router.post('/user/get/daily', Oauth.authenticate(false, false), User.postDaily);

// Conexões
router.get('/user/connections/:connName/callback', Oauth.authenticate(false, false), Connections.connCallback);
router.get('/user/connections', Oauth.authenticate(false, false), Connections.getAllConnections);
router.delete('/users/connections/:connection', Oauth.authenticate(false, false), Connections.removeConnection);

// Daily shop
router.get('/shop/backgrounds', Shop.getRandomBackgrounds);
router.post('/shop/background/buy', Oauth.authenticate(false, false), Shop.buyBackground);
router.post('/shop/color/buy', Oauth.authenticate(false, false), Shop.buyColor);
router.get('/shop/colors', Shop.getColors);

// Ticket
router.post('/ticket/create', Oauth.authenticate(false, false), Ticket.open);

// Fanarts
router.get('/fanarts/getAll', Fanarts.getArts);

// Servidor para dashboard
router.get('/configure/guild', Oauth.authenticate(false, false), GuildController.GetIndexGuildConfig);

// Definir config
router.post('/configure/guild/index', Oauth.authenticate(false, false), GuildController.SetIndexGuildConfig);

// Premium
router.post('/premium/buy', isAuth, premium.createPremium);

module.exports = router;
