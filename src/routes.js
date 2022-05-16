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
const dblAuth = require('./middlewares/dblAuth');
const Connections = require('./controller/connection.controller');
const dblHook = require('./webhooks/topgg.webhook');
const TwitchHook = require('./webhooks/twitch.webhook');

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
router.post('/user/extras/', Oauth.authenticate(false, false), UserController.setUserExtras);
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
router.get('/user/reps/:id', UserController.getUserReps);
router.post('/user/rep/:id', Oauth.authenticate(false, false), UserController.giveRep);
// Daily shop
router.get('/shop/backgrounds', Shop.getRandomBackgrounds);
router.post('/shop/background/buy', Oauth.authenticate(false, false), Shop.buyBackground);
router.post('/shop/color/buy', Oauth.authenticate(false, false), Shop.buyColor);
router.get('/shop/colors', Shop.getColors);
router.post('/shop/suggest/background', Oauth.authenticate(false, false), Shop.sendBackground);
router.post('/shop/background/create', isAuth, Shop.createBackground);

// Ticket
router.post('/ticket/create', Oauth.authenticate(false, false), Ticket.open);

// Fanarts
router.get('/fanarts/getAll', Fanarts.getArts);
router.get('/fanarts/activity', Fanarts.getDay);
router.post('/fanarts/send', Oauth.authenticate(false, false), Fanarts.sendArt);
router.post('/fanarts/create', isAuth, Fanarts.aproveArt);
router.get('/fanarts/:user', Fanarts.getUserArts);

// Servidor para dashboard
router.get('/configure/guild', Oauth.authenticate(false, false), GuildController.GetIndexGuildConfig);

// Definir config
router.post('/configure/guild/index', Oauth.authenticate(false, false), GuildController.SetIndexGuildConfig);
router.post('/configure/guild/:id/log', Oauth.authenticate(false, false), GuildController.setEventLogConfig);
router.post('/configure/guild/:id/invite', Oauth.authenticate(false, false), GuildController.setInviteBlockerConfig);
router.post('/configure/guild/:id/birthday', Oauth.authenticate(false, false), GuildController.setBirthdayConfig);
router.post('/configure/guild/:id/welcomer', Oauth.authenticate(false, false), GuildController.setWelcomerConfig);
router.post('/configure/guild/:id/autorole', Oauth.authenticate(false, false), GuildController.SetAutoroleConfig);
router.post('/configure/guild/:id/starboard', Oauth.authenticate(false, false), GuildController.setStarboardConfig);

// Premium
router.post('/premium/buy', isAuth, premium.createPremium);

// Webhooks
router.post('/webhooks/dbl/', dblAuth, dblHook.register);
router.post('/webhooks/twitch/online', dblAuth, TwitchHook.online);
router.post('/webhooks/twitch/game', dblAuth, TwitchHook.gameChange);

module.exports = router;
