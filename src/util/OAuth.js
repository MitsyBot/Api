
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')

const API_URL = 'https://discordapp.com/api'


function exchangeCode (code) {
    return tokenRequest({ code, grant_type: 'authorization_code' })
  }

  function tokenRequest (params = {}) {
    const body = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      scope: 'guilds identify',
      ...params
    })

    return fetch(`${API_URL}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    }).then(res => res.ok ? res.json() : Promise.reject(res))
  }

module.exports = { exchangeCode }