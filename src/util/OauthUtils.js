const axios = require('axios')
const API_URL = 'https://discordapp.com/api'
const { makeRequest, generateRandomId } = require('./WebSocket')

async function fetchUser (token) {
    const res = await axios.get(`${API_URL}/users/@me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data
}

async function fetchGuilds (token) {
    const res = await axios.get(`${API_URL}/users/@me/guilds`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const parentGuild = await Promise.all(res.data.map(async (guilds) => { 
        guilds.canManage = Boolean(guilds.permissions & 0x0000000020)
        return guilds
      }))
    const manageableGuilds = parentGuild.filter(guilds => guilds.permissions & 0x0000000020)
    return Promise.all(manageableGuilds.map(g => {
        const common = Promise.all(makeRequest('mitsy', 
        {
          id: generateRandomId(),
          type: 'common',
          data: {
            guild: g.id
          },
        }))
        return common
      }))
}

  module.exports = { fetchGuilds, fetchUser }