const queries = {
  getBPlusRatedThai: (pool, options = {}) =>
    pool.query(
      `SELECT * FROM restaurants WHERE ${options.all ? '' : "current_grade IN ('A', 'B') AND "}cuisine_type = 'Thai'`
    )
};

module.exports = queries;
