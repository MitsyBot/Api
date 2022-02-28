const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const DbSet = require('../util/ShopController');

async function getConnection() {
	prisma.$connect().then(() => {
		console.info('Conectado a database');
	}).catch(e => {
		console.warn(`Não foi possível se conectar a database: ${e}`);
	});
	await DbSet.getInstance();
}

module.exports = { getConnection, prisma };