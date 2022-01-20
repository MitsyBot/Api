const axios = require('axios')
const API_URL = 'https://discordapp.com/api'

async function fetchUser (token) {
    const res = await axios.get(`${API_URL}/users/@me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res
}

async function fetchGuilds (token) {
    const res = await axios.get(`${API_URL}/users/@me/guilds`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    console.log(res)
    return res
}

  module.exports = { fetchGuilds, fetchUser }