const { parseRestaurant, parseInspection } = require('../../helpers/parseData');
const mockRow = require('../mocks/mockRow');

describe('parseRestaurant', () => {
  it('should parse the right data', () => {
    const row = Object.assign({}, mockRow);
    expect(parseRestaurant(row)).toEqual([
      '30075445',
      'MORRIS PARK BAKE SHOP',
      '1007 MORRIS PARK AVE',
      '10462',
      '7188924968',
      'Bakery',
      'A'
    ]);
  });
});

describe('parseInspection', () => {
  it('should parse the right data', () => {
    const row = Object.assign({}, mockRow);
    expect(parseInspection(row)).toEqual([
      '30075445',
      '06/11/2019',
      'A',
      '6',
      '06/11/2019',
      '07/16/2019',
      'Cycle Inspection / Re-inspection'
    ]);
  });
});
