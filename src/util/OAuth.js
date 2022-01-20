
const fetch = require('node-fetch')
const FormData = require('form-data')

const API_URL = 'https://discordapp.com/api'


function exchangeCode (code) {
    return tokenRequest(code)
  }

  async function tokenRequest (code) {
    const data = new FormData()
    data.append('client_id', process.env.CLIENT_ID)
    data.append('client_secret', process.env.CLIENT_SECRET)
    data.append('grant_type', 'authorization_code')
    data.append('redirect_uri', 'https://mitsy.xyz/oauth/callback/dashboard')
    data.append('scope', 'identify')
    data.append('code', code)
    const json = await (await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: data
          })).json()

    return json
  }

module.exports = { exchangeCode }