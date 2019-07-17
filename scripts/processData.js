const csv = require('csv-parser');
const fs = require('fs');
const pool = require('../db/queries');

let counter = 0;

fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', row => {
    counter++;
    if (counter < 500) {
      const query = `
        INSERT INTO restaurants (CAMIS, name, address, zipcode, phone, cuisine_type)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (camis)
        DO NOTHING
      `;
      pool.query(query, [
        row.CAMIS,
        row.DBA,
        `${row.BUILDING} ${row.STREET}`,
        row.ZIPCODE,
        row.PHONE,
        row['CUISINE DESCRIPTION']
      ], (error, _) => {
        if (error) {
          console.log(error);
        }
      });
    }
  });
