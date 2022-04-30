const fetch = require('node-fetch');
const FormData = require('form-data');

function exchangeCode(code) {
	return tokenRequest(code);
}

async function tokenRequest(code) {

	const data = new FormData();
	data.append('client_id', process.env.CLIENT_ID);
	data.append('client_secret', process.env.CLIENT_SECRET);
	data.append('grant_type', 'authorization_code');
	data.append('redirect_uri', 'https://mitsy.xyz/oauth/callback/dashboard');
	data.append('scope', 'identify guilds');
	data.append('code', code);
	const json = await (await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: data,
	})).json();
	console.log(json);
	return json;
}

module.exports = { exchangeCode };