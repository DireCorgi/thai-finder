const batchInsert = require('../db/batchInsert');

const updateData = {
  updateRestaurants: ({ pool, restaurants }) => {
    return batchInsert({
      pool,
      tableName: 'restaurants',
      columnNames: [
        'camis',
        'name',
        'address',
        'zipcode',
        'phone',
        'cuisine_type',
        'current_grade'
      ],
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
  },
  updateInspections: ({ pool, inspections }) => {
    return batchInsert({
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
  }
}

module.exports = updateData;