const { Client } = require('pg');

const clientConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.ENVIRONMENT === 'PRODUCTION' ? { rejectUnauthorized: false } : false,
};

const client = new Client(clientConfig);

exports.start = async function start() {
  return client.connect();
};

exports.getCurrencyRate = async function getCurrencyRate(minRateDate, maxRateDate) {
  return client.query('select * from currency_rate where rate_date = (SELECT min(rate_date)  FROM currency_rate where rate_date >= $1 AND rate_date <= $2);',
    [minRateDate, maxRateDate]);
};

exports.saveCurrentRate = async function saveCurrentRate(currencyCode, currentRate, saveDate) {
  return client.query('INSERT into currency_rate (currency_code,rate_value,rate_date) VALUES ($1,$2,$3)',
    [currencyCode, currentRate, saveDate]);
};

exports.end = async function end() {
  return client.end();
};
