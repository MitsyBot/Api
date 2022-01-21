
const fetch = require('node-fetch')
const database = require('../database/mongo');

module.exports = class SuggestionController {
  static async suggest(req, res) {

    let attach = req.body.file

    fetch(`${process.env.SUGGESTION_WEBHOOK_URL}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: req.user.username,
          avatar_url: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
          content: `${req.body.type} de <@${req.user.id}>.`,
          embeds: [
            {
              color: 16291323,
              author: {
                name: `${req.body.type} de ${req.user.username}`,
                icon_url: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
              },
              title: req.body.title,
              description: req.body.description,
              image: {
                url: attach,
              },
              footer: {
                text: `Enviado por ${req.user.username}`
              },
            },
          ],
        }),
      })


      
    const user = await database.fetchUser(req.user.id);
     
    let premiumBoost = 1;
    let tax = 0.2;
  
  
    if (user.isPremium) {
        premiumBoost = 0.5 + user.premiumLevel;
        tax = 1;
    }
  
    let amount = (Math.floor(Math.random() * 1000) + 1000) * premiumBoost;
    const taxValue = Math.floor(amount * tax);
  
    if (user.isPremium === false) {
        amount = amount - taxValue;
    }
    amount = Math.floor(amount);
  
    user.comets += amount;
    user.timeDaily = 43200000 + Date.now();
    user.save()

      return res.status(200).json({
        received: amount,
        notPremiumReceive: amount + taxValue,
        isPremium: user.isPremium
    })
    }
}
