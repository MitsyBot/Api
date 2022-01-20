const fetch = require('node-fetch')
const API_URL = 'https://discordapp.com/api'
const { makeRequest, generateRandomId } = require('./WebSocket')

function fetchUser (token) {
    const acessToken = token
    console.log(acessToken)
    return requestDiscord('/users/@me', acessToken)
  }

async function fetchGuilds (token) {

    const acessToken = token
    console.log(acessToken)
    return await requestDiscord('/users/@me/guilds', acessToken)
    
  }

function requestDiscord (endpoint, token) {
    if (!token) throw new Error('INVALID_TOKEN')

    return fetch(`${API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.ok ? res.json() : Promise.reject(res))
  }

  module.exports = { fetchGuilds, fetchUser, requestDiscord }