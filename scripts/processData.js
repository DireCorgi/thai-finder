const csv = require('csv-parser');
const fs = require('fs');
const pool = require('../db/queries');
var format = require('pg-format');

let batchInsert = {};

fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', row => {
    if (!batchInsert[row.CAMIS] && row['CUISINE DESCRIPTION'] === 'Thai') {
      batchInsert[row.CAMIS] = [
        row.CAMIS,
        row.DBA || 'N/A',
        `${row.BUILDING} ${row.STREET}`,
        row.ZIPCODE,
        row.PHONE,
        row['CUISINE DESCRIPTION']
      ];
    }
  }).on('end', () => {
    const query = (values) => format(`
      INSERT INTO restaurants (CAMIS, name, address, zipcode, phone, cuisine_type)
      VALUES %L
      ON CONFLICT (camis)
      DO NOTHING
    `, values);
    console.log('Finished Processing; Inserting into DB...');
    pool.query(query(Object.values(batchInsert)), [], (error, _) => {
      if (error) {
        console.log(error);
      }
    });
  });
