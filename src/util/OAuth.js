const fetch = require('node-fetch');
const FormData = require('form-data');

function exchangeCode(code, baseurl) {
	return tokenRequest(code, baseurl);
}

async function tokenRequest(code, baseurl) {

	const data = new FormData();
	data.append('client_id', process.env.CLIENT_ID);
	data.append('client_secret', process.env.CLIENT_SECRET);
	data.append('grant_type', 'authorization_code');
	data.append('redirect_uri', baseurl + '/oauth/callback/dashboard');
	data.append('scope', 'identify guilds');
	data.append('code', code);
	const json = await (await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: data,
	})).json();

	return json;
}

module.exports = { exchangeCode };