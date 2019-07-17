const csv = require('csv-parser');  
const fs = require('fs');

let counter = 0;

fs.createReadStream('data.csv')  
  .pipe(csv())
  .on('data', (row) => {
    counter++;
    if (counter < 50) {
      console.log(row);
    }
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });
