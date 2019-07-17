const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'frank',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
});

module.exports = pool;
