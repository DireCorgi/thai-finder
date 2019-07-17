const { getBPlusRatedThai } = require('../../db/queries');

describe('getBPlusRatedThai', () => {
  let pool;

  beforeEach(() => {
    pool = { query: jest.fn() };
  });

  it('should create the right query', () => {
    getBPlusRatedThai(pool);
    expect(pool.query).toBeCalledWith(
      "SELECT * FROM restaurants WHERE current_grade IN ('A', 'B') AND cuisine_type = 'Thai'"
    );
  });

  it('will disregard the current grade when the all option is passed', () => {
    getBPlusRatedThai(pool, { all: true });
    expect(pool.query).toBeCalledWith(
      "SELECT * FROM restaurants WHERE cuisine_type = 'Thai'"
    );
  });
});
