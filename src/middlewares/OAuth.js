const jwt = require('jsonwebtoken');
const { fetchGuilds, fetchUser } = require('../util/OauthUtils');
module.exports = class EndpointUtils {
	static authenticate(adminOnly = false, fetchG = false) {
		return async (req, res, next) => {
			const token = await req.get('Authorization');
			if (token) {
				if (!token) return res.status(400).json({ ok: false });

				if (!adminOnly) {
					try {
						const { accessToken } = jwt.verify(token, process.env.JWT_SECRET);
						req.user = await fetchUser(accessToken);
						if (fetchG) req.guilds = await fetchGuilds(accessToken);
						return next();
					}
					catch (e) {
						console.log(e);
						return res.status(401).json({ ok: false });
					}
				}

				return res.status(401).json({ ok: false });
			}
			return res.status(400).json({ ok: false });
		};
	}
};