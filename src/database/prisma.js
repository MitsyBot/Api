const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ShopController = require('../util/ShopController');
const DbSet = require('../util/ShopController');

function getConnection() {
	prisma.$connect().then(() => {
		console.info('Conectado a database');
		ShopController.getInstance().init();
	}).catch(e => {
		console.warn(`Não foi possível se conectar a database: ${e}`);
	});
	DbSet.getInstance();
}

module.exports = { getConnection, prisma };