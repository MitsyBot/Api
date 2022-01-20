
const fetch = require('node-fetch')
const FormData = require('form-data')

const API_URL = 'https://discordapp.com/api'


function exchangeCode (code) {
    return tokenRequest(code)
  }

  function tokenRequest (code) {
    const data = new FormData()
    data.append('client_id', process.env.CLIENT_ID)
    data.append('client_secret', process.env.CLIENT_SECRET)
    data.append('grant_type', 'authorization_code')
    data.append('redirect_uri', 'https://mitsy.xyz/oauth/callback/dashboard')
    data.append('scope', 'identify')
    data.append('code', code)

    return fetch(`${API_URL}/oauth2/token`, {
      method: 'POST',
      body: data
    }).then(res => res.ok ? res.json() : Promise.reject(res))
  }

module.exports = { exchangeCode }