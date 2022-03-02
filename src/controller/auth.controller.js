const auth = require('../util/OAuth');
const jwt = require('jsonwebtoken');
const { makeRequest, generateRandomId } = require('../util/WebSocket');

module.exports = class ActivityController {

	static async login(req, res) {
		const agent = req.get('User-Agent');
		const { code } = req.query;
		if (code) {
			try {
				const {
					access_token: accessToken,
					expires_in: expiresIn,
					refresh_token: refreshToken,
					token_type: tokenType,
					scope,
				} = await auth.exchangeCode(code);

				res.json({
					token: jwt.sign({
						accessToken,
						refreshToken,
						expiresIn,
						expiresAt: Date.now() + expiresIn * 1000,
						tokenType,
						scope,
					}, process.env.JWT_SECRET),
					expires_in: expiresIn,
				});
				const body = {
					userid: req.user.id,
					message: `Um novo login foi realizado no meu website em ${agent} ${req.clientIp}`,
				};

				await makeRequest('mitsy',
					{
						id: generateRandomId(),
						type: 'message',
						data: body,
					});

			}
			catch (e) {
				console.log(e);
				res.status(403).json({ error: 'Não foi possivel validar a autenticação!' });
			}
		}
		else {
			res.status(400).json({ error: 'Nenhum codigo de autenticação foi enviado!' });
		}
	}

	static async me(req, res) {
		res.json({ user: req.user, guilds: req.guilds });
	}
};