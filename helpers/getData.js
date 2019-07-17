const fs = require('fs');
const axios = require('axios');

const getData = async () => {
  const file = fs.createWriteStream('data.csv');
  const url = 'https://data.cityofnewyork.us/api/views/43nn-pn8j/rows.csv?accessType=DOWNLOAD';
  console.info('fetching data...');
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(file);

  return new Promise((resolve, reject) => {
    file.on('finish', () => resolve(file));
    file.on('error', reject);
  });
};

module.exports = getData;
