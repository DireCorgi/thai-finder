require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const pool = require('./db');
const { getBPlusRatedThai } = require('./db/queries');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get('/', (_, response) => {
  response.send('Try curling or sending a get request to /get_thai_places');
});

app.get('/get_thai_places', async (request, response) => {
  const all = request.query.all;
  const data = await getBPlusRatedThai(pool, { all });
  response.json(data.rows);
});

app.listen(port, () => {
  console.info(`App running on port ${port}.`);
});
