require('dotenv').config();
const csv = require('csv-parser');
const fs = require('fs');
const pool = require('../db');
const getData = require('../helpers/getData');
const updateGrades = require('../db/updateGrades');
const { parseRestaurant, parseInspection } = require('../helpers/parseData');
const { updateRestaurants, updateInspections } = require('../db/updateData');

const batchInsertRestaurants = {};
const batchInsertInspections = {};

const _processRow = row => {
  if (row['CUISINE DESCRIPTION'] === 'Thai') {
    if (!batchInsertRestaurants[row.CAMIS]) {
      batchInsertRestaurants[row.CAMIS] = parseRestaurant(row);
    }
    const inspectionKey = `${row.CAMIS}-${row['INSPECTION DATE']}-${row['INSPECTION TYPE']}`;
    if (!batchInsertInspections[inspectionKey]) {
      batchInsertInspections[inspectionKey] = parseInspection(row);
    }
  }
};

const _updateDatabase = async () => {
  const restaurants = Object.values(batchInsertRestaurants);
  console.info(`Finished Processing ${restaurants.length} records; Inserting into DB...`);
  let restaurantResult;
  try {
    restaurantResult = await updateRestaurants({ pool, restaurants });
  } catch (error) {
    console.error('Error Updating Database For Restaurants:', error);
    return;
  }
  console.info('Finished updating/inserting restaurants', restaurantResult.rowCount, 'rows');
  const inspections = Object.values(batchInsertInspections);
  let inspectionsResult;
  try {
    inspectionsResult = await updateInspections({ pool, inspections });
  } catch (error) {
    console.error('Error Updating Database For Inspections:', error);
    return;
  }
  console.info('Finished updating/inserting inspections', inspectionsResult.rowCount, 'rows');
  return { inspectionsResult, restaurantResult };
};

const processData = async () => {
  let file;
  try {
    file = await getData();
  } catch (error) {
    console.error('Error Downloading', error);
    return;
  }
  file = { path: 'data.csv' };
  fs.createReadStream(file.path)
    .pipe(csv())
    .on('data', _processRow)
    .on('end', async () => {
      await _updateDatabase();
      console.info('updating denormalized grades field...');
      updateGrades(pool);
      console.info('deleting file...');
      fs.unlink(file.path, () => console.info('delete completed'));
    });
};

processData();
