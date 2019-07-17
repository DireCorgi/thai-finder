const csv = require('csv-parser');
const fs = require('fs');
const pool = require('../db');
const getData = require('../helpers/getData');
const batchInsert = require('../db/batchInsert');

let batchInsertRestaurants = {};

getData(file => {
  fs.createReadStream(file.path)
    .pipe(csv())
    .on('data', row => {
      if (!batchInsertRestaurants[row.CAMIS] && row['CUISINE DESCRIPTION'] === 'Thai') {
        batchInsertRestaurants[row.CAMIS] = [
          row.CAMIS,
          row.DBA || 'N/A',
          `${row.BUILDING} ${row.STREET}`,
          row.ZIPCODE,
          row.PHONE,
          row['CUISINE DESCRIPTION']
        ];
      }
    })
    .on('end', () => {
      const queryValues = Object.values(batchInsertRestaurants);
      console.info(`Finished Processing ${queryValues.length} records; Inserting into DB...`);
      batchInsert({
        pool,
        tableName: 'restaurants',
        columnNames: ['camis', 'name', 'address', 'zipcode', 'phone', 'cuisine_type'],
        additionalQuery: 'ON CONFLICT (camis) DO NOTHING',
        batchValues: queryValues,
        onComplete: () => {
          console.info('deleting file...');
          fs.unlinkSync(file.path);
          console.info('delete completed');
        }
      });
    });
});
