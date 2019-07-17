const format = require('pg-format');

// pool: PGPool
// tableName: string
// additionalQuery: string
// columnNames: Array<string>
// batchValues: Array<Array<string>>
// onComplete: () => void

const batchInsert = ({
  pool,
  tableName,
  columnNames,
  additionalQuery,
  batchValues,
  onComplete
}) => {
  const start = new Date();
  const query = values =>
    format(
      'INSERT INTO %s (%s) VALUES %L %s',
      tableName,
      columnNames.join(','),
      values,
      additionalQuery
    );
  pool.query(query(batchValues), [], (error, results) => {
    if (error) {
      console.error(error);
    } else {
      console.info('Inserted', results.rowCount, 'rows');
      const end = new Date() - start;
      console.info('Execution time: %dms', end);
      if (onComplete) {
        onComplete(results);
      }
    }
  });
};

module.exports = batchInsert;
