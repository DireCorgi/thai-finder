const https = require('https');
const fs = require('fs');

const getData = (finishCallback) => {
  const start = new Date();
  const file = fs.createWriteStream('data.csv');
  console.info('fetching data...');
  https.get("https://data.cityofnewyork.us/api/views/43nn-pn8j/rows.csv?accessType=DOWNLOAD", function(response) {
    response.pipe(file).on(
      'finish', () => {
        console.info('file download completed');
        const end = new Date() - start;
        console.info('Execution time: %dms', end)
        finishCallback(file);
      }
    );
  });

}

module.exports = getData;
