const queries = {
  getBPlusRatedThai: (pool, { all }) =>
    pool.query(
      `
        SELECT *
        FROM restaurants
        WHERE ${all ? '' : "current_grade IN ('A', 'B') AND"} cuisine_type = 'Thai'
      `
    )
};

module.exports = queries;
