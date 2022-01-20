const axios = require('axios')
const API_URL = 'https://discordapp.com/api'

function fetchUser (token) {
    const res = await axios.get(`${API_URL}/users/@me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    console.log(res)
    return res.data
}

async function fetchGuilds (token) {
    const res = await axios.get(`${API_URL}/users/@me/guilds`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    console.log(res)
    return res.data
}

  module.exports = { fetchGuilds, fetchUser }