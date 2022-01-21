const database = require('../../database/mongo');

module.exports = class DailyController {

  static async getDailyInfos(req, res) {
    const user = await database.fetchUser(req.user.id);
  res.status(200).json({
      canDaily: Boolean(parseInt(user.timeDaily) < Date.now()),
      isPremium: user.isPremium 
  })
    }

  static async postDaily(req, res) {
    const user = await database.fetchUser(req.user.id);

    if (parseInt(user.timeDaily) > Date.now()) {
        return res.status(200).json({
            canDaily: false
        })
    }

    let premiumBoost = 1;
	let tax = 0.2;


    if (user.isPremium) {
        premiumBoost = 0.5 + user.premiumLevel;
        tax = 1;
    }

    let amount = (Math.floor(Math.random() * 2000) + 2000) * premiumBoost;
    const taxValue = Math.floor(amount * tax);

    if (user.isPremium === false) {
        amount = amount - taxValue;
    }
    amount = Math.floor(amount);

    user.comets += amount;
	user.timeDaily = 43200000 + Date.now();
	user.save()

    res.status(200).json({
        received: amount,
        notPremiumReceive: amount + taxValue,
        isPremium: user.isPremium
    })
  }

}