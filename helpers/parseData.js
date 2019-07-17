const parseData = {
  parseRestaurant: row => {
    return [
      row.CAMIS,
      row.DBA || 'N/A',
      `${row.BUILDING} ${row.STREET}`,
      row.ZIPCODE,
      row.PHONE,
      row['CUISINE DESCRIPTION'],
      row.GRADE
    ];
  },
  parseInspection: row => {
    return [
      row.CAMIS,
      row['INSPECTION DATE'],
      row.GRADE,
      row.SCORE || null,
      row['GRADE DATE'] || null,
      row['RECORD DATE'] || null,
      row['INSPECTION TYPE']
    ];
  }
};

module.exports = parseData;
