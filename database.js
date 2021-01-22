const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

exports.getCurrencyRate = async function getCurrencyRate(rateDate) {
  return client.query('SELECT NOW()');
};
