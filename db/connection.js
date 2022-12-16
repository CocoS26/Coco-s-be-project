const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}
const config = 
ENV === "Production!"
? {
  connectionString: process.env.DATABASE_URL, 
  max:2
}
:{};

module.exports = new Pool(config);
