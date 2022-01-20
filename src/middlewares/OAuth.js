const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
const API_URL = 'https://discordapp.com/api'

module.exports = class EndpointUtils {
    static authenticate (adminOnly = false, fetchGuilds = false) {
        return async (req, res, next) => {
            const jwt = req.headers['Authorization']
            console.log(jwt)
            if (token) {
                if (!token) return res.status(400).json({ ok: false })
                
                if (!adminOnly) {
                    try {
                      const { accessToken } = jwt.verify(token, process.env.JWT_SECRET)
                      req.user = await fetchUser(accessToken)
                      if (fetchGuilds) req.guilds = await fetchGuilds(accessToken)
                      return next()
                    } catch (e) {
                      console.log(e)
                      return res.status(401).json({ ok: false })
                    }
                  }

                  return res.status(401).json({ ok: false })
                }
                return res.status(400).json({ ok: false })
            }
        }

        static fetchUser (token) {
            return requestDiscord('/users/@me', token)
          }

        static async fetchGuilds (token) {
            return await requestDiscord('/users/@me/guilds', token).then(gs => gs.map(g => {
                const common = makeRequest('mitsy', 
                {
                  id: generateRandomId(),
                  type: 'common',
                  data: {
                    guild: g.id
                  },
                })
                g.common = common.data.common
              return g
            }))
          }

        static requestDiscord (endpoint, token) {
            if (!token) throw new Error('INVALID_TOKEN')
        
            return fetch(`${API_URL}${endpoint}`, {
              headers: { Authorization: `Bearer ${token}` }
            }).then(res => res.ok ? res.json() : Promise.reject(res))
          }
    }