module.exports = (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization || authorization !== process.env.DBL_WEBHOOK_SECRET) {
		return res.status(401).send({ message: 'Apenas o topgg pode acessar isto' });
	}

	return next();
};