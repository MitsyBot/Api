const fetch = require('node-fetch')
const API_URL = 'https://discordapp.com/api'
const { makeRequest, generateRandomId } = require('./WebSocket')

function fetchUser (token) {
    return requestDiscord('/users/@me', token)
  }

async function fetchGuilds (token) {
    const gs =  await requestDiscord('/users/@me/guilds', token)
    
    const commons = gs.map(g => {
        const common = await makeRequest('mitsy', 
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
    })

    return commons
  }

function requestDiscord (endpoint, token) {
    if (!token) throw new Error('INVALID_TOKEN')

    return fetch(`${API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.ok ? res.json() : Promise.reject(res))
  }

  module.exports = { fetchGuilds, fetchUser, requestDiscord }