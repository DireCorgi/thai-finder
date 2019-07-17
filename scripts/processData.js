const csv = require('csv-parser');
const fs = require('fs');
const pool = require('../db');
const getData = require('../helpers/getData');
const batchInsert = require('../db/batchInsert');

let batchInsertRestaurants = {};
let batchInsertInspections = {};

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
      if (row['CUISINE DESCRIPTION'] === 'Thai') {
        if (!batchInsertRestaurants[row.CAMIS]) {
          batchInsertRestaurants[row.CAMIS] = [
            row.CAMIS,
            row.DBA || 'N/A',
            `${row.BUILDING} ${row.STREET}`,
            row.ZIPCODE,
            row.PHONE,
            row['CUISINE DESCRIPTION']
          ];
        }
        const inspectionKey = `${row.CAMIS}-${row['INSPECTION DATE']}-${row['INSPECTION TYPE']}`;
        if (!batchInsertInspections[inspectionKey]) {
          batchInsertInspections[inspectionKey] = [
            row.CAMIS,
            row['INSPECTION DATE'],
            row.grade,
            row.score,
            row['GRADE DATE'] || null,
            row['RECORD DATE'] || null,
            row['INSPECTION TYPE']
          ];
        }
      }
    })
    .on('end', async () => {
      const restaurants = Object.values(batchInsertRestaurants);
      console.info(`Finished Processing ${restaurants.length} records; Inserting into DB...`);
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
          batchValues: restaurants
        });
      } catch (error) {
        console.error('Error Updating Database For Restaurants:', error);
        return;
      }
      console.info('Finished updating/inserting restaurants', result.rowCount, 'rows');
      const inspections = Object.values(batchInsertInspections);
      try {
        result = await batchInsert({
          pool,
          tableName: 'inspections',
          columnNames: [
            'camis',
            'inspection_date',
            'grade',
            'score',
            'grade_date',
            'record_date',
            'inspection_type'
          ],
          additionalQuery: 'ON CONFLICT (camis, inspection_date, inspection_type) DO NOTHING',
          batchValues: inspections
        });
      } catch (error) {
        console.error('Error Updating Database For Inspections:', error);
        return;
      }
      console.info('Finished updating/inserting inspections', result.rowCount, 'rows');
      // console.info('deleting file...');
      // fs.unlinkSync(file.path);
      // console.info('delete completed');
    });
};

processData();
