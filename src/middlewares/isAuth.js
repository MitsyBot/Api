module.exports = (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization || authorization !== process.env.API_TOKEN) {
		return res.status(401).send({ message: 'Apenas a mitsy pode acessar isto' });
	}

	return next();
};