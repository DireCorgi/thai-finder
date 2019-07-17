const format = require('pg-format');

// pool: PGPool
// tableName: string
// additionalQuery: string
// columnNames: Array<string>
// batchValues: Array<Array<string>>

const batchInsert = ({ pool, tableName, columnNames, additionalQuery, batchValues }) => {
  const query = format(
    'INSERT INTO %s (%s) VALUES %L %s',
    tableName,
    columnNames.join(','),
    batchValues,
    additionalQuery
  );
  console.info('Running batch insert...', batchValues.length, 'rows');
  console.info(query.substring(0, 200), '...');
  return pool.query(query);
};

module.exports = batchInsert;
