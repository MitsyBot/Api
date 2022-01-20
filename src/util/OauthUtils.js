const fetch = require('node-fetch')
const API_URL = 'https://discordapp.com/api'
const { makeRequest, generateRandomId } = require('./WebSocket')

function fetchUser (token) {
    return requestDiscord('/users/@me', token)
  }

async function fetchGuilds (token) {
    return await requestDiscord('/users/@me/guilds', token).then(gs => gs.map(g => {
        const common = makeRequest('mitsy', 
        {
          id: generateRandomId(),
          type: 'common',
          data: {
            guild: g.id
          },
        })
        console.log(common)
        g.common = common.data.common
      return g
    }))
  }

function requestDiscord (endpoint, token) {
    if (!token) throw new Error('INVALID_TOKEN')

    return fetch(`${API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.ok ? res.json() : Promise.reject(res))
  }

  module.exports = { fetchGuilds, fetchUser, requestDiscord }