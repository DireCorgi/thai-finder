const csv = require('csv-parser');
const fs = require('fs');
const pool = require('../db');
const getData = require('../helpers/getData');
const batchInsert = require('../db/batchInsert');

let batchInsertRestaurants = {};

const processData = async () => {
  let file;
  // try {
  //   file = await getData();
  // } catch (error) {
  //   console.error('Error Downloading', error);
  //   return;
  // }
  file = { path: 'data.csv' };

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
    .on('end', async () => {
      const queryValues = Object.values(batchInsertRestaurants);
      console.info(`Finished Processing ${queryValues.length} records; Inserting into DB...`);
      let result;
      try {
        result = await batchInsert({
          pool,
          tableName: 'restaurants',
          columnNames: ['camis', 'name', 'address', 'zipcode', 'phone', 'cuisine_type'],
          additionalQuery: `
            ON CONFLICT (camis)
            DO UPDATE
            SET
              name = EXCLUDED.name,
              address = EXCLUDED.address,
              zipcode = EXCLUDED.zipcode,
              phone = EXCLUDED.phone,
              cuisine_type = EXCLUDED.cuisine_type
          `,
          batchValues: queryValues
        });
      } catch (error) {
        console.error('Error Updating Database', error);
        return;
      }
      console.info('Finished updating/inserting', result.rowCount, 'rows');
      // console.info('deleting file...');
      // fs.unlinkSync(file.path);
      // console.info('delete completed');
    });
};

processData();
