const queries = {
  getBPlusRatedThai: pool =>
    pool.query(
      `
        SELECT *
        FROM restaurants
        WHERE current_grade IN ('A', 'B') AND cuisine_type = 'Thai'
      `
    )
};

module.exports = queries;
