const https = require('https');
const fs = require('fs');
const file = fs.createWriteStream("data.csv");
console.log('fetching data...');
const request = https.get("https://data.cityofnewyork.us/api/views/43nn-pn8j/rows.csv?accessType=DOWNLOAD", function(response) {
  response.pipe(file).on('finish', () => console.log('completed'));
});
