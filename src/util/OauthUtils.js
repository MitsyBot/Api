const fetch = require('node-fetch')
const API_URL = 'https://discordapp.com/api'

function fetchUser (token) {
    if (!token) throw new Error('INVALID_TOKEN')

    return fetch(`${API_URL}/users/@me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.ok ? res.json() : Promise.reject(res))
}

async function fetchGuilds (token) {
    if (!token) throw new Error('INVALID_TOKEN')

    return fetch(`${API_URL}/users/@me/guilds`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.ok ? res.json() : Promise.reject(res))
    
}

  module.exports = { fetchGuilds, fetchUser }