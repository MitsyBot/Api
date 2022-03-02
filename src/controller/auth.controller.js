const auth = require('../util/OAuth');
const jwt = require('jsonwebtoken');
const { makeRequest, generateRandomId } = require('../util/WebSocket');
const { fetchUser } = require('../util/OauthUtils');

module.exports = class ActivityController {

	static async login(req, res) {
		const { code } = req.query;
		if (code) {
			const {
				access_token: accessToken,
				expires_in: expiresIn,
				refresh_token: refreshToken,
				token_type: tokenType,
				scope,
			} = await auth.exchangeCode(code);
			const token = jwt.sign({
				accessToken,
				refreshToken,
				expiresIn,
				expiresAt: Date.now() + expiresIn * 1000,
				tokenType,
				scope,
			}, process.env.JWT_SECRET);

			res.json({
				token,
				expires_in: expiresIn,
			});
			const discordtoken = jwt.verify(token, process.env.JWT_SECRET);
			const user = await fetchUser(discordtoken.accessToken);
			const body = {
				userid: user.id,
				message: `Opa, só pra avisar que um novo login foi realizado em meu website \`\`${req.headers['user-agent']}\`\`\nIp:``${req.clientIp}\`\``,
			};

			await makeRequest('mitsy',
				{
					id: generateRandomId(),
					type: 'message',
					data: body,
				});

		}
		else {
			res.status(400).json({ error: 'Nenhum codigo de autenticação foi enviado!' });
		}
	}

	static async me(req, res) {
		res.json({ user: req.user, guilds: req.guilds });
	}
};