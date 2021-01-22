const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

exports.start = async function start() {
  client.connect();
};

exports.getCurrencyRate = async function getCurrencyRate(rateDate) {
  return client.query('SELECT NOW()');
};

exports.end = function end() {
  client.end();
};
