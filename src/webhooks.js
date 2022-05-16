const { Router } = require('express');

const dblHook = require('./webhooks/topgg.webhook');
const TwitchHook = require('./webhooks/twitch.webhook');
const dblAuth = require('./middlewares/dblAuth');
const webhooks = Router();

webhooks.post('/dbl/', dblAuth, dblHook.register);
webhooks.post('/twitch/online', dblAuth, TwitchHook.online);
webhooks.post('/twitch/game', dblAuth, TwitchHook.gameChange);

module.exports = webhooks;
