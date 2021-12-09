
const fetch = require('node-fetch')
const { MessageAttachment } = require('discord.js');
module.exports = class SuggestionController {
  static async suggest(req, res) {

    let attach = req.body.file

    if(!attach === null && !attach.includes('https://')) {
      attach = null
    }
    fetch(`${process.env.SUGGESTION_WEBHOOK_URL}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: req.body.username,
          avatar_url: `https://cdn.discordapp.com/avatars/${req.body.userid}/${req.body.avatarhash}.png`,
          content: `${req.body.type} de <@${req.body.userid}>.`,
          embeds: [
            {
              color: 16291323,
              author: {
                name: `${req.body.type} de ${req.body.username}`,
                icon_url: `https://cdn.discordapp.com/avatars/${req.body.userid}/${req.body.avatarhash}.png`,
              },
              title: req.body.title,
              description: req.body.description,
              image: {
                url: attach,
              },
              footer: {
                text: `Enviado por ${req.body.username}`
              },
            },
          ],
        }),
      })
      return res.sendStatus(200);
    }
}
