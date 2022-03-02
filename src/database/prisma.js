const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getConnection() {
	prisma.$connect().then(() => {
		console.info('Conectado a database');
	}).catch(e => {
		console.warn(`Não foi possível se conectar a database: ${e}`);
	});
}

module.exports = { getConnection, prisma };