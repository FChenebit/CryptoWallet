const { Client } = require('pg');

const clientConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.ENVIRONMENT === 'PRODUCTION' ? { rejectUnauthorized: false } : false
};

const client = new Client(clientConfig);

exports.start = async function start() {
  return client.connect();
};

exports.getCurrencyRate = async function getCurrencyRate(rateDate) {
  return client.query('SELECT NOW()');
};

exports.end = async function end() {
  return client.end();
};
